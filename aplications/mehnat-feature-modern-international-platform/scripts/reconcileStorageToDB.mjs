#!/usr/bin/env node
/*
Reconciles Supabase Storage 'assets' bucket with DB tables by ensuring
that each stored file has a corresponding DB row with a public URL.

Use when local source files are no longer present.

Env required:
  SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
*/
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load env from .env.local first, then fallback to .env
const rootDir = process.cwd();
const envLocal = path.join(rootDir, '.env.local');
const envDefault = path.join(rootDir, '.env');
if (fs.existsSync(envLocal)) dotenv.config({ path: envLocal });
else if (fs.existsSync(envDefault)) dotenv.config({ path: envDefault });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = 'assets';

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
  banners: { table: 'banner', build: (a) => ({ title: a.filename, file_path: a.publicUrl, description: null, kategoriya: 'bannerlar', xavfsizlik_darajasi: 'mehnat_muhofazasi' }) },
};

function escapeFilter(val) {
  return encodeURIComponent(val);
}

async function upsertRow(table, publicUrl, record) {
  const { data: existing, error: selErr } = await supabase
    .from(table)
    .select('*')
    .or(`file_path.eq.${escapeFilter(publicUrl)}`)
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

function isImage(name) {
  return /\.(png|jpg|jpeg|gif|webp|tif|tiff|svg)$/i.test(name);
}

async function listAll(prefix) {
  const results = [];
  let page = 0;
  const limit = 1000;
  while (true) {
    const { data, error } = await supabase.storage.from(BUCKET).list(prefix, {
      limit,
      offset: page * limit,
    });
    if (error) throw new Error(`List error for ${prefix}: ${error.message}`);
    if (!data || data.length === 0) break;
    for (const item of data) {
      if (item.id || item.name) {
        // folders have metadata 'id' undefined and may have type 'folder'
        if (item.metadata && item.metadata.mimetype === 'folder') continue;
        if (item.name && !item.name.endsWith('/')) {
          if (item.name.toLowerCase() === 'thumbs.db') continue;
          results.push(`${prefix}/${item.name}`);
        }
      }
    }
    if (data.length < limit) break;
    page++;
  }
  return results;
}

async function main() {
  const summary = { processed: 0, updated: 0, inserted: 0, failed: 0 };

  for (const key of Object.keys(dirMap)) {
    const top = dirMap[key];
    console.log(`Listing storage prefix: ${top}/`);
    const paths = await listAll(top);
    const tableCfg = tableMap[key];

    for (const storagePath of paths) {
      try {
        const filename = storagePath.split('/').pop();
        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
        const publicUrl = pub.publicUrl;
        const record = tableCfg.build({ filename, publicUrl });
        const res = await upsertRow(tableCfg.table, publicUrl, record);
        summary.processed++;
        if (res.action === 'updated') summary.updated++;
        else summary.inserted++;
        console.log(`[${tableCfg.table}] ${res.action}:`, filename);
      } catch (e) {
        summary.failed++;
        console.error('Failed:', storagePath, e.message);
      }
    }
  }

  console.log('Done. Reconcile summary:', summary);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
