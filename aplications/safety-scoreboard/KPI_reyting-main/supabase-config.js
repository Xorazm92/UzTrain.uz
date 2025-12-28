// ===================================
// SUPABASE CONFIGURATION
// NBT-KPI Multi-Company Rating System
// ===================================

const SUPABASE_URL = 'https://uqxtzlmdvmseirolfwgq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxeHR6bG1kdm1zZWlyb2xmd2dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NzQ1ODUsImV4cCI6MjA4MDA1MDU4NX0.Hzol82Uz0gxOX1lsgFB-zLmt3uuoRB8Dsrkx6vE9C5k';

// Initialize Supabase
let supabase;
let db;

try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    db = supabase; // For compatibility
    console.log("✅ Supabase (NBT-KPI) muvaffaqiyatli ulandi!");
} catch (error) {
    console.error("❌ Supabase ulanishda xatolik:", error);
    alert("Supabase ulanmadi. Internetni tekshiring.");
}
