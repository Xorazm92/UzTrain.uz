# 🔄 Manual Sync - Firebase'siz Ishlash

## 🎯 **MAQSAD:**
Firebase Blaze Plan'siz, boshqa kompyuterlar bilan ma'lumot almashish

---

## 📋 **YECHIM: Export/Import Tizimi**

### **Qanday Ishlaydi:**

1. **Kompyuter A'da:**
   - Korxona qo'shing
   - **"💾 Eksport"** tugmasini bosing
   - JSON fayl yuklab olinadi

2. **Faylni Ko'chiring:**
   - USB, Email, Telegram, Google Drive orqali
   - Kompyuter B'ga yuboring

3. **Kompyuter B'da:**
   - **"📥 Import"** tugmasini bosing
   - JSON faylni tanlang
   - Ma'lumotlar yuklanadi

---

## ✅ **AFZALLIKLARI:**

- ✅ **Bepul** - Hech qanday to'lov yo'q
- ✅ **Ishonchli** - Quota muammosi yo'q
- ✅ **Xavfsiz** - Ma'lumotlar sizda
- ✅ **Oddiy** - Faqat fayl ko'chirish

---

## ⚠️ **KAMCHILIKLARI:**

- ⚠️ **Qo'lda** - Avtomatik emas
- ⚠️ **Vaqt kerak** - Har safar export/import
- ⚠️ **Konflikt** - Ikki joyda o'zgarsa, muammo

---

## 🚀 **QANDAY ISHLASH:**

### **Scenario 1: Bir Odam, Ikki Kompyuter**

**Ish Kompyuterda:**
1. Korxonalar qo'shing
2. Ish tugagach **"💾 Eksport"** qiling
3. Faylni USB/Cloud'ga saqlang

**Uy Kompyuterda:**
1. **"📥 Import"** qiling
2. Davom eting
3. Tugagach yana **"💾 Eksport"** qiling

**Keyingi Kun Ish Kompyuterda:**
1. Uydan kelgan faylni **"📥 Import"** qiling
2. Davom eting

---

### **Scenario 2: Jamoada Ishlash**

**Mas'ul Odam (siz):**
1. Asosiy ma'lumotlarni saqlaysiz
2. Har kuni **"💾 Eksport"** qilasiz
3. Faylni jamoa bilan bo'lishasiz (Telegram group)

**Boshqa Odamlar:**
1. Sizdan so'nggi faylni oladi
2. **"📥 Import"** qiladi
3. Ko'radi, lekin o'zgartirmaydi

**Agar O'zgartirish Kerak Bo'lsa:**
1. Sizga xabar beradi
2. Siz o'zgartirish kiritasiz
3. Yangi faylni bo'lishasiz

---

## 💾 **BACKUP STRATEGIYASI:**

### **Kunlik:**
- Har kuni ish oxirida **"💾 Eksport"** qiling
- Faylni sana bilan nomlang: `backup_2025-12-02.json`

### **Haftalik:**
- Haftada bir marta asosiy backup oling
- Xavfsiz joyda saqlang (Google Drive, USB)

### **Oylik:**
- Oyda bir marta arxiv yarating
- Eski backuplarni saqlang

---

## 📂 **FAYL TASHKIL QILISH:**

```
Backups/
├── 2025-12/
│   ├── backup_2025-12-01.json
│   ├── backup_2025-12-02.json
│   ├── backup_2025-12-03.json
│   └── ...
├── 2025-11/
│   └── backup_2025-11-30.json
└── Archive/
    └── backup_2025-10-31.json
```

---

## 🔧 **QANDAY EXPORT/IMPORT QILISH:**

### **Export:**
1. Tizimda **"💾 Eksport"** tugmasini bosing
2. Fayl yuklab olinadi: `companies_backup_2025-12-02.json`
3. Uni xavfsiz joyga ko'chiring

### **Import:**
1. Tizimda **"📥 Import"** tugmasini bosing
2. JSON faylni tanlang
3. Ma'lumotlar yuklanadi
4. Sahifa avtomatik yangilanadi

---

## ⚠️ **KONFLIKTLARDAN QOCHISH:**

### **Qoida 1: Bitta Asosiy Manba**
- Faqat bitta odam o'zgartiradi
- Boshqalar faqat ko'radi

### **Qoida 2: Har Doim So'nggi Versiyani Ishlating**
- Import qilishdan oldin export qiling
- Eski versiyani saqlab qo'ying

### **Qoida 3: Sana/Vaqt Belgilang**
- Har bir export'ga sana qo'ying
- Eng yangi faylni ishlating

---

## 📊 **TAQQOSLASH:**

| Xususiyat | Firebase Blaze | Manual Sync |
|-----------|----------------|-------------|
| Narx | ~$0/oy (karta kerak) | Bepul |
| Avtomatik | ✅ Ha | ❌ Yo'q |
| Real-time | ✅ Ha | ❌ Yo'q |
| Oddiylik | ⚠️ Sozlash kerak | ✅ Juda oson |
| Xavfsizlik | ✅ Yuqori | ✅ Yuqori |
| Offline | ✅ Ha | ✅ Ha |

---

## 💡 **TAVSIYA:**

### **Agar:**
- ✅ Faqat siz ishlatsangiz → **LocalStorage yetarli**
- ✅ Bir necha kompyuterdan → **Manual Sync**
- ✅ Jamoada, real-time kerak → **Firebase Blaze** (agar karta bo'lsa)

---

## ✅ **XULOSA:**

**Manual Sync** - eng oddiy va ishonchli yechim:
1. ✅ Bepul
2. ✅ Oddiy
3. ✅ Xavfsiz
4. ✅ Ishlaydi

**Kamchiligi:** Qo'lda export/import qilish kerak, lekin bu unchalik qiyin emas!

---

**Keyingi qadam:** Tizimda "💾 Eksport" va "📥 Import" tugmalari allaqachon bor - ulardan foydalaning!
