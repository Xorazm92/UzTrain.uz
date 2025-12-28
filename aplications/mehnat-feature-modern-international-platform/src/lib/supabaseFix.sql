-- Supabase Database Fix for Large Images
-- Run this SQL in Supabase Dashboard > SQL Editor

-- 1. First, check current column types
SELECT table_name, column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name IN ('banner', 'normativ_huquqiy_hujjatlar', 'video_materiallar', 'slaydlar', 'kasb_yoriqnomalari', 'temir_yol_hujjatlari', 'qonunlar', 'qarorlar', 'qoidalar')
AND column_name IN ('file_path', 'video_url', 'description', 'content', 'titleblob');

-- 2. Update all file_path columns to TEXT (unlimited size)
ALTER TABLE banner ALTER COLUMN file_path TYPE TEXT;
ALTER TABLE normativ_huquqiy_hujjatlar ALTER COLUMN file_path TYPE TEXT;
ALTER TABLE video_materiallar ALTER COLUMN file_path TYPE TEXT;
ALTER TABLE video_materiallar ALTER COLUMN video_url TYPE TEXT;
ALTER TABLE slaydlar ALTER COLUMN file_path TYPE TEXT;
ALTER TABLE kasb_yoriqnomalari ALTER COLUMN file_path TYPE TEXT;
ALTER TABLE temir_yol_hujjatlari ALTER COLUMN file_path TYPE TEXT;
ALTER TABLE qonunlar ALTER COLUMN file_path TYPE TEXT;
ALTER TABLE qarorlar ALTER COLUMN file_path TYPE TEXT;
ALTER TABLE qoidalar ALTER COLUMN file_path TYPE TEXT;

-- 2. Update description and content columns to TEXT
ALTER TABLE banner ALTER COLUMN description TYPE TEXT;
ALTER TABLE normativ_huquqiy_hujjatlar ALTER COLUMN content TYPE TEXT;
ALTER TABLE video_materiallar ALTER COLUMN description TYPE TEXT;
ALTER TABLE slaydlar ALTER COLUMN description TYPE TEXT;
ALTER TABLE kasb_yoriqnomalari ALTER COLUMN content TYPE TEXT;
ALTER TABLE temir_yol_hujjatlari ALTER COLUMN content TYPE TEXT;
ALTER TABLE qonunlar ALTER COLUMN content TYPE TEXT;
ALTER TABLE qarorlar ALTER COLUMN content TYPE TEXT;
ALTER TABLE qoidalar ALTER COLUMN content TYPE TEXT;

-- 3. Disable Row Level Security for all tables
ALTER TABLE banner DISABLE ROW LEVEL SECURITY;
ALTER TABLE normativ_huquqiy_hujjatlar DISABLE ROW LEVEL SECURITY;
ALTER TABLE video_materiallar DISABLE ROW LEVEL SECURITY;
ALTER TABLE slaydlar DISABLE ROW LEVEL SECURITY;
ALTER TABLE kasb_yoriqnomalari DISABLE ROW LEVEL SECURITY;
ALTER TABLE temir_yol_hujjatlari DISABLE ROW LEVEL SECURITY;
ALTER TABLE qonunlar DISABLE ROW LEVEL SECURITY;
ALTER TABLE qarorlar DISABLE ROW LEVEL SECURITY;
ALTER TABLE qoidalar DISABLE ROW LEVEL SECURITY;

-- 4. Create public policies (alternative to disabling RLS)
-- Uncomment these if you prefer to keep RLS enabled:

/*
CREATE POLICY "Enable all operations for all users" ON banner
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for all users" ON normativ_huquqiy_hujjatlar
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for all users" ON video_materiallar
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for all users" ON slaydlar
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for all users" ON kasb_yoriqnomalari
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for all users" ON temir_yol_hujjatlari
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for all users" ON qonunlar
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for all users" ON qarorlar
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for all users" ON qoidalar
FOR ALL USING (true) WITH CHECK (true);
*/

-- 5. Verify changes
SELECT 
    table_name, 
    column_name, 
    data_type, 
    character_maximum_length
FROM information_schema.columns 
WHERE table_name IN (
    'banner', 'normativ_huquqiy_hujjatlar', 'video_materiallar', 
    'slaydlar', 'kasb_yoriqnomalari', 'temir_yol_hujjatlari',
    'qonunlar', 'qarorlar', 'qoidalar'
) 
AND column_name IN ('file_path', 'description', 'content', 'video_url')
ORDER BY table_name, column_name;
