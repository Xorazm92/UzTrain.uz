# 📊 MEHNAT MUHOFAZASI REYTING TIZIMI - TO'LIQ HISOBLASH TIZIMI

## 🎯 Tizim Haqida

**Maqsad**: O'zbekiston Temir Yo'llari korxonalarining mehnat muhofazasi (xavfsizlik) darajasini baholash va reyting tuzish.

**Asosiy Printsip**: **Baxtsiz hodisalar** - eng muhim ko'rsatkich (40% vazn)

---

## 📋 15 ta KPI Ko'rsatkichlari

### 1. 🔴 Baxtsiz Hodisalar (ltifr) - **40% VAZN** ⭐ ENG MUHIM

**Nima**: Baxtsiz hodisalarning og'irligi (jarima ballari)

**Hisoblash**:
```
Jarima Ballari:
- O'lim = 100 ball
- Og'ir jarohat = 50 ball
- Guruh hodisasi = 40 ball
- Yengil jarohat = 10 ball

Misol:
1 ta o'lim + 2 ta og'ir + 3 ta yengil = 
100 + (2×50) + (3×10) = 100 + 100 + 30 = 230 ball
```

**Normalizatsiya (Ball → Score)**:
```javascript
0 ball = 100 score (mukammal - hech qanday hodisa yo'q)
1-10 ball = 80-100 score (yengil hodisalar)
11-50 ball = 40-80 score (o'rtacha)
51-100 ball = 10-40 score (og'ir)
101-200 ball = 5-10 score (juda og'ir)
201-500 ball = 0-5 score (kritik)
500+ ball = 0 score (ko'p o'limlar)
```

**Misol**:
```
Korxona A: 0 ball → 100 score → 100 × 0.40 = 40 ball (umumiy indeksga)
Korxona B: 50 ball → 40 score → 40 × 0.40 = 16 ball (umumiy indeksga)
Korxona C: 230 ball → 3 score → 3 × 0.40 = 1.2 ball (umumiy indeksga)
```

---

### 2. 🟡 Mikro-jarohatlar (trir) - **10% VAZN**

**Nima**: 100 xodimga nisbatan mikro-jarohatlar foizi

**Hisoblash**:
```
TRIR = (Mikro-jarohatlar soni / Jami xodimlar) × 100

Misol:
500 xodim, 15 ta mikro-jarohat
TRIR = (15 / 500) × 100 = 3%
```

**Normalizatsiya**:
```javascript
0% = 100 score (mukammal)
0-1% = 80-95 score (yaxshi)
1-3% = 40-80 score (o'rtacha)
3-5% = 0-40 score (yomon)
5%+ = 0 score (juda yomon)
```

**Misol**:
```
3% → 40 score → 40 × 0.10 = 4 ball
```

---

### 3. 🟢 Bexavfsiz Kunlar (noincident) - **6% VAZN**

**Nima**: Yil davomida bexavfsiz kunlar foizi

**Hisoblash**:
```
Bexavfsiz kunlar = (Bexavfsiz kunlar / 365) × 100

Misol:
350 kun bexavfsiz = (350 / 365) × 100 = 95.89%
```

**Normalizatsiya**:
```javascript
Score = Foiz (to'g'ridan-to'g'ri)
95.89% → 95.89 score → 95.89 × 0.06 = 5.75 ball
```

---

### 4-15. Qolgan KPI'lar

| # | KPI | Vazn | Hisoblash |
|---|-----|------|-----------|
| 4 | Majburiy o'quv qamrovi | 5% | (O'qitilgan / Jami) × 100 |
| 5 | Xavfni baholash | 5% | (Baholangan / Jami) × 100 |
| 6 | Xabarlar va Takliflar | 4% | 100 xodimga yiliga 60 ta (target) |
| 7 | Murojaatga reaksiya | 4% | (Vaqtida hal qilingan / Jami) × 100 |
| 8 | Profilaktika (Moliya) | 4% | (MM xarajat / Jami xarajat) × 100 |
| 9 | SHHV ta'minoti | 5% | (Ta'minlangan / Kerak) × 100 |
| 10 | Uskuna nazorati | 5% | (Tekshirilgan / Jami) × 100 |
| 11 | Nazorat rejasi ijrosi | 3% | (Bajarilgan / Rejalashtirilgan) × 100 |
| 12 | Kasbiy kasallik | 3% | Soni (kam = yaxshi) |
| 13 | Audit samaradorligi | 2% | (Topilmagan / Jami) × 100 |
| 14 | Avariya tayyorgarligi | 2% | (Mashqlar / Rejalashtirilgan) × 100 |
| 15 | Intizomiy buzilishlar | 2% | 100 xodimga nisbatan (kam = yaxshi) |

---

## 🧮 UMUMIY INDEKS HISOBLASH

### Bosqich 1: Har bir KPI uchun Score hisoblash

```javascript
// Misol: Korxona ma'lumotlari
const company = {
    employees: 500,
    accidents: {
        fatal: 0,
        severe: 1,
        group: 0,
        light: 3
    },
    microInjuries: 15,
    // ... boshqa ma'lumotlar
};

// 1. Baxtsiz hodisalar
const accidentPenalty = (0×100) + (1×50) + (0×40) + (3×10) = 80 ball
const ltifr_score = 40 // (80 ball → 40 score normalizatsiya bo'yicha)

// 2. Mikro-jarohatlar
const trir_value = (15 / 500) × 100 = 3%
const trir_score = 40 // (3% → 40 score)

// 3. Bexavfsiz kunlar
const noincident_value = 95.89%
const noincident_score = 95.89

// ... va hokazo barcha 15 ta KPI uchun
```

---

### Bosqich 2: Vaznli Yig'indi

```javascript
Umumiy Indeks = Σ (KPI_score × KPI_weight)

Misol:
= (ltifr_score × 0.40) + (trir_score × 0.10) + (noincident_score × 0.06) + ...
= (40 × 0.40) + (40 × 0.10) + (95.89 × 0.06) + ...
= 16 + 4 + 5.75 + ...
= 68.5 (umumiy indeks)
```

---

## 🎨 ZONA RANGLARI

Umumiy indeks asosida korxona 3 ta zonaga bo'linadi:

```javascript
🟢 Yashil Zona: 80-100 ball (Xavfsiz)
🟡 Sariq Zona: 60-79 ball (O'rtacha xavf)
🔴 Qizil Zona: 0-59 ball (Yuqori xavf)
```

**Misol**:
- Korxona A: 68.5 ball → 🟡 Sariq zona
- Korxona B: 85.3 ball → 🟢 Yashil zona
- Korxona C: 45.2 ball → 🔴 Qizil zona

---

## 📊 TO'LIQ MISOL: KORXONA REYTINGINI HISOBLASH

### Boshlang'ich Ma'lumotlar

```javascript
Korxona: "Toshkent Elektr Ta'minoti"
Xodimlar: 500 kishi
Profil: electric (Elektr va Aloqa)

Ma'lumotlar:
1. Baxtsiz hodisalar:
   - O'lim: 0
   - Og'ir: 1
   - Guruh: 0
   - Yengil: 3

2. Mikro-jarohatlar: 15 ta

3. Bexavfsiz kunlar: 350 kun

4. O'qitilgan xodimlar: 480 / 500

5. Xavf baholangan: 450 / 500

6. Xabarlar: 250 ta (yiliga)

7. Vaqtida hal qilingan: 85%

8. MM xarajat: 3.5% (jami xarajatdan)

9. SHHV ta'minlangan: 95%

10. Uskuna tekshirilgan: 90%

11. Nazorat rejasi: 88%

12. Kasbiy kasallik: 1 ta

13. Audit: 92%

14. Avariya mashqlari: 100%

15. Intizomiy buzilishlar: 8 ta
```

---

### Hisoblash Jarayoni

#### 1. Baxtsiz Hodisalar (40% vazn)
```
Jarima: (0×100) + (1×50) + (0×40) + (3×10) = 80 ball

Normalizatsiya:
80 ball → 40 score (40-80 oralig'ida)

Hissa: 40 × 0.40 = 16.0 ball
```

#### 2. Mikro-jarohatlar (10% vazn)
```
TRIR: (15 / 500) × 100 = 3%

Normalizatsiya:
3% → 40 score

Hissa: 40 × 0.10 = 4.0 ball
```

#### 3. Bexavfsiz Kunlar (6% vazn)
```
Foiz: (350 / 365) × 100 = 95.89%

Score: 95.89

Hissa: 95.89 × 0.06 = 5.75 ball
```

#### 4. O'qitilgan Xodimlar (5% vazn)
```
Foiz: (480 / 500) × 100 = 96%

Score: 96

Hissa: 96 × 0.05 = 4.8 ball
```

#### 5. Xavf Baholash (5% vazn)
```
Foiz: (450 / 500) × 100 = 90%

Score: 90

Hissa: 90 × 0.05 = 4.5 ball
```

#### 6. Xabarlar va Takliflar (4% vazn)
```
100 xodimga: (250 / 500) × 100 = 50 ta/yil

Target: 60 ta/yil
Normalizatsiya: 50 → 85 score (yaxshi)

Hissa: 85 × 0.04 = 3.4 ball
```

#### 7. Murojaatga Reaksiya (4% vazn)
```
Foiz: 85%

Score: 85

Hissa: 85 × 0.04 = 3.4 ball
```

#### 8. Profilaktika (4% vazn)
```
Foiz: 3.5%

Ideal: 2-5%
Normalizatsiya: 3.5% → 100 score (ideal oralig'ida)

Hissa: 100 × 0.04 = 4.0 ball
```

#### 9. SHHV Ta'minoti (5% vazn)
```
Foiz: 95%

Score: 95

Hissa: 95 × 0.05 = 4.75 ball
```

#### 10. Uskuna Nazorati (5% vazn)
```
Foiz: 90%

Score: 90

Hissa: 90 × 0.05 = 4.5 ball
```

#### 11. Nazorat Rejasi (3% vazn)
```
Foiz: 88%

Score: 88

Hissa: 88 × 0.03 = 2.64 ball
```

#### 12. Kasbiy Kasallik (3% vazn)
```
Soni: 1 ta

Normalizatsiya: 1 → 60 score

Hissa: 60 × 0.03 = 1.8 ball
```

#### 13. Audit (2% vazn)
```
Foiz: 92%

Score: 92

Hissa: 92 × 0.02 = 1.84 ball
```

#### 14. Avariya Tayyorgarligi (2% vazn)
```
Foiz: 100%

Score: 100

Hissa: 100 × 0.02 = 2.0 ball
```

#### 15. Intizomiy Buzilishlar (2% vazn)
```
100 xodimga: (8 / 500) × 100 = 1.6

Normalizatsiya: 1.6 → 87 score

Hissa: 87 × 0.02 = 1.74 ball
```

---

### YAKUNIY NATIJA

```
UMUMIY INDEKS = 
  16.0  (Baxtsiz hodisalar)
+ 4.0   (Mikro-jarohatlar)
+ 5.75  (Bexavfsiz kunlar)
+ 4.8   (O'qitilgan xodimlar)
+ 4.5   (Xavf baholash)
+ 3.4   (Xabarlar)
+ 3.4   (Reaksiya)
+ 4.0   (Profilaktika)
+ 4.75  (SHHV)
+ 4.5   (Uskuna)
+ 2.64  (Nazorat)
+ 1.8   (Kasbiy kasallik)
+ 1.84  (Audit)
+ 2.0   (Avariya)
+ 1.74  (Buzilishlar)
─────────────────
= 65.12 ball

ZONA: 🟡 SARIQ (60-79)
REYTING: O'rtacha xavf darajasi
```

---

## 🏆 REYTING TUZISH

Barcha korxonalar uchun umumiy indeks hisoblanadi va kamayish tartibida saralanadi:

```
1. 🥇 Qo'qon Lokomotiv Deposi - 92.5 🟢
2. 🥈 Buxoro MTU - 88.3 🟢
3. 🥉 Toshkent MTU - 85.7 🟢
4. Temiryo'linfratuzilma AJ - 78.5 🟡
5. Toshkent Elektr - 65.12 🟡
...
30. Salor Masofasi - 45.2 🔴
```

---

## 📈 PARENT COMPANY REYTINGI

Parent company (MTU, AJ) reytingi uning ichidagi korxonalarning **o'rtacha reytingi**:

```javascript
Toshkent MTU:
├─ Toshkent Elektr: 92.5
├─ Toshkent Masofasi: 89.1
├─ Xovos Masofasi: 85.3
└─ Salor Masofasi: 86.0

O'rtacha = (92.5 + 89.1 + 85.3 + 86.0) / 4 = 88.225

Toshkent MTU Reytingi = 88.2 🟢
```

---

## 🎯 PROFIL BO'YICHA VAZNLAR

Har xil profil uchun vaznlar biroz farq qiladi:

### Lokomotiv Xo'jaligi (Juda yuqori xavfli)
```
ltifr: 45% (eng yuqori!)
trir: 10%
equipment: 6%
... qolganlar
```

### Yo'l/Vagon/Elektr/Zavod
```
ltifr: 40%
trir: 10%
... qolganlar
```

### Harakat Boshqaruv (Inson omili muhim)
```
ltifr: 35%
training: 8%
compliance: 4%
... qolganlar
```

---

## 🔍 FILTRLASH TIZIMI

### 1. Barcha Korxonalar (Default)
```
Filter: "📊 Barcha korxonalar"
→ Barcha kiritilgan korxonalar reytingi
→ Ma'lumot kiritilgan korxonalar
→ Umumiy indeks bo'yicha saralangan
```

### 2. Parent Company
```
Filter: "🏛️ O'zbekiston Temir Yo'llari AJ"
→ Barcha parent companylar (MTU, AJ platformalar)
→ Har birining o'rtacha reytingi
→ Ichidagi korxonalar asosida
```

### 3. Tashkilot Ichida
```
Filter: "🚉 Toshkent MTU"
→ Faqat Toshkent MTU korxonalari
→ 4 ta korxona
→ Ularning reytingi
```

---

## 💾 MA'LUMOTLAR SAQLASH

### Firebase Firestore
```
Collection: companies
Document ID: comp_xxxxx

Ma'lumotlar:
{
    id: "comp_001",
    name: "Toshkent Elektr",
    level: "subsidiary",
    supervisorId: "toshkent_mtu",
    profile: "electric",
    employees: 500,
    overallIndex: 65.12,
    zone: "yellow",
    kpis: {
        ltifr: { value: 80, score: 40 },
        trir: { value: 3, score: 40 },
        ...
    },
    accidents: {
        fatal: 0,
        severe: 1,
        group: 0,
        light: 3
    },
    createdAt: timestamp,
    updatedAt: timestamp
}
```

### LocalStorage (Backup)
```
localStorage.setItem('mm_companies', JSON.stringify(companies));
```

---

## 🎨 VIZUAL KO'RINISH

### Podium (Top 3)
```
     🥈 2nd          🥇 1st          🥉 3rd
   88.3 ball      92.5 ball      85.7 ball
   Buxoro MTU     Qo'qon Depo    Toshkent MTU
```

### Reyting Jadvali
```
┌─────┬──────────────────────┬────────┬──────┬────────┐
│  #  │ Korxona              │ Xodim  │ Ball │  Zona  │
├─────┼──────────────────────┼────────┼──────┼────────┤
│  1  │ Qo'qon Depo          │  500   │ 92.5 │ 🟢     │
│  2  │ Buxoro MTU           │  300   │ 88.3 │ 🟢     │
│  3  │ Toshkent MTU         │  800   │ 85.7 │ 🟢     │
│ ... │ ...                  │  ...   │ ...  │ ...    │
└─────┴──────────────────────┴────────┴──────┴────────┘
```

### Statistika
```
Jami: 30 korxona
🟢 Yashil: 12 korxona (40%)
🟡 Sariq: 10 korxona (33%)
🔴 Qizil: 8 korxona (27%)
```

---

## 🎯 XULOSA

### Asosiy Formulalar

1. **Baxtsiz hodisalar jarima**:
   ```
   Penalty = (Fatal × 100) + (Severe × 50) + (Group × 40) + (Light × 10)
   ```

2. **KPI Score**:
   ```
   Score = normalize(Value) // 0-100 oralig'ida
   ```

3. **Umumiy Indeks**:
   ```
   Index = Σ (KPI_score × KPI_weight)
   ```

4. **Parent Reyting**:
   ```
   Parent_Index = Σ (Child_Index) / Child_Count
   ```

### Vazn Taqsimoti

```
🔴 Kritik (50%):
   - Baxtsiz hodisalar: 40%
   - Mikro-jarohatlar: 10%

🟡 Muhim (30%):
   - Bexavfsiz kunlar: 6%
   - O'qitish: 5%
   - Xavf baholash: 5%
   - SHHV: 5%
   - Uskuna: 5%
   - Profilaktika: 4%

🟢 Qo'shimcha (20%):
   - Xabarlar: 4%
   - Reaksiya: 4%
   - Nazorat: 3%
   - Kasbiy kasallik: 3%
   - Audit: 2%
   - Avariya: 2%
   - Buzilishlar: 2%
```

---

## 📚 QISQACHA

**Tizim maqsadi**: Korxonalarning xavfsizlik darajasini baholash

**Asosiy ko'rsatkich**: Baxtsiz hodisalar (40% vazn)

**Hisoblash**: 15 ta KPI → Normalizatsiya → Vaznli yig'indi → Umumiy indeks

**Natija**: 0-100 ball, 3 ta zona (🟢🟡🔴), reyting

**HAMMASI ANIQ VA TUSHUNARLI!** 🎉
