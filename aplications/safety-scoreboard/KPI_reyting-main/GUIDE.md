# 🛡️ MM Ko'p Korxonali Reyting Tizimi - To'liq Yo'riqnoma

## 📚 Mundarija

1. [Loyiha Haqida](#loyiha-haqida)
2. [Texnik Arxitektura](#texnik-arxitektura)
3. [Fayllar Tuzilishi](#fayllar-tuzilishi)
4. [15 ta KPI Tushuntirilishi](#15-ta-kpi-tushuntirilishi)
5. [Ma'lumotlar Saqlash (LocalStorage)](#malumotlar-saqlash)
6. [Netlify Deploy Qilish](#netlify-deploy-qilish)
7. [Foydalanish Yo'riqnomasi](#foydalanish-yoriqnomasi)
8. [Muammolarni Hal Qilish](#muammolarni-hal-qilish)

---

## 📋 Loyiha Haqida

### Nima?
Mehnat muhofazasi (MM) samaradorligini bir nechta korxonalar uchun baholash, avtomatik reyting bo'yicha tartiblash, taqqoslash va rang zonalari bilan vizualizatsiya qilish tizimi.

### Kimlar uchun?
- Korxonalar (ichki monitoring)
- Davlat nazorat organlari
- Xavfsizlik bo'limlari
- MM mutaxassislari

### Asosiy Imkoniyatlar
✅ Bir nechta korxonalarni boshqarish  
✅ 15 ta KPI avtomatik hisoblash  
✅ Avtomatik reyting va tartiblash  
✅ Rang zonalari (🟢🟡🔴)  
✅ Podium (🥇🥈🥉)  
✅ Taqqoslash grafiklari  
✅ Export/Import  
✅ Offline ishlash  

---

## 🏗️ Texnik Arxitektura

### Frontend Texnologiyalar

#### 1. HTML5
```html
<!-- Semantik markup -->
<header>, <nav>, <main>, <section>, <footer>

<!-- Form elementlari -->
<input type="number">, <button>, <table>

<!-- Ma'lumotlar ko'rsatish -->
<canvas> (Chart.js uchun)
```

**Nima uchun HTML5?**
- Zamonaviy brauzerlar qo'llab-quvvatlaydi
- Semantik teglar SEO uchun yaxshi
- Accessibility (foydalanish qulayligi)

#### 2. CSS3
```css
/* Zamonaviy xususiyatlar */
- CSS Grid (layout)
- Flexbox (alignment)
- CSS Variables (ranglar)
- Animations (harakatlar)
- Media Queries (responsiv)
```

**Dizayn Yondashuvi:**
- Dark theme (ko'zni charchatmaydi)
- Gradient ranglar (zamonaviy ko'rinish)
- Smooth transitions (yumshoq o'tishlar)
- Responsiv (mobil/tablet/desktop)

#### 3. JavaScript (ES6+)
```javascript
// Zamonaviy JavaScript
- Classes (OOP)
- Arrow functions
- Template literals
- Destructuring
- Async/await (kelajakda)
```

**Asosiy Komponentlar:**
- KPICalculator class (hisoblash)
- LocalStorage API (saqlash)
- Chart.js integration (grafiklar)
- Event listeners (interaktivlik)

#### 4. Chart.js 4.4.0
```javascript
// Grafik turlari
- Bar Chart (ustunli)
- Radar Chart (radar)
- Doughnut Chart (halqa)
- Line Chart (chiziqli)
```

**Nima uchun Chart.js?**
- Oson integratsiya
- Ko'p turdagi grafiklar
- Responsiv
- Interaktiv
- Yaxshi dokumentatsiya

### Ma'lumotlar Oqimi

```
┌─────────────────────────────────────────────┐
│  1. Foydalanuvchi ma'lumot kiritadi         │
└─────────────────┬───────────────────────────┘
                  ↓
┌─────────────────────────────────────────────┐
│  2. JavaScript validatsiya qiladi           │
└─────────────────┬───────────────────────────┘
                  ↓
┌─────────────────────────────────────────────┐
│  3. KPICalculator hisoblaydi                │
│     - 15 ta KPI qiymati                     │
│     - Normalizatsiya (0-100)                │
│     - MM Umumiy Indeksi                     │
└─────────────────┬───────────────────────────┘
                  ↓
┌─────────────────────────────────────────────┐
│  4. Rang zonasi aniqlanadi                  │
│     - Yashil (80-100)                       │
│     - Sariq (50-79)                         │
│     - Qizil (0-49)                          │
└─────────────────┬───────────────────────────┘
                  ↓
┌─────────────────────────────────────────────┐
│  5. Reyting yangilanadi                     │
│     - Barcha korxonalar tartiblash          │
│     - Reyting o'rni belgilash               │
└─────────────────┬───────────────────────────┘
                  ↓
┌─────────────────────────────────────────────┐
│  6. LocalStorage'ga saqlanadi               │
│     - Avtomatik saqlash                     │
│     - Doimiy saqlash                        │
└─────────────────┬───────────────────────────┘
                  ↓
┌─────────────────────────────────────────────┐
│  7. UI yangilanadi                          │
│     - Podium                                │
│     - Reyting jadvali                       │
│     - Statistika                            │
└─────────────────────────────────────────────┘
```

---

## 📁 Fayllar Tuzilishi

### 1. index.html (18.7 KB)

**Struktura:**
```html
<!DOCTYPE html>
<html>
<head>
  <!-- Meta teglar -->
  <title>MM Reyting Tizimi</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- CSS -->
  <link rel="stylesheet" href="styles.css">
  
  <!-- Chart.js CDN -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
</head>
<body>
  <!-- Header -->
  <header class="header">...</header>
  
  <!-- Navigation Tabs -->
  <nav class="nav-tabs">...</nav>
  
  <!-- Main Content -->
  <main class="main-content">
    <!-- 4 ta tab -->
    <section id="dashboard-tab">...</section>
    <section id="add-company-tab">...</section>
    <section id="comparison-tab">...</section>
    <section id="statistics-tab">...</section>
  </main>
  
  <!-- Footer -->
  <footer class="footer">...</footer>
  
  <!-- JavaScript -->
  <script src="app.js"></script>
</body>
</html>
```

**Asosiy Bo'limlar:**

#### a) Header
```html
<header class="header">
  <h1>🛡️ Mehnat Muhofazasi Reyting Tizimi</h1>
  <p>Korxonalar xavfsizlik samaradorligini baholash</p>
</header>
```
- Gradient fon
- Animatsiya (pulse)
- Markazlashtirilgan

#### b) Navigation Tabs
```html
<nav class="nav-tabs">
  <button data-tab="dashboard">📊 Reyting Jadvali</button>
  <button data-tab="add-company">➕ Korxona Qo'shish</button>
  <button data-tab="comparison">⚖️ Taqqoslash</button>
  <button data-tab="statistics">📈 Statistika</button>
</nav>
```
- 4 ta asosiy tab
- Active holat
- Responsiv

#### c) Dashboard Tab
```html
<section id="dashboard-tab">
  <!-- Statistika kartochkalari -->
  <div class="stats-grid">
    <div class="stat-card">Jami korxonalar</div>
    <div class="stat-card green">Yashil zona</div>
    <div class="stat-card yellow">Sariq zona</div>
    <div class="stat-card red">Qizil zona</div>
  </div>
  
  <!-- Podium (Top 3) -->
  <div class="podium-section">
    <div class="podium-place first">🥇</div>
    <div class="podium-place second">🥈</div>
    <div class="podium-place third">🥉</div>
  </div>
  
  <!-- Reyting jadvali -->
  <table class="ranking-table">
    <thead>...</thead>
    <tbody id="ranking-tbody">...</tbody>
  </table>
</section>
```

#### d) Add Company Tab
```html
<section id="add-company-tab">
  <form id="company-form">
    <!-- Asosiy ma'lumotlar -->
    <div class="card">
      <input id="company-name">
      <input id="company-employees">
      <input id="company-hours">
    </div>
    
    <!-- 15 ta KPI -->
    <div class="card">
      <div class="kpi-compact-grid">
        <!-- 15 ta input -->
      </div>
    </div>
    
    <!-- Tugmalar -->
    <button id="load-sample-btn">Namuna yuklash</button>
    <button type="submit">Saqlash</button>
  </form>
</section>
```

#### e) Comparison Tab
```html
<section id="comparison-tab">
  <!-- Korxonalarni tanlash -->
  <div id="comparison-selection">
    <label>
      <input type="checkbox">
      Korxona nomi
    </label>
  </div>
  
  <!-- Taqqoslash jadvali -->
  <table id="comparison-table">...</table>
  
  <!-- Grafiklar -->
  <canvas id="comparison-chart"></canvas>
  <canvas id="radar-chart"></canvas>
</section>
```

#### f) Statistics Tab
```html
<section id="statistics-tab">
  <canvas id="index-distribution-chart"></canvas>
  <canvas id="zone-pie-chart"></canvas>
  <canvas id="avg-kpi-chart"></canvas>
</section>
```

### 2. styles.css (15.8 KB)

**CSS Strukturasi:**

#### a) CSS Variables
```css
:root {
  /* Ranglar */
  --primary: #667eea;
  --bg-primary: #0a0e27;
  --green: #10b981;
  --yellow: #f59e0b;
  --red: #ef4444;
  
  /* Spacing */
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  
  /* Border Radius */
  --radius-md: 1rem;
}
```

**Nima uchun CSS Variables?**
- Oson o'zgartirish
- Bir joyda boshqarish
- Dinamik ranglar

#### b) Layout
```css
/* Container */
.container {
  max-width: 1600px;
  margin: 0 auto;
  padding: var(--spacing-md);
}

/* Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
}

/* Flexbox */
.nav-tabs {
  display: flex;
  gap: var(--spacing-sm);
}
```

#### c) Komponentlar
```css
/* Card */
.card {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow);
}

/* Button */
.btn {
  padding: 0.875rem 2rem;
  border-radius: var(--radius-sm);
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
}
```

#### d) Rang Zonalari
```css
/* Yashil zona */
.zone-badge.green {
  background: rgba(16, 185, 129, 0.2);
  color: var(--green-light);
  border: 2px solid var(--green);
}

/* Sariq zona */
.zone-badge.yellow {
  background: rgba(245, 158, 11, 0.2);
  color: var(--yellow-light);
  border: 2px solid var(--yellow);
}

/* Qizil zona */
.zone-badge.red {
  background: rgba(239, 68, 68, 0.2);
  color: var(--red-light);
  border: 2px solid var(--red);
}
```

#### e) Animatsiyalar
```css
/* Fade In */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Pulse */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
```

#### f) Responsiv
```css
@media (max-width: 768px) {
  .header h1 {
    font-size: 1.8rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .kpi-row {
    grid-template-columns: 1fr;
  }
}
```

### 3. app.js (33.7 KB)

**JavaScript Strukturasi:**

#### a) KPI Configuration
```javascript
const KPI_CONFIG = {
  ltifr: {
    name: "LTIFR",
    weight: 0.12,
    lowerIsBetter: true
  },
  // ... 14 ta boshqa KPI
};
```

**Nima uchun configuration object?**
- Markazlashtirilgan boshqaruv
- Oson o'zgartirish
- Vazn koeffitsiyentlari bir joyda

#### b) KPICalculator Class
```javascript
class KPICalculator {
  constructor(companyData) {
    this.company = companyData;
  }
  
  calculateLTIFR(accidents) {
    return (accidents / this.company.totalHours) * 1000000;
  }
  
  // ... 14 ta boshqa hisoblash funksiyalari
}
```

**Nima uchun Class?**
- OOP yondashuvi
- Kodning tashkiliy
- Qayta foydalanish

#### c) Normalizatsiya
```javascript
function normalizeKPI(value, kpiKey) {
  let score = 0;
  
  switch(kpiKey) {
    case 'ltifr':
      // Kam = yaxshi
      score = Math.max(0, 100 - (value * 20));
      break;
    
    case 'noincident':
      // Yuqori = yaxshi
      score = Math.min(100, value);
      break;
    
    // ... boshqa KPIlar
  }
  
  return Math.round(score);
}
```

**Normalizatsiya maqsadi:**
- Barcha KPIlarni 0-100 oralig'iga keltirish
- Taqqoslash uchun qulay
- Vizualizatsiya uchun oson

#### d) Rang Zonalari
```javascript
function getZone(score) {
  if (score >= 80) return {
    name: 'green',
    label: '🟢 Yaxshi',
    class: 'green'
  };
  
  if (score >= 50) return {
    name: 'yellow',
    label: '🟡 Qoniqarli',
    class: 'yellow'
  };
  
  return {
    name: 'red',
    label: '🔴 Xavfli',
    class: 'red'
  };
}
```

#### e) LocalStorage
```javascript
// Saqlash
function saveToLocalStorage() {
  localStorage.setItem('mmCompanies', JSON.stringify(companies));
}

// Yuklash
function loadFromLocalStorage() {
  const saved = localStorage.getItem('mmCompanies');
  if (saved) {
    companies = JSON.parse(saved);
  }
}
```

#### f) Chart.js Integration
```javascript
// Bar Chart
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: kpiNames,
    datasets: [{
      label: 'KPI Ballari',
      data: scores,
      backgroundColor: '#667eea'
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false
  }
});
```

---

## 📊 15 ta KPI Tushuntirilishi

### KPI 1: LTIFR (Lost Time Injury Frequency Rate)

**Ta'rif:**
Ish vaqtini yo'qotgan baxtsiz hodisalar chastotasi.

**Formula:**
```
LTIFR = (Baxtsiz hodisalar soni / Jami ish soatlari) × 1,000,000
```

**Misol:**
```
Baxtsiz hodisalar: 2 ta
Jami soat: 420,000
LTIFR = (2 / 420,000) × 1,000,000 = 4.76
```

**Normalizatsiya:**
```javascript
// Kam = yaxshi
score = Math.max(0, 100 - (LTIFR × 20))

// Misol:
LTIFR = 4.76
score = 100 - (4.76 × 20) = 100 - 95.2 = 4.8 ≈ 5 ball
```

**Me'yor:**
- 0-1: A'lo (yashil)
- 1-3: Qoniqarli (sariq)
- 3+: Xavfli (qizil)

**Vazn:** 0.12 (eng yuqori)

**Nima uchun muhim?**
- To'g'ridan-to'g'ri inson hayoti bilan bog'liq
- Xalqaro standartlarda eng kritik indikator
- Korxona obro'siga kuchli ta'sir

---

### KPI 2: TRIR (Total Recordable Injury Rate)

**Ta'rif:**
Qayd etilgan barcha jarohatlar koeffitsiyenti.

**Formula:**
```
TRIR = (Jarohatlar soni / Jami ish soatlari) × 1,000,000
```

**Misol:**
```
Jarohatlar: 7 ta
Jami soat: 420,000
TRIR = (7 / 420,000) × 1,000,000 = 16.67
```

**Normalizatsiya:**
```javascript
score = Math.max(0, 100 - (TRIR × 10))

// Misol:
TRIR = 16.67
score = 100 - (16.67 × 10) = 100 - 166.7 = 0 ball (minimum)
```

**Me'yor:**
- 1-3: Qoniqarli
- 3-10: O'rtacha
- 10+: Yuqori

**Vazn:** 0.10

---

### KPI 3: Noincident Kunlar

**Ta'rif:**
Baxtsiz hodisa qayd etilmagan kunlar ulushi.

**Formula:**
```
Noincident % = (Noincident kunlar / 365) × 100
```

**Misol:**
```
Noincident kunlar: 353
Noincident % = (353 / 365) × 100 = 96.7%
```

**Normalizatsiya:**
```javascript
// Yuqori = yaxshi
score = Math.min(100, value)

// Misol:
value = 96.7%
score = 96.7 ball
```

**Me'yor:**
- 95-100%: A'lo
- 90-95%: Yaxshi
- <90%: Yaxshilash kerak

**Vazn:** 0.08

---

### KPI 4: O'quv Qamrovi

**Ta'rif:**
MM o'quvlarini tugatgan xodimlar ulushi.

**Formula:**
```
O'quv % = (Tugatganlar / Jami xodimlar) × 100
```

**Misol:**
```
Tugatganlar: 186
Jami: 190
O'quv % = (186 / 190) × 100 = 97.9%
```

**Normalizatsiya:**
```javascript
score = Math.min(100, value)

// Misol:
value = 97.9%
score = 97.9 ball
```

**Me'yor:**
- 100%: Ideal
- 95-99%: Yaxshi
- <95%: Yetarli emas

**Vazn:** 0.06

**Nima uchun muhim?**
- O'quv - profilaktikaning asosi
- Xodimlar bilimi = xavfsizlik
- OSHA statistikasi: 40% hodisalar malakasizlikdan

---

### KPI 5: RA Coverage (Risk Assessment Coverage)

**Ta'rif:**
Xavfi baholangan ish o'rinlari ulushi.

**Formula:**
```
RA % = (Baholangan o'rinlar / Jami o'rinlar) × 100
```

**Misol:**
```
Baholangan: 45
Jami: 50
RA % = (45 / 50) × 100 = 90%
```

**Normalizatsiya:**
```javascript
score = Math.min(100, value)
```

**Me'yor:**
- 100%: Ideal
- 95-99%: Qoniqarli
- <95%: To'liq emas

**Vazn:** 0.08

**Nima uchun muhim?**
- ISO 45001 asosiy talabi
- Xavf boshqaruvining "asosi"
- RAR bo'lmasa tizim ishlamaydi

---

### KPI 6: Near Miss

**Ta'rif:**
Bir xodimga yaqin xato holatlari.

**Formula:**
```
Near Miss = Yaqin xato soni / Jami xodimlar
```

**Misol:**
```
Yaqin xato: 60
Xodimlar: 190
Near Miss = 60 / 190 = 0.31
```

**Normalizatsiya:**
```javascript
// Yuqori = yaxshi (optimal 0.3-0.5)
score = Math.min(100, (value / 0.5) × 100)

// Misol:
value = 0.31
score = (0.31 / 0.5) × 100 = 62 ball
```

**Me'yor:**
- 0.3-0.5: Yaxshi (xodimlar hushyor)
- 0.1-0.3: O'rtacha
- <0.1: Past (xodimlar xabar bermayapti)

**Vazn:** 0.06

**Nima uchun muhim?**
- Proaktiv xavfsizlik madaniyati
- Hodisalarni oldini olish
- Xodimlar ehtiyotkorligi

---

### KPI 7: Javob Tezligi

**Ta'rif:**
Murojaatlarga o'rtacha javob berish vaqti.

**Formula:**
```
Javob (kun) = Sarflangan kunlar / Murojaatlar soni
```

**Misol:**
```
Kunlar: 84
Murojaatlar: 40
Javob = 84 / 40 = 2.1 kun
```

**Normalizatsiya:**
```javascript
if (value <= 1) score = 100;
else if (value <= 3) score = 100 - ((value - 1) × 20);
else score = Math.max(0, 100 - ((value - 1) × 25));

// Misol:
value = 2.1
score = 100 - ((2.1 - 1) × 20) = 100 - 22 = 78 ball
```

**Me'yor:**
- ≤1 kun: A'lo
- 1-3 kun: Yaxshi
- >3 kun: Sekin

**Vazn:** 0.08

---

### KPI 8: Profilaktika Xarajatlari

**Ta'rif:**
MM ehtiyot choralari xarajatlarining ulushi.

**Formula:**
```
Profilaktika % = (MM xarajatlari / Jami xarajatlar) × 100
```

**Misol:**
```
MM: 420 mln
Jami: 18,200 mln
Profilaktika % = (420 / 18,200) × 100 = 2.3%
```

**Normalizatsiya:**
```javascript
// Optimal oraliq: 2-5%
if (value >= 2 && value <= 5) score = 100;
else if (value < 2) score = (value / 2) × 100;
else score = Math.max(0, 100 - ((value - 5) × 10));

// Misol:
value = 2.3%
score = 100 ball (optimal oraliqda)
```

**Me'yor:**
- 2-5%: Optimal
- <2%: Kam
- >5%: Ko'p (samarasiz)

**Vazn:** 0.08

---

### KPI 9: SHHV Ta'minoti

**Ta'rif:**
Shaxsiy himoya vositalari bilan ta'minlanganlik.

**Formula:**
```
SHHV % = (Ta'minlanganlar / Jami xodimlar) × 100
```

**Misol:**
```
Ta'minlangan: 188
Jami: 190
SHHV % = (188 / 190) × 100 = 98.9%
```

**Normalizatsiya:**
```javascript
score = Math.min(100, value)
```

**Me'yor:**
- 100%: Ideal
- 95-99%: Qoniqarli
- <95%: Yetarli emas

**Vazn:** 0.06

---

### KPI 10: Uskuna Ko'rigi

**Ta'rif:**
Tekshiruvdan o'tgan uskunalar ulushi.

**Formula:**
```
Uskuna % = (Tekshiruv / Jami uskunalar) × 100
```

**Misol:**
```
Tekshiruv: 142
Jami: 150
Uskuna % = (142 / 150) × 100 = 94.7%
```

**Normalizatsiya:**
```javascript
score = Math.min(100, value)
```

**Me'yor:**
- 100%: Ideal
- 95-99%: Yaxshi
- <95%: Xavfli

**Vazn:** 0.05

**Nima uchun muhim?**
- Texnik nosozlik - BH asosiy sababi
- Profilaktik tekshiruv zarur

---

### KPI 11: Inspeksiya Ijrosi

**Ta'rif:**
Bajarilgan inspeksiyalar ulushi.

**Formula:**
```
Inspeksiya % = (O'tkazilgan / Rejalashtirilgan) × 100
```

**Misol:**
```
O'tkazilgan: 26
Reja: 30
Inspeksiya % = (26 / 30) × 100 = 86.7%
```

**Normalizatsiya:**
```javascript
score = Math.min(100, value)
```

**Me'yor:**
- 100%: Ideal
- 95-99%: Yaxshi
- <95%: Reja bajarilmayapti

**Vazn:** 0.08

---

### KPI 12: Kasbiy Kasalliklar

**Ta'rif:**
Yillik kasbiy kasalliklar soni.

**Formula:**
```
Kasbiy = Absolyut son
```

**Misol:**
```
Kasalliklar: 1 ta
```

**Normalizatsiya:**
```javascript
// Kam = yaxshi
score = Math.max(0, 100 - (value × 50))

// Misol:
value = 1
score = 100 - (1 × 50) = 50 ball
```

**Me'yor:**
- 0: Ideal
- 1-2: Qoniqarli
- 3+: Xavfli

**Vazn:** 0.05

---

### KPI 13: Rioya Indeksi

**Ta'rif:**
MM talablariga rioya etish darajasi.

**Formula:**
```
Rioya % = (1 - Nomuvofiqliklar / Jami punktlar) × 100
```

**Misol:**
```
Nomuvofiqlik: 11
Punktlar: 120
Rioya % = (1 - 11/120) × 100 = 90.8%
```

**Normalizatsiya:**
```javascript
score = Math.min(100, value)
```

**Me'yor:**
- ≥95%: A'lo
- 90-95%: Yaxshi
- <90%: Yaxshilash kerak

**Vazn:** 0.05

---

### KPI 14: Favqulodda Tayyorgarlik

**Ta'rif:**
FV mashg'ulotlarida ishtirok.

**Formula:**
```
FV % = (Ishtirok / Rejalashtirilgan) × 100
```

**Misol:**
```
Ishtirok: 162
Reja: 180
FV % = (162 / 180) × 100 = 90%
```

**Normalizatsiya:**
```javascript
score = Math.min(100, value)
```

**Me'yor:**
- ≥95%: A'lo
- 90-95%: Yaxshi
- <90%: Past

**Vazn:** 0.05

---

### KPI 15: MM Buzilishlari

**Ta'rif:**
Aniqlangan MM buzilishlar ulushi.

**Formula:**
```
Buzilish % = (Buzilishlar / Jami xodimlar) × 100
```

**Misol:**
```
Buzilish: 14
Xodimlar: 190
Buzilish % = (14 / 190) × 100 = 7.4%
```

**Normalizatsiya:**
```javascript
// Kam = yaxshi
score = Math.max(0, 100 - (value × 10))

// Misol:
value = 7.4%
score = 100 - (7.4 × 10) = 100 - 74 = 26 ball
```

**Me'yor:**
- ≤1%: A'lo
- 1-5%: Qoniqarli
- >5%: Yuqori

**Vazn:** 0.08

---

### MM Umumiy Indeksi Hisoblash

**Formula:**
```
MM Indeksi = Σ (KPI balli × Vazn koeffitsiyenti)
```

**Misol (Xorazm Metall LLC):**
```
LTIFR:        5 × 0.12 = 0.60
TRIR:         0 × 0.10 = 0.00
Noincident:  97 × 0.08 = 7.76
O'quv:       98 × 0.06 = 5.88
RA:          90 × 0.08 = 7.20
Near Miss:   62 × 0.06 = 3.72
Javob:       78 × 0.08 = 6.24
Profilaktika:100× 0.08 = 8.00
SHHV:        99 × 0.06 = 5.94
Uskuna:      95 × 0.05 = 4.75
Inspeksiya:  87 × 0.08 = 6.96
Kasbiy:      50 × 0.05 = 2.50
Rioya:       91 × 0.05 = 4.55
FV:          90 × 0.05 = 4.50
Buzilish:    26 × 0.08 = 2.08
─────────────────────────────
JAMI:                  70.68

MM Indeksi = 70.68 ball
Zona: 🟡 Sariq (Qoniqarli)
```

---

## 💾 Ma'lumotlar Saqlash (LocalStorage)

### LocalStorage Nima?

**Ta'rif:**
LocalStorage - bu brauzerning ichki xotirasi bo'lib, veb-saytlar ma'lumotlarni doimiy saqlash uchun ishlatadi.

**Xususiyatlari:**
- Maksimal hajm: 5-10 MB
- Doimiy saqlash (o'chmaydi)
- Har bir domen uchun alohida
- Faqat string ma'lumotlar
- Sinxron API

### Qanday Ishlaydi?

#### 1. Saqlash
```javascript
// Object → JSON string
const data = {
  companies: [...],
  version: "2.0"
};

const jsonString = JSON.stringify(data);
localStorage.setItem('mmCompanies', jsonString);
```

#### 2. Yuklash
```javascript
// JSON string → Object
const jsonString = localStorage.getItem('mmCompanies');

if (jsonString) {
  const data = JSON.parse(jsonString);
  companies = data.companies;
}
```

#### 3. O'chirish
```javascript
// Bitta element
localStorage.removeItem('mmCompanies');

// Hammasi
localStorage.clear();
```

### Ma'lumotlar Qayerda Saqlanadi?

**Kompyuter:**
```
Windows:
C:\Users\USERNAME\AppData\Local\Google\Chrome\User Data\Default\Local Storage

Linux:
~/.config/google-chrome/Default/Local Storage

Mac:
~/Library/Application Support/Google/Chrome/Default/Local Storage
```

**Brauzer ichida:**
```
Brauzer
  └─ LocalStorage
      └─ https://your-site.netlify.app
          └─ mmCompanies: "{...}"
```

### Reload Qilganda O'chib Ketadimi?

❌ **YO'Q!** LocalStorage doimiy saqlash:

| Holat | Ma'lumotlar | Sabab |
|-------|-------------|-------|
| Sahifa yangilash (F5) | ✅ Saqlanadi | Doimiy xotira |
| Brauzer yopish | ✅ Saqlanadi | Doimiy xotira |
| Kompyuter o'chirish | ✅ Saqlanadi | Disk'da saqlanadi |
| Internet o'chirish | ✅ Saqlanadi | Lokal xotira |
| Netlify deploy | ✅ Saqlanadi | Lokal, server emas |

⚠️ **Qachon o'chadi:**

| Holat | Ma'lumotlar | Sabab |
|-------|-------------|-------|
| Brauzer ma'lumotlarini tozalash | ❌ O'chadi | Qo'lda tozalash |
| Boshqa brauzer | ❌ Yo'q | Har biri alohida |
| Boshqa kompyuter | ❌ Yo'q | Lokal saqlash |
| Incognito mode | ❌ Yo'q | Vaqtinchalik |

### Netlify va LocalStorage

**Deploy qilganda:**

```
┌─────────────────────────────────────┐
│  Netlify Server                     │
│  ├─ index.html                      │
│  ├─ styles.css                      │
│  └─ app.js                          │
│                                     │
│  ❌ Ma'lumotlar YO'Q                │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Foydalanuvchi 1 (Chrome)           │
│  LocalStorage:                      │
│  └─ mmCompanies: [Korxona A, B]    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Foydalanuvchi 2 (Firefox)          │
│  LocalStorage:                      │
│  └─ mmCompanies: [Korxona C, D]    │
└─────────────────────────────────────┘
```

**Xulosa:**
- Netlify faqat fayllarni saqlaydi
- Har bir foydalanuvchi o'z ma'lumotlarini saqlaydi
- Ma'lumotlar xavfsiz va shaxsiy

### Export/Import

#### Export
```javascript
function exportData() {
  const data = {
    companies: companies,
    exportDate: new Date().toISOString(),
    version: "2.0"
  };
  
  const blob = new Blob(
    [JSON.stringify(data, null, 2)],
    { type: 'application/json' }
  );
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'MM_Reyting_2025-11-26.json';
  a.click();
}
```

#### Import
```javascript
function importData(file) {
  const reader = new FileReader();
  
  reader.onload = (event) => {
    const data = JSON.parse(event.target.result);
    companies = data.companies;
    saveToLocalStorage();
    renderDashboard();
  };
  
  reader.readAsText(file);
}
```

### Backup Strategiyasi

**Kundalik:**
- Yangi ma'lumot qo'shganda export

**Haftalik:**
- To'liq backup
- Bir nechta joyda saqlash (kompyuter, cloud)

**Oylik:**
- Tarixiy arxiv
- Eski backuplarni tekshirish

---

## 🌐 Netlify Deploy Qilish

### Usul 1: GitHub + Netlify (Tavsiya Etiladi)

#### Qadam 1: Git Repository Yaratish
```bash
cd /home/ctrl/Documents/bak

# Git boshlash
git init

# Fayllarni qo'shish
git add .

# Commit
git commit -m "Initial commit: MM Rating System"
```

#### Qadam 2: GitHub'ga Yuklash
```bash
# GitHub'da yangi repository yarating
# Keyin:

git remote add origin https://github.com/USERNAME/mm-rating.git
git branch -M main
git push -u origin main
```

#### Qadam 3: Netlify'da Deploy
1. https://app.netlify.com ga kiring
2. "Add new site" tugmasini bosing
3. "Import an existing project" ni tanlang
4. "GitHub" ni tanlang
5. Repository ni tanlang (mm-rating)
6. Build settings:
   - Build command: (bo'sh qoldiring)
   - Publish directory: `.` (nuqta)
7. "Deploy site" tugmasini bosing

**Natija:**
```
https://random-name-123.netlify.app
```

#### Qadam 4: Custom Domain (Ixtiyoriy)
1. Netlify dashboard'da "Domain settings"
2. "Add custom domain"
3. Domeningizni kiriting
4. DNS sozlamalarini yangilang

---

### Usul 2: Netlify CLI

#### Qadam 1: CLI O'rnatish
```bash
npm install -g netlify-cli
```

#### Qadam 2: Login
```bash
netlify login
```
Brauzer ochiladi, login qiling.

#### Qadam 3: Deploy
```bash
cd /home/ctrl/Documents/bak
netlify deploy
```

**Savollar:**
```
? Create & configure a new site: Yes
? Team: Your Team
? Site name: mm-rating-system
? Publish directory: .
```

#### Qadam 4: Production Deploy
```bash
netlify deploy --prod
```

**Natija:**
```
✔ Deploy complete!
Website URL: https://mm-rating-system.netlify.app
```

---

### Usul 3: Drag & Drop (Eng Oson)

#### Qadam 1: Netlify Drop'ga O'ting
```
https://app.netlify.com/drop
```

#### Qadam 2: Papkani Drag & Drop
1. Fayl menejerida `/home/ctrl/Documents/bak` ni oching
2. Barcha fayllarni tanlang:
   - index.html
   - styles.css
   - app.js
   - README.md
3. Brauzer oynasiga sudrab tashlang

#### Qadam 3: Tayyor!
```
https://random-name.netlify.app
```

**Kamchilik:**
- Har safar qo'lda yuklash kerak
- Git integratsiyasi yo'q
- Avtomatik deploy yo'q

---

### Deploy Checklist

#### Fayllar
- [x] index.html mavjud
- [x] styles.css mavjud
- [x] app.js mavjud
- [x] README.md mavjud

#### HTML
- [x] `<link href="styles.css">`
- [x] `<script src="app.js">`
- [x] Chart.js CDN
- [x] Meta teglar

#### JavaScript
- [x] LocalStorage ishlaydi
- [x] Export/Import ishlaydi
- [x] Chart.js yuklanadi

#### CSS
- [x] Responsiv dizayn
- [x] Dark theme
- [x] Animatsiyalar

---

## 📖 Foydalanish Yo'riqnomasi

### Birinchi Marta Ochish

#### 1. Saytni Oching
```
https://your-site.netlify.app
```

#### 2. Bo'sh Holat
- Statistika: 0 korxona
- Podium: Bo'sh
- Jadval: "Hali korxonalar qo'shilmagan"

#### 3. Birinchi Korxonani Qo'shing
1. "Korxona Qo'shish" tabini bosing
2. "📋 Namuna yuklash" tugmasini bosing
3. Ma'lumotlar avtomatik to'ldiriladi
4. "💾 Saqlash" tugmasini bosing

#### 4. Natija
- "Reyting Jadvali" tabiga o'tadi
- Statistika: 1 korxona
- Podium: 1 ta korxona
- Jadval: 1 qator

---

### Korxona Qo'shish

#### Asosiy Ma'lumotlar
```
Korxona nomi: Xorazm Metall LLC
Xodimlar soni: 190
Yillik ish vaqti: 420000 soat
```

#### 15 ta KPI Ma'lumotlari
```
1. Baxtsiz hodisalar: 2
2. Jarohatlar: 7
3. Noincident kunlar: 353
4. O'quvni tugatganlar: 186
5. Baholangan ish o'rinlari: 45 / 50
6. Near Miss: 60
7. Javob kunlari: 84 / 40 murojaat
8. MM xarajatlari: 420 / 18200 mln
9. SHHV ta'minlanganlar: 188
10. Tekshiruv: 142 / 150 uskuna
11. Inspeksiya: 26 / 30
12. Kasbiy kasalliklar: 1
13. Nomuvofiqliklar: 11 / 120
14. FV ishtirok: 162 / 180
15. Buzilishlar: 14
```

#### Saqlash
- "💾 Saqlash" tugmasini bosing
- Avtomatik hisoblash
- LocalStorage'ga saqlash
- Dashboard'ga o'tish

---

### Reyting Ko'rish

#### Statistika Kartochkalari
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Jami: 3      │ Yashil: 1    │ Sariq: 1     │ Qizil: 1     │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

#### Podium
```
        🥇
    ┌─────────┐
    │ ABC LLC │
    │  92.5   │
    │   🟢    │
    └─────────┘

🥈              🥉
┌─────────┐  ┌─────────┐
│XYZ Corp │  │DEF Plant│
│  81.9   │  │  45.3   │
│   🟡    │  │   🔴    │
└─────────┘  └─────────┘
```

#### Reyting Jadvali
```
┌────┬─────────────┬─────────┬─────────┬────────┬─────────┐
│ #  │ Korxona     │ Xodimlar│ Indeks  │ Zona   │ Amallar │
├────┼─────────────┼─────────┼─────────┼────────┼─────────┤
│ 1  │ ABC LLC     │ 200     │ 92.5    │ 🟢     │ 👁️ ✏️ 🗑️│
│ 2  │ XYZ Corp    │ 190     │ 81.9    │ 🟡     │ 👁️ ✏️ 🗑️│
│ 3  │ DEF Plant   │ 150     │ 45.3    │ 🔴     │ 👁️ ✏️ 🗑️│
└────┴─────────────┴─────────┴─────────┴────────┴─────────┘
```

---

### Korxonalarni Taqqoslash

#### 1. Korxonalarni Tanlash
```
☑ ABC LLC
☑ XYZ Corp
☐ DEF Plant
```

#### 2. Taqqoslash Tugmasi
"🔍 Taqqoslash" ni bosing

#### 3. Taqqoslash Jadvali
```
┌──────────────┬─────────┬──────────┐
│ KPI          │ ABC LLC │ XYZ Corp │
├──────────────┼─────────┼──────────┤
│ MM Indeksi   │ 92.5 🟢 │ 81.9     │
│ LTIFR        │ 95      │ 30 🔴    │
│ TRIR         │ 90      │ 25 🔴    │
│ ...          │ ...     │ ...      │
└──────────────┴─────────┴──────────┘
```

#### 4. Bar Chart
Ustunli grafik - har bir KPI bo'yicha taqqoslash

#### 5. Radar Chart
Radar tahlil - umumiy profil

---

### Export/Import

#### Export
1. "Reyting Jadvali" tabida
2. "💾 Eksport" tugmasini bosing
3. JSON fayl yuklab olinadi
4. Fayl nomi: `MM_Reyting_2025-11-26.json`

#### Import
1. "📥 Import" tugmasini bosing
2. JSON faylni tanlang
3. Ma'lumotlar yuklanadi
4. Dashboard yangilanadi

---

## 🔧 Muammolarni Hal Qilish

### Muammo 1: Ma'lumotlar Ko'rinmayapti

**Belgilar:**
- Sahifa ochiladi
- Lekin korxonalar yo'q
- Statistika: 0

**Sabablari:**
1. LocalStorage bo'sh
2. Boshqa brauzer
3. Boshqa kompyuter

**Yechim:**
```
1. F12 bosing (Developer Tools)
2. "Application" tabini oching
3. "Local Storage" ni kengaytiring
4. Saytingizni tanlang
5. "mmCompanies" ni tekshiring

Agar bo'sh bo'lsa:
- Import qiling
- Yoki qaytadan kiriting
```

---

### Muammo 2: Grafiklar Ko'rinmayapti

**Belgilar:**
- Taqqoslash ishlaydi
- Lekin grafiklar bo'sh

**Sabablari:**
1. Chart.js yuklanmagan
2. Internet yo'q
3. CDN muammosi

**Yechim:**
```
1. Internet ulanishini tekshiring
2. F12 → Console
3. Xatolarni ko'ring
4. Sahifani yangilang (Ctrl+Shift+R)
5. Agar ishlamasa, Chart.js CDN'ni tekshiring
```

---

### Muammo 3: Deploy Ishlamayapti

**Belgilar:**
- Netlify deploy qilindi
- Lekin sahifa ochilmayapti

**Sabablari:**
1. Fayl nomlari noto'g'ri
2. Havolalar noto'g'ri
3. Build xatolik

**Yechim:**
```
1. Netlify dashboard → Deploys
2. Oxirgi deploy'ni oching
3. "Deploy log" ni ko'ring
4. Xatolarni toping

Tekshirish:
- index.html mavjudmi?
- styles.css havolasi to'g'rimi?
- app.js havolasi to'g'rimi?
```

---

### Muammo 4: Reload Qilganda Ma'lumotlar O'chadi

**Belgilar:**
- Korxona qo'shasiz
- Reload qilasiz
- Ma'lumotlar yo'qoladi

**Sabablari:**
1. LocalStorage ishlamayapti
2. Incognito mode
3. Brauzer sozlamalari

**Yechim:**
```
1. Incognito mode'dan chiqing
2. Brauzer sozlamalarini tekshiring:
   - Settings → Privacy
   - "Block third-party cookies" o'chirilgan bo'lsin
3. Boshqa brauzerda sinab ko'ring
4. Export qiling (backup)
```

---

### Muammo 5: Boshqa Kompyuterda Ma'lumotlar Yo'q

**Belgilar:**
- Kompyuter A'da ma'lumotlar bor
- Kompyuter B'da ma'lumotlar yo'q

**Sabab:**
- LocalStorage lokal (har bir kompyuter alohida)

**Yechim:**
```
Kompyuter A:
1. Export qiling
2. JSON faylni saqlang
3. Cloud'ga yuklang (Google Drive, Dropbox)

Kompyuter B:
1. JSON faylni yuklab oling
2. Import qiling
3. Ma'lumotlar tiklanadi
```

---

## 📝 Xulosa

### Loyiha Xususiyatlari

✅ **To'liq Funksional**
- 15 ta KPI avtomatik hisoblash
- Avtomatik reyting va tartiblash
- Rang zonalari (yashil-sariq-qizil)
- Podium va reyting jadvali
- Taqqoslash grafiklari
- Export/Import

✅ **Zamonaviy Texnologiyalar**
- HTML5, CSS3, JavaScript ES6+
- Chart.js 4.4.0
- LocalStorage API
- Responsiv dizayn

✅ **Foydalanish Qulayligi**
- Intuitiv interfeys
- Namuna ma'lumotlar
- Offline ishlash
- Tez va samarali

✅ **Netlify Deploy**
- 3 ta deploy usuli
- Custom domain
- HTTPS avtomatik
- CDN tezligi

### Fayllar

```
/home/ctrl/Documents/bak/
├── index.html    (18.7 KB)
├── styles.css    (15.8 KB)
├── app.js        (33.7 KB)
└── README.md     (7.0 KB)
```

### Ma'lumotlar

- **LocalStorage** - doimiy saqlash
- **Export/Import** - backup
- **Har bir foydalanuvchi** - alohida ma'lumotlar

### Keyingi Qadamlar

**Qisqa Muddat:**
- [ ] PDF hisobot
- [ ] Excel eksport
- [ ] Tarixiy grafiklar

**O'rta Muddat:**
- [ ] Backend server
- [ ] Ma'lumotlar bazasi
- [ ] Real-time yangilanish

**Uzoq Muddat:**
- [ ] Mobil ilova
- [ ] AI tavsiyalar
- [ ] Trend tahlili

---

**Versiya:** 2.0  
**Sana:** 2025-11-26  
**Holat:** ✅ 100% Tayyor  
**Deploy:** https://your-site.netlify.app

---

© 2025 Mehnat Muhofazasi Reyting Tizimi  
ISO 45001, OSHA, ILO standartlariga asoslangan
