const fs = require('fs');
const https = require('https');

// Config
const SUPABASE_URL = 'uqxtzlmdvmseirolfwgq.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxeHR6bG1kdm1zZWlyb2xmd2dxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDQ3NDU4NSwiZXhwIjoyMDgwMDUwNTg1fQ.gHeVXem-V4N_aM6euO-BE3EZ1XIYOAma3piDjfpPIVc';

// Read JSON file
const rawData = fs.readFileSync('MM_Reyting_2025-12-02.json');
const jsonData = JSON.parse(rawData);

// Extract companies array
let companies = [];
if (Array.isArray(jsonData)) {
    companies = jsonData;
} else if (jsonData.companies) {
    companies = jsonData.companies;
}

console.log(`Found ${companies.length} companies.`);

// Transform data to snake_case for Supabase
const supabaseData = companies.map(c => ({
    id: c.id,
    name: c.name,
    level: c.level || null,
    parent: c.parent || null,
    profile: c.profile || null,
    employees: c.employees || 0,
    total_hours: c.totalHours || c.total_hours || 0,
    overall_index: c.overallIndex || c.overall_index || 0,
    zone: c.zone || null,
    date_added: c.dateAdded || c.date_added || new Date().toISOString(),
    raw_data: c.rawData || c.raw_data || {},
    kpis: c.kpis || {}
}));

// Upload in batches of 10 to avoid payload limits
const BATCH_SIZE = 10;

async function uploadBatch(batch, index) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(batch);

        const options = {
            hostname: SUPABASE_URL,
            path: '/rest/v1/companies',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SERVICE_KEY,
                'Authorization': `Bearer ${SERVICE_KEY}`,
                'Prefer': 'resolution=merge-duplicates' // Upsert
            }
        };

        const req = https.request(options, (res) => {
            let responseBody = '';
            res.on('data', (chunk) => responseBody += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    console.log(`Batch ${index + 1}: Success`);
                    resolve();
                } else {
                    console.error(`Batch ${index + 1}: Failed (${res.statusCode})`);
                    console.error(responseBody);
                    // If table doesn't exist, we'll see it here
                    reject(new Error(responseBody));
                }
            });
        });

        req.on('error', (e) => {
            console.error(`Batch ${index + 1}: Error`, e);
            reject(e);
        });

        req.write(data);
        req.end();
    });
}

async function run() {
    for (let i = 0; i < supabaseData.length; i += BATCH_SIZE) {
        const batch = supabaseData.slice(i, i + BATCH_SIZE);
        try {
            await uploadBatch(batch, i / BATCH_SIZE);
        } catch (e) {
            console.error("Stopping due to error.");
            break;
        }
    }
}

run();
