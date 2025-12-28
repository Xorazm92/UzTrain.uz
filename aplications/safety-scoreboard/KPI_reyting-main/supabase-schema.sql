-- ===================================
-- SUPABASE DATABASE SCHEMA
-- NBT-KPI Multi-Company Rating System
-- ===================================

-- 1. Companies jadvali
CREATE TABLE IF NOT EXISTS companies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    level TEXT,
    parent TEXT,
    profile TEXT,
    employees INTEGER DEFAULT 0,
    total_hours INTEGER DEFAULT 0,
    overall_index DECIMAL(5,2) DEFAULT 0,
    zone TEXT,
    date_added TIMESTAMP DEFAULT NOW(),
    raw_data JSONB,
    kpis JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Index'lar (tezlik uchun)
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
CREATE INDEX IF NOT EXISTS idx_companies_level ON companies(level);
CREATE INDEX IF NOT EXISTS idx_companies_parent ON companies(parent);
CREATE INDEX IF NOT EXISTS idx_companies_zone ON companies(zone);
CREATE INDEX IF NOT EXISTS idx_companies_overall_index ON companies(overall_index DESC);

-- 3. Row Level Security (RLS) yoqish
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- 4. Policies (hozircha barcha uchun ochiq)
DROP POLICY IF EXISTS "Enable read access for all users" ON companies;
CREATE POLICY "Enable read access for all users" 
ON companies FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Enable insert for all users" ON companies;
CREATE POLICY "Enable insert for all users" 
ON companies FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update for all users" ON companies;
CREATE POLICY "Enable update for all users" 
ON companies FOR UPDATE 
USING (true);

DROP POLICY IF EXISTS "Enable delete for all users" ON companies;
CREATE POLICY "Enable delete for all users" 
ON companies FOR DELETE 
USING (true);

-- 5. Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Tayyor! ✅
