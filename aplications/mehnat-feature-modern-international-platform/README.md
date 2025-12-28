# 🚂 UzTrain Platform - O'zbekiston Temir Yo'l Ta'limi Platformasi

O'zbekiston temir yo'llari xodimlari uchun zamonaviy ta'lim va malaka oshirish platformasi. React, TypeScript, Tailwind CSS va Supabase texnologiyalari asosida qurilgan.

## ✨ Xususiyatlar

- 🎯 **Modern UI/UX** - Tailwind CSS va shadcn/ui komponentlari
- 🚂 **Temir yo'l ta'limi** - Temir yo'l sohasiga ixtisoslashgan materiallar
- 📱 **PWA Support** - Progressive Web App funksiyalari
- 🌐 **Internationalization** - Ko'p tilni qo'llab-quvvatlash (O'zbek, Rus, Ingliz)
- 💾 **Smart Database** - Supabase va local fallback
- 📁 **File Management** - Fayl yuklash va saqlash
- 🎨 **Admin Panel** - To'liq CRUD operatsiyalari
- 🔄 **Real-time Updates** - Jonli yangilanishlar
- 📊 **Analytics** - Foydalanish statistikasi

## 🚀 Tezkor Boshlash

### 🎯 Eng Tez Usul (Tavsiya etiladi)
```bash
# Avtomatik setup va ishga tushirish
./quick-start.sh
```

### 📋 Qo'lda Usul

#### Talablar
- Node.js 18+
- NPM 8+
- Git

#### O'rnatish

```bash
# Repository'ni clone qiling
git clone https://github.com/Xorazm92/mehnat.git
cd mehnat

# Dependencies o'rnating (legacy peer deps bilan)
npm install --legacy-peer-deps

# Development server'ni ishga tushiring
npm run dev

# Brauzerda oching: http://localhost:8084
```

### 🔧 Qo'shimcha Skriptlar

```bash
# Loyiha holatini tekshirish
./check-status.sh

# Production build
npm run build

# Testlarni o'tkazish
npm test

# Deployment
./deploy.sh

# Preview (build dan keyin)
npm run preview
```

### Environment Variables

`.env.local` fayl yarating:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📁 Loyiha Strukturasi

```
src/
├── components/          # UI komponentlar
│   ├── ui/             # shadcn/ui komponentlar
│   └── admin/          # Admin panel komponentlar
├── pages/              # Sahifalar
│   ├── admin/          # Admin sahifalar
│   └── ...             # Public sahifalar
├── lib/                # Utility funksiyalar
│   ├── smartDB.ts      # Database abstraction
│   ├── fileUpload.ts   # Fayl yuklash
│   └── errorHandler.ts # Xatolik boshqaruvi
├── hooks/              # Custom hooks
├── i18n/               # Internationalization
└── integrations/       # Tashqi integratsiyalar
```

## 🛠️ Texnologiyalar

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage + Local fallback
- **State Management**: React Query, Zustand
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **PWA**: Vite PWA Plugin

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## 🚀 Deploy qilish

### Vercel (Tavsiya etiladi)

1. **GitHub'ga push qiling**:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Vercel'da deploy qiling**:
   - [Vercel](https://vercel.com) saytiga kiring
   - GitHub repository'ni import qiling
   - Environment variables qo'shing:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Deploy tugmasini bosing

### Netlify

1. **Netlify'da deploy qiling**:
   - [Netlify](https://netlify.com) saytiga kiring
   - GitHub repository'ni bog'lang
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment variables qo'shing

### Docker

```bash
# Docker image yarating
docker build -t nbt-platform .

# Container ishga tushiring
docker run -p 80:80 nbt-platform

# Yoki Docker Compose ishlatib:
docker-compose up -d
```

### Manual Deploy

```bash
# Build yarating
npm run build

# dist/ papkasini server'ga yuklang
# Nginx yoki Apache konfiguratsiya qiling
```

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
