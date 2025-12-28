# "MM-CONTROL" Loyihasi Yo'l Xaritasi (Roadmap)

## 0-FAZA: FOJDEVOR VA STRATEGIYA (1-Hafta)

- [x] **1-Qadam: KPI Metodologiyasini "Qotirish" (Tasdiqlash).**
  - KPI ro'yxati va vaznlarini `docs/METHODOLOGY_QOLLANMA.md` da hujjatlashtirish.
- [x] **2-Qadam: Texnologik Stackni Tanlash.**
  - **Frontend:** React.js (Vite), Shadcn UI / MUI.
  - **Backend:** Node.js (Express.js).
  - **Database:** PostgreSQL + PostGIS (Geo-ma'lumotlar uchun).
  - **Map:** Leaflet.js.
- [x] **3-Qadam: Loyiha Arxitekturasini Chizish.**
  - Arxitektura diagrammasini yaratish (`docs/ARCHITECTURE.md`).

## 1-FAZA: BACKEND VA MA'LUMOTLAR BAZASI (2-3 Haftalar)

- [x] **4-Qadam: Ma'lumotlar Bazasi (DB) Sxemasini Yaratish.**
  - `companies`, `departments`, `kpi_monthly_data`, `users`, `accidents`, `geo_data` jadvallarini loyihalash.
- [x] **5-Qadam: API Endpointlarini Yaratish.**
  - `/api/login`, `/api/companies`, `/api/dashboard`, `/api/data-entry` va boshqalar.
- [x] **6-Qadam: Hisoblash Dvigatelini (Calculation Engine) Yaratish.**
  - KPI hisoblash logikasini Backendda implementatsiya qilish.

## 2-FAZA: FRONTEND VA UI/UX DIZAYN (4-6 Haftalar)

- [x] **7-Qadam: Asosiy Sahifalarni Yaratish.**
  - Login, Dashboard, Data Entry, Management sahifalari.
- [x] **8-Qadam: Interaktiv Xaritani (GIS) Integratsiya Qilish.**
  - Leaflet.js orqali O'zbekiston xaritasi va korxonalar joylashuvi.
- [x] **9-Qadam: "Dashboard"ni Mukammal Ko'rinishga Keltirish.**
  - Charts, Gauges, Automatic Recommendations.
- [x] **10-Qadam: Ma'lumot Kiritish Formasini "Aqlli" Qilish.**
  - Validatsiya va qulay interfeys.

## 3-FAZA: INTEGRATSIYA VA ISHGA TUSHIRISH ("DEPLOY") (7-Hafta)

- [x] **11-Qadam: Frontend va Backendni Bog'lash.**
  - API ulanishi va Environment variables (Supabase via Client).
- [x] **12-Qadam: Tizimni Internetga Joylashtirish.**
  - Build tayyor (`dist/`). Deploy uchun `DEPLOY.md` ga qarang.
- [x] **13-Qadam: GLOBAL DASHBOARD (Command Center) Yaratish.**
  - MTU kesimida hududiy tahlil
  - SVG-based interaktiv xarita
  - 6 ta MTU bo'yicha agregatsiya
  - Real-time ma'lumotlar

## 4-FAZA: ISHGA TUSHIRISHDAN KEYINGI JARAYONLAR

- [ ] **14-Qadam: Sinovdan O'tkazish (UAT).**
- [ ] **15-Qadam: Hujjatlashtirish va O'qitish.**
- [ ] **16-Qadam: Kelajakdagi Rivojlanish.**
