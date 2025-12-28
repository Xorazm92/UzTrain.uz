# 🛡️ Mehnat Muhofazasi Reyting Tizimi

**O'zbekiston Temir Yo'llari AJ** uchun professional mehnat muhofazasi (workplace safety) reyting va monitoring tizimi.

## 🌟 Asosiy Xususiyatlar

### ✅ To'liq Funksionallik
- **15 KPI Metrics** - ISO 45001, OSHA, ILO standartlariga asoslangan
- **Hierarchical Organization** - Ko'p darajali tashkiliy tuzilma
- **Role-Based Access Control** - Admin, Manager, Supervisor, User rollari
- **Real-time Ranking** - Jonli reyting jadvali va statistika
- **Risk-Based Scoring** - Xavf darajasiga qarab baholash tizimi
- **Data Export/Import** - JSON formatida ma'lumotlarni eksport/import qilish
- **Beautiful UI** - Modern, responsive dizayn

### 📊 KPI Ko'rsatkichlari (15 Band)

1. **Baxtsiz hodisalar (LTIFR)** - 40% vazn
2. **TRIR / Mikro-jarohatlar** - 10% vazn
3. **Bexavfsiz kunlar** - 6% vazn
4. **O'qitish qamrovi** - 5% vazn
5. **Uskuna nazorati** - 6% vazn
6. **SHHV ta'minoti** - 5% vazn
7. **Xavfni baholash** - 5% vazn
8. **Profilaktika xarajatlari** - 4% vazn
9. **Xabarlar (Near Miss)** - 4% vazn
10. **Murojaatga reaksiya** - 4% vazn
11. **Nazorat rejasi** - 3% vazn
12. **Kasbiy kasalliklar** - 2% vazn
13. **Audit samaradorligi** - 2% vazn
14. **Avariya mashqlari** - 2% vazn
15. **Intizomiy buzilishlar** - 2% vazn

### 🎯 Xavf Darajalariga Qarab Baholash

- **Yuqori Xavf** (HIGH): Lokomotiv, Vagon, Yo'l xo'jaligi
- **O'rtacha Xavf** (MEDIUM): Elektr, Harakatni boshqarish
- **Past Xavf** (LOW): Ofis ishlari

### 🔐 Foydalanuvchi Rollari

| Roll | Huquqlar |
|------|----------|
| **Admin** | To'liq huquq - barcha funksiyalar |
| **Manager** | Ko'rish, qo'shish, tahrirlash, eksport |
| **Supervisor** | Ko'rish, qo'shish, tahrirlash (o'z tashkiloti) |
| **User** | Faqat ko'rish |

## 🚀 O'rnatish va Ishga Tushirish

### Talablar
- Node.js 18+ 
- npm yoki bun

### O'rnatish

```bash
# Dependencies o'rnatish
npm install

# Development server ishga tushirish
npm run dev

# Production build
npm run build

# Production preview
npm run preview
```

### Test Hisoblari

Tizimga kirish uchun quyidagi test hisoblaridan foydalaning:

| Login | Parol | Roll |
|-------|-------|------|
| admin | admin123 | Administrator |
| manager | manager123 | Menejer |
| supervisor | super123 | Nazoratchi |
| user | user123 | Foydalanuvchi |

## 🗄️ Database (Supabase)

Loyiha Supabase backend ishlatadi. Konfiguratsiya:

```typescript
// src/lib/supabase.ts
const SUPABASE_URL = 'https://uqxtzlmdvmseirolfwgq.supabase.co';
const SUPABASE_ANON_KEY = '...';
```

### Database Schema

```sql
CREATE TABLE companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  level TEXT NOT NULL,
  parent TEXT,
  profile TEXT NOT NULL,
  employees INTEGER NOT NULL,
  total_hours INTEGER,
  kpis JSONB NOT NULL,
  overall_index DECIMAL NOT NULL,
  zone TEXT NOT NULL,
  date_added TIMESTAMP NOT NULL,
  raw_data JSONB,
  updated_at TIMESTAMP NOT NULL
);
```

## 📁 Loyiha Tuzilmasi

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── Layout.tsx      # Main layout
│   ├── Navbar.tsx      # Navigation
│   └── ...
├── pages/              # Page components
│   ├── Login.tsx       # Login page
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Companies.tsx   # Companies list
│   └── ...
├── lib/                # Utilities and configs
│   ├── auth/          # Authentication
│   ├── constants/     # KPI configs
│   ├── data/          # Organization data
│   ├── utils/         # KPI calculator
│   └── supabase.ts    # Database client
└── hooks/             # Custom React hooks
```

## 🎨 Texnologiyalar

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router v6
- **State Management**: React Query

## 📖 Foydalanish

### 1. Tizimga Kirish
- `/login` sahifasiga o'ting
- Test hisoblaridan birini kiriting

### 2. Dashboard
- Korxonalar reytingini ko'ring
- Top 3 eng yaxshi korxonalar
- Statistika va grafiklar
- Tashkilot bo'yicha filtrlash

### 3. Korxona Qo'shish
- "Korxona Qo'shish" tugmasini bosing
- Asosiy ma'lumotlarni kiriting
- 15 ta KPI ko'rsatkichlarini to'ldiring
- Saqlash

### 4. Reyting Ko'rish
- Barcha korxonalar reytingi
- Zona bo'yicha filtrlash (Yashil/Sariq/Qizil)
- Tashkilot ierarxiyasi bo'yicha filtrlash

### 5. Eksport/Import
- Ma'lumotlarni JSON formatida eksport qilish
- Backup yaratish
- Ma'lumotlarni import qilish

## 🔧 Konfiguratsiya

### KPI Vaznlarini O'zgartirish

```typescript
// src/lib/constants/kpi-config.ts
export const KPI_CONFIG = {
  ltifr: {
    name: "Baxtsiz hodisalar",
    weight: 0.40,  // 40%
    // ...
  },
  // ...
};
```

### Xavf Profillarini Sozlash

```typescript
// src/lib/constants/kpi-config.ts
export const RISK_PROFILES = {
  HIGH: {
    minLTIFR: 15,
    minTRIR: 8,
    minTraining: 95,
    // ...
  },
  // ...
};
```

## 📊 Hisoblash Formulalari

### LTIFR (Lost Time Injury Frequency Rate)
```
LTIFR = (Lost Time Injuries × 200,000) / Total Hours Worked
```

### TRIR (Total Recordable Incident Rate)
```
TRIR = (Recordable Incidents × 200,000) / Total Hours Worked
```

### Umumiy Indeks
```
Overall Index = Σ(KPI Score × Weight) - Penalties
```

## 🛠️ Development

### Yangi KPI Qo'shish

1. `kpi-config.ts` ga yangi KPI qo'shing
2. `kpi-calculator.ts` da hisoblash funksiyasini yozing
3. `normalizeKPI` funksiyasiga normalizatsiya qo'shing
4. Form komponentiga input qo'shing

### Yangi Rol Qo'shish

1. `auth.ts` da yangi rol qo'shing
2. `ROLE_PERMISSIONS` da huquqlarni belgilang
3. UI da rol-based rendering qo'shing

## 📝 Litsenziya

© 2025 O'zbekiston Temir Yo'llari AJ  
ISO 45001, OSHA, ILO standartlariga asoslangan

## 🤝 Hissa Qo'shish

Loyihaga hissa qo'shish uchun:
1. Fork qiling
2. Feature branch yarating
3. Commit qiling
4. Push qiling
5. Pull Request oching

## 📞 Aloqa

Savollar yoki muammolar bo'lsa, issue oching yoki bog'laning.

---

**Muhim**: Bu tizim mehnat muhofazasi standartlariga to'liq mos keladi va professional darajada ishlab chiqilgan.
