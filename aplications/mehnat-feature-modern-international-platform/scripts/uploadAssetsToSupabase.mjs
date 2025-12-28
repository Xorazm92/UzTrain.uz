#!/usr/bin/env node
/*
Uploads files from src/assets/resources/files/** to Supabase Storage
and updates DB tables to point file_path to the public storage URLs.

Requirements:
- Environment variables:
  SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
- Bucket: will create/use bucket named 'assets'

Run:
  node scripts/uploadAssetsToSupabase.mjs
*/
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load env from .env.local first, then fallback to .env
const rootDir = process.cwd();
const envLocal = path.join(rootDir, '.env.local');
const envDefault = path.join(rootDir, '.env');
if (fs.existsSync(envLocal)) {
  dotenv.config({ path: envLocal });
} else if (fs.existsSync(envDefault)) {
  dotenv.config({ path: envDefault });
}

const ROOT = path.resolve(process.cwd());
const ASSETS_DIR = path.join(ROOT, 'src', 'assets', 'resources', 'files');
const BUCKET = 'assets';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

const dirMap = {
  laws: 'qonunlar',
  rules: 'qaror',
  slides: 'mmm-prezentatsiya',
  railway: 'mmm-temir-yol',
  manuals: 'mmm-kasb-yoriqnomalari',
  banners: 'mmm-bannerlar',
};

const tableMap = {
  laws: { table: 'normativ_huquqiy_hujjatlar', build: (a) => ({ title: a.filename, file_path: a.publicUrl, content: null, xavfsizlik_darajasi: 'mehnat_muhofazasi', kategoriya: 'qonunlar' }) },
  rules: { table: 'qarorlar', build: (a) => ({ titleblob: a.filename, file_path: a.publicUrl, content: null, xavfsizlik_darajasi: 'mehnat_muhofazasi' }) },
  slides: { table: 'slaydlar', build: (a) => ({ title: a.filename, file_path: a.publicUrl, description: null, xavfsizlik_darajasi: 'mehnat_muhofazasi', marzu_turi: null }) },
  railway: { table: 'temir_yol_hujjatlari', build: (a) => ({ title: a.filename, file_path: a.publicUrl, content: null, xavfsizlik_darajasi: 'mehnat_muhofazasi' }) },
  manuals: { table: 'kasb_yoriqnomalari', build: (a) => ({ kasb_nomi: a.filename, file_path: a.publicUrl, content: null, xavfsizlik_darajasi: 'mehnat_muhofazasi' }) },
  banners: { table: 'banner', build: (a) => ({ title: a.filename, file_path: a.publicUrl, description: null, kategoriya: 'bannerlar' }) },
};

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files = files.concat(walkDir(fullPath));
    else files.push(fullPath);
  }
  return files;
}

async function ensureBucket() {
  // Try to create bucket (ignore error if exists)
  try {
    const { data, error } = await supabase.storage.createBucket(BUCKET, { public: true });
    if (error && !String(error.message || '').includes('already exists')) {
      console.warn('Bucket create warning:', error.message);
    } else if (!error) {
      console.log('Bucket created:', BUCKET);
    }
  } catch (e) {
    console.warn('Bucket create exception (likely exists):', e.message);
  }
}

async function uploadFile(localPath, storagePath) {
  const fileBuffer = fs.readFileSync(localPath);
  const contentType = mime.lookup(localPath) || 'application/octet-stream';
  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, fileBuffer, {
    contentType,
    upsert: true,
  });
  if (error) throw new Error(`Upload failed for ${storagePath}: ${error.message}`);
  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return pub.publicUrl;
}

async function upsertRow(table, file_path_old, record) {
  // Try find existing by old local path or already-migrated URL
  const { data: existing, error: selErr } = await supabase
    .from(table)
    .select('*')
    .or(`file_path.eq.${escapeFilter(file_path_old)},file_path.eq.${escapeFilter(record.file_path)}`)
    .limit(1);
  if (selErr) throw new Error(`Select error ${table}: ${selErr.message}`);

  if (existing && existing.length > 0) {
    const id = existing[0].id;
    const { error: updErr } = await supabase.from(table).update(record).eq('id', id);
    if (updErr) throw new Error(`Update error ${table}: ${updErr.message}`);
    return { action: 'updated', id };
  } else {
    const { error: insErr } = await supabase.from(table).insert(record);
    if (insErr) throw new Error(`Insert error ${table}: ${insErr.message}`);
    return { action: 'inserted' };
  }
}

function escapeFilter(val) {
  // rudimentary escaping for supabase .or() filter
  return encodeURIComponent(val);
}

async function main() {
  console.log('Scanning assets from', ASSETS_DIR);
  await ensureBucket();

  const all = walkDir(ASSETS_DIR);
  const summary = { uploaded: 0, updated: 0, inserted: 0, failed: 0 };

  // Produce a storage-safe filename: ASCII only, keep dots/dashes/underscores, collapse repeats
  const sanitizeFilename = (name) => {
    const normalized = name.normalize('NFKD');
    const safe = normalized
      .replace(/[^A-Za-z0-9._-]+/g, '_') // replace non-ASCII or special chars with _
      .replace(/_+/g, '_')               // collapse multiple underscores
      .replace(/^_+|_+$/g, '');          // trim underscores
    // Avoid empty names
    return safe.length > 0 ? safe : 'file';
  };

  for (const absPath of all) {
    const rel = path.relative(ASSETS_DIR, absPath).replace(/\\/g, '/');
    const topDir = rel.split('/')[0];
    const filename = path.basename(absPath);

    // resolve category key from topDir
    const catKey = Object.keys(dirMap).find(k => dirMap[k] === topDir);
    if (!catKey) {
      console.log('Skip (unknown folder):', rel);
      continue;
    }

    const storagePath = `${topDir}/${sanitizeFilename(filename)}`;

    try {
      const publicUrl = await uploadFile(absPath, storagePath);
      summary.uploaded++;

      const tableCfg = tableMap[catKey];
      const record = tableCfg.build({ filename, publicUrl });

      // old app-local path used previously
      const oldPath = `/files/${rel}`;
      const res = await upsertRow(tableCfg.table, oldPath, record);
      if (res.action === 'updated') summary.updated++;
      else summary.inserted++;
      console.log(`[${tableCfg.table}] ${res.action}:`, filename);
    } catch (e) {
      summary.failed++;
      console.error('Failed:', rel, e.message);
    }
  }

  console.log('Done. Summary:', summary);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
