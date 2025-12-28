# 🚀 NBT Platform - Deploy Qo'llanmasi

Bu qo'llanma NBT Platform loyihasini turli platformalarga deploy qilish uchun batafsil ko'rsatmalar beradi.

## 📋 Deploy oldidan tekshirish

```bash
# Dependencies o'rnatish
npm install --legacy-peer-deps

# Linting tekshiruvi
npm run lint

# Build yaratish
npm run build

# Local test
npm run preview
```

## 🌐 Vercel Deploy (Tavsiya etiladi)

### 1. GitHub'ga push qiling

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Vercel'da loyihani import qiling

1. [Vercel Dashboard](https://vercel.com/dashboard) ga kiring
2. "New Project" tugmasini bosing
3. GitHub repository'ni tanlang
4. Import qiling

### 3. Environment Variables sozlang

Vercel dashboard'da Settings > Environment Variables bo'limida:

```
VITE_SUPABASE_URL=https://hbzmwbkcogzbgeykxnoc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Build Settings

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install --legacy-peer-deps`

## 🎯 Netlify Deploy

### 1. Netlify'da loyihani bog'lang

1. [Netlify Dashboard](https://app.netlify.com) ga kiring
2. "New site from Git" tugmasini bosing
3. GitHub repository'ni tanlang

### 2. Build Settings

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Environment variables**: Yuqoridagi kabi

### 3. Deploy Settings

`netlify.toml` fayli avtomatik ishlatiladi.

## 🐳 Docker Deploy

### 1. Docker Image yarating

```bash
# Image yaratish
docker build -t nbt-platform .

# Container ishga tushirish
docker run -p 80:80 nbt-platform
```

### 2. Docker Compose

```bash
# Barcha servislarni ishga tushirish
docker-compose up -d

# Loglarni ko'rish
docker-compose logs -f
```

## ☁️ Cloud Providers

### AWS S3 + CloudFront

```bash
# Build yarating
npm run build

# S3 bucket'ga yuklang
aws s3 sync dist/ s3://your-bucket-name --delete

# CloudFront cache'ni tozalang
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### Google Cloud Storage

```bash
# Build yarating
npm run build

# GCS bucket'ga yuklang
gsutil -m rsync -r -d dist/ gs://your-bucket-name
```

## 🔧 Manual Deploy

### 1. Build yarating

```bash
npm run build
```

### 2. Server'ga yuklang

`dist/` papkasidagi barcha fayllarni web server'ingizga yuklang.

### 3. Web Server konfiguratsiyasi

#### Nginx

```nginx
server {
    listen 80;
    server_name uztrain.uz www.uztrain.uz;
    root /path/to/dist;
    index index.html;

    # SPA routing uchun
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static assets cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Apache

```apache
<VirtualHost *:80>
    ServerName uztrain.uz
    ServerAlias www.uztrain.uz
    DocumentRoot /path/to/dist
    
    # SPA routing uchun
    <Directory "/path/to/dist">
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```

## 🔐 Environment Variables

Production uchun kerakli environment variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_TITLE=NBT Platform
VITE_APP_DESCRIPTION=Xavfsizlik Ta'limi Platformasi
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=true
```

## 📊 Performance Monitoring

Deploy qilingandan keyin:

1. **Lighthouse** bilan performance tekshiring
2. **Core Web Vitals** ni monitoring qiling
3. **Error tracking** sozlang (Sentry, LogRocket)
4. **Analytics** qo'shing (Google Analytics, Plausible)

## 🔄 CI/CD Pipeline

GitHub Actions pipeline avtomatik ishga tushadi:

- **Test**: Linting va build tekshiruvi
- **Deploy**: Main branch'ga push qilinganda avtomatik deploy

## 🆘 Troubleshooting

### Build xatolari

```bash
# Cache tozalash
npm run clean
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Dependencies yangilash
npm update
```

### Environment xatolari

- Environment variables to'g'ri sozlanganligini tekshiring
- Supabase URL va key'lar to'g'riligini tasdiqlang

### Performance muammolari

- Bundle analyzer ishlatib chunk'larni tekshiring
- Lazy loading qo'shing
- Image optimization qiling

## 📞 Yordam

Muammolar yuzaga kelsa:

1. [GitHub Issues](https://github.com/Xorazm92/mehnat/issues) da muammo yarating
2. Logs va error message'larni qo'shing
3. Environment va browser ma'lumotlarini ko'rsating
