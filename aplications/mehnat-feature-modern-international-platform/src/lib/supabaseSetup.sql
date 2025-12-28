
-- UzTrain Platform uchun database jadvallarini yaratish

-- 1. Banner jadvali
CREATE TABLE IF NOT EXISTS public.banner (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    image_url TEXT,
    link_url TEXT,
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0
);

-- 2. Video materiallar jadvali
CREATE TABLE IF NOT EXISTS public.video_materiallar (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    duration INTEGER,
    category TEXT DEFAULT 'general',
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    tags TEXT[]
);

-- 3. Slaydlar jadvali
CREATE TABLE IF NOT EXISTS public.slaydlar (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type TEXT DEFAULT 'pdf',
    file_size BIGINT,
    category TEXT DEFAULT 'general',
    is_featured BOOLEAN DEFAULT false,
    download_count INTEGER DEFAULT 0,
    tags TEXT[]
);

-- 4. Normativ huquqiy hujjatlar jadvali
CREATE TABLE IF NOT EXISTS public.normativ_huquqiy_hujjatlar (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    document_number TEXT,
    document_date DATE,
    category TEXT DEFAULT 'general',
    is_active BOOLEAN DEFAULT true,
    download_count INTEGER DEFAULT 0
);

-- 5. Kasb yo'riqnomalari jadvali
CREATE TABLE IF NOT EXISTS public.kasb_yoriqnomalari (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    job_category TEXT,
    difficulty_level TEXT DEFAULT 'beginner',
    is_featured BOOLEAN DEFAULT false,
    download_count INTEGER DEFAULT 0
);

-- 6. Temir yo'l hujjatlari jadvali
CREATE TABLE IF NOT EXISTS public.temir_yol_hujjatlari (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    document_type TEXT DEFAULT 'technical',
    railway_section TEXT,
    is_current BOOLEAN DEFAULT true,
    download_count INTEGER DEFAULT 0
);

-- 7. Qonunlar jadvali
CREATE TABLE IF NOT EXISTS public.qonunlar (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    law_number TEXT,
    adoption_date DATE,
    category TEXT DEFAULT 'general',
    is_active BOOLEAN DEFAULT true
);

-- 8. Qarorlar jadvali
CREATE TABLE IF NOT EXISTS public.qarorlar (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    decision_number TEXT,
    decision_date DATE,
    authority TEXT,
    is_active BOOLEAN DEFAULT true
);

-- 9. Qoidalar jadvali
CREATE TABLE IF NOT EXISTS public.qoidalar (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    rule_number TEXT,
    effective_date DATE,
    category TEXT DEFAULT 'general',
    is_active BOOLEAN DEFAULT true
);

-- Row Level Security (RLS) ni yoqish
ALTER TABLE public.banner ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_materiallar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slaydlar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.normativ_huquqiy_hujjatlar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kasb_yoriqnomalari ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.temir_yol_hujjatlari ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qonunlar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qarorlar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qoidalar ENABLE ROW LEVEL SECURITY;

-- Public access policies
CREATE POLICY "Enable read access for all users" ON public.banner FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.video_materiallar FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.slaydlar FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.normativ_huquqiy_hujjatlar FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.kasb_yoriqnomalari FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.temir_yol_hujjatlari FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.qonunlar FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.qarorlar FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.qoidalar FOR SELECT USING (true);

-- Storage bucket yaratish
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uztrain-files', 'uztrain-files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'uztrain-files');
CREATE POLICY "Allow upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'uztrain-files');

-- Demo ma'lumotlarni qo'shish
INSERT INTO public.banner (title, subtitle, image_url, is_active, order_index) VALUES
('UzTrain Platformasiga Xush Kelibsiz', 'Temir yo''l sohasidagi eng yangi ta''lim materiallari', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&h=400&fit=crop', true, 1),
('Xavfsizlik - Birinchi O''rinda', 'Temir yo''l xavfsizligi bo''yicha qoidalar va yo''riqnomalar', 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=1200&h=400&fit=crop', true, 2)
ON CONFLICT DO NOTHING;

INSERT INTO public.video_materiallar (title, description, video_url, category, is_featured) VALUES
('Temir Yo''l Xavfsizligi Asoslari', 'Xavfsizlik qoidalarining asosiy tamoyillari', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'safety', true),
('Lokomotiv Texnikasi', 'Lokomotivlarning asosiy tuzilishi va ishlash prinsipi', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'technical', false)
ON CONFLICT DO NOTHING;
