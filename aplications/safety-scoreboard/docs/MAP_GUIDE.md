# MM-CONTROL: Global Dashboard Xarita Yo'riqnomasi

## Muammo va Yechim

### Muammo
Xarita Global Dashboard'da ko'rinmayapti yoki ranglanmayapti.

### Yechim

#### 1. Backend Serverni Ishga Tushirish

Terminal 1 (Backend):
```bash
cd server
npm install
npm start
```

Server `http://localhost:5000` da ishga tushadi.

#### 2. Frontend Serverni Ishga Tushirish

Terminal 2 (Frontend):
```bash
npm run dev
```

Frontend `http://localhost:5173` (yoki 8080) da ishga tushadi.

#### 3. Global Dashboard'ga Kirish

Browser'da:
```
http://localhost:5173/global-dashboard
```

### Xarita Qanday Ishlaydi

1. **SVG Fayl**: `/public/uz.svg` - O'zbekiston xaritasi
2. **MTU Mapping**: Har bir MTU o'z viloyatlariga mos keladi:
   - Qo'ng'irot MTU → Qoraqalpog'iston + Xorazm
   - Buxoro MTU → Buxoro + Samarqand + Navoiy
   - Toshkent MTU → Toshkent + Sirdaryo + Jizzax
   - Qo'qon MTU → Namangan + Farg'ona + Andijon
   - Qarshi MTU → Qashqadaryo
   - Termiz MTU → Surxondaryo

3. **Ranglar**:
   - 🟢 Yashil (80+): Yaxshi
   - 🟡 Sariq (50-79): O'rtacha
   - 🔴 Qizil (<50): Qoniqarsiz

### Agar Xarita Ko'rinmasa

1. **Browser Console'ni Tekshiring** (F12):
   - SVG yuklandi mi?
   - API dan ma'lumot keldi mi?

2. **Network Tab'ni Tekshiring**:
   - `/uz.svg` 200 status bilan yuklanganmi?
   - `/api/global-dashboard` ishlayaptimi?

3. **Mock Data**:
   Agar server ishlamasa, avtomatik mock data ishlatiladi.

### Texnik Tafsilotlar

- **Component**: `src/components/Map/UzbekistanMap.tsx`
- **Page**: `src/pages/GlobalDashboard.tsx`
- **Backend**: `server/controllers/globalDashboardController.js`
- **SVG**: `public/uz.svg`

### Qo'shimcha

Xarita faqat **Global Dashboard** sahifasida ko'rinadi.
Oddiy Dashboard'da boshqa xarita (nuqtalar bilan) ishlatiladi.
