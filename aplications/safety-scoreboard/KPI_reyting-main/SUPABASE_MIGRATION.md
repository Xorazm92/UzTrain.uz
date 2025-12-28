# 🚀 Supabase'ga O'tish - To'liq Yo'riqnoma

## 🎯 **MAQSAD:**
200 ta korxona uchun markaziy database yaratish - 100% BEPUL!

---

## ⚡ **BOSQICH 1: Supabase Project Yaratish**

### **1. Supabase'ga Ro'yxatdan O'ting:**
```
https://supabase.com
```
- **"Start your project"** tugmasini bosing
- GitHub yoki Google bilan kiring (BEPUL!)

### **2. Yangi Project Yarating:**
- **"New Project"** tugmasini bosing
- **Name:** `nbt-kpi`
- **Database Password:** Kuchli parol kiriting (saqlab qo'ying!)
- **Region:** Singapore (eng yaqin)
- **Pricing Plan:** **FREE** ✅
- **"Create new project"** tugmasini bosing

⏳ 2-3 daqiqa kutib turing (database yaratilmoqda)

---

## 📊 **BOSQICH 2: Database Strukturasini Yaratish**

### **1. SQL Editor'ni Oching:**
- Chap menyudan **"SQL Editor"** ni tanlang
- **"New query"** tugmasini bosing

### **2. Quyidagi SQL'ni Kiriting:**

```sql
-- Companies jadvali
CREATE TABLE companies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    level TEXT,
    parent TEXT,
    profile TEXT,
    employees INTEGER DEFAULT 0,
    total_hours INTEGER DEFAULT 0,
    overall_index DECIMAL(5,2) DEFAULT 0,
    zone TEXT,
    date_added TIMESTAMP DEFAULT NOW(),
    raw_data JSONB,
    kpis JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index'lar (tezlik uchun)
CREATE INDEX idx_companies_name ON companies(name);
CREATE INDEX idx_companies_level ON companies(level);
CREATE INDEX idx_companies_parent ON companies(parent);
CREATE INDEX idx_companies_zone ON companies(zone);

-- Row Level Security (RLS) yoqish
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Barcha uchun o'qish ruxsati
CREATE POLICY "Enable read access for all users" 
ON companies FOR SELECT 
USING (true);

-- Barcha uchun yozish ruxsati (hozircha)
CREATE POLICY "Enable insert for all users" 
ON companies FOR INSERT 
WITH CHECK (true);

-- Barcha uchun yangilash ruxsati
CREATE POLICY "Enable update for all users" 
ON companies FOR UPDATE 
USING (true);

-- Barcha uchun o'chirish ruxsati
CREATE POLICY "Enable delete for all users" 
ON companies FOR DELETE 
USING (true);
```

### **3. Run Qiling:**
- **"Run"** tugmasini bosing (yoki Ctrl+Enter)
- ✅ "Success. No rows returned" ko'rinishi kerak

---

## 🔑 **BOSQICH 3: API Keys Olish**

### **1. Settings'ga O'ting:**
- Chap menyudan **"Settings"** ni tanlang
- **"API"** tabini oching

### **2. Kerakli Ma'lumotlarni Nusxalang:**

```
Project URL: https://xxxxx.supabase.co
anon/public key: eyJhbGci...
```

**MUHIM:** Bu ma'lumotlarni xavfsiz joyda saqlang!

---

## 💻 **BOSQICH 4: Kodni O'zgartirish**

### **1. Supabase Client Qo'shish:**

`index.html` fayliga Firebase SDK o'rniga Supabase qo'shing:

**Topish:** (740-742 qatorlar)
```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>
```

**O'zgartirish:**
```html
<!-- Supabase SDK -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

### **2. app.js'ni O'zgartirish:**

**Topish:** (1-23 qatorlar - Firebase config)
```javascript
// FIREBASE CONFIGURATION
const firebaseConfig = {
    apiKey: "...",
    ...
};
```

**O'zgartirish:**
```javascript
// ===================================
// SUPABASE CONFIGURATION
// ===================================
const SUPABASE_URL = 'https://xxxxx.supabase.co'; // O'zingizniki
const SUPABASE_KEY = 'eyJhbGci...'; // O'zingizniki

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
let db = supabase; // Compatibility

console.log("✅ Supabase ulandi!");
```

### **3. CRUD Funksiyalarini O'zgartirish:**

#### **A. loadCompanies() - Ma'lumotlarni Yuklash:**

```javascript
async function loadCompanies() {
    console.log("📡 loadCompanies - Supabase'dan yuklanmoqda...");
    
    try {
        const { data, error } = await supabase
            .from('companies')
            .select('*')
            .order('overall_index', { ascending: false });
        
        if (error) throw error;
        
        companies = data || [];
        console.log(`✅ ${companies.length} ta korxona yuklandi`);
        
        // Backup to LocalStorage
        localStorage.setItem('mm_companies', JSON.stringify(companies));
        
        refreshUI();
    } catch (error) {
        console.error("❌ Supabase xatosi:", error);
        // Fallback to LocalStorage
        loadLocal();
    }
}

// Real-time subscription (avtomatik yangilanish)
supabase
    .channel('companies-changes')
    .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'companies' },
        (payload) => {
            console.log('🔄 Ma\'lumot o\'zgardi:', payload);
            loadCompanies(); // Qayta yuklash
        }
    )
    .subscribe();
```

#### **B. addOrUpdateCompany() - Saqlash:**

```javascript
async function addOrUpdateCompany(formData) {
    console.log("🚀 addOrUpdateCompany - Supabase'ga saqlanmoqda...");
    
    try {
        const kpis = calculateCompanyKPIs(formData);
        const profileId = document.getElementById('company-profile').value;
        const overallIndex = calculateOverallIndex(kpis, profileId);
        const zone = getZone(overallIndex);
        
        const id = currentEditId || generateId();
        
        const companyData = {
            id: id,
            name: formData.name,
            level: formData.level,
            parent: formData.parent,
            profile: profileId,
            employees: parseFloat(formData.employees) || 0,
            total_hours: parseFloat(formData.totalHours) || 0,
            kpis: kpis,
            overall_index: overallIndex,
            zone: zone.name,
            date_added: currentEditId 
                ? (companies.find(c => c.id === currentEditId)?.date_added || new Date().toISOString())
                : new Date().toISOString(),
            raw_data: formData,
            updated_at: new Date().toISOString()
        };
        
        const { data, error } = await supabase
            .from('companies')
            .upsert(companyData, { onConflict: 'id' })
            .select();
        
        if (error) throw error;
        
        console.log("✅ Supabase'ga saqlandi!");
        
        currentEditId = null;
        finishSave(!!currentEditId);
        
    } catch (error) {
        console.error("❌ Supabase xatosi:", error);
        alert("Xatolik: " + error.message);
    }
}
```

#### **C. deleteCompany() - O'chirish:**

```javascript
async function deleteCompany(id) {
    if (!confirm('Bu korxonani o\'chirmoqchimisiz?')) return;
    
    try {
        const { error } = await supabase
            .from('companies')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        
        console.log("🗑️ Supabase'dan o'chirildi!");
        
        if (typeof showNotification === 'function') {
            showNotification('Korxona o\'chirildi 🗑️', 'warning');
        }
        
        loadCompanies(); // Qayta yuklash
        
    } catch (error) {
        console.error("❌ Xato:", error);
        alert("O'chirishda xatolik: " + error.message);
    }
}
```

---

## 🔐 **BOSQICH 5: Row Level Security (Keyin)**

Hozircha barcha uchun ochiq. Keyin har korxona faqat o'z ma'lumotini ko'rishi uchun:

```sql
-- Har korxona faqat o'z ma'lumotini ko'radi
CREATE POLICY "Users can only see their company" 
ON companies FOR SELECT 
USING (auth.jwt() ->> 'company_id' = id);

-- Har korxona faqat o'z ma'lumotini o'zgartiradi
CREATE POLICY "Users can only update their company" 
ON companies FOR UPDATE 
USING (auth.jwt() ->> 'company_id' = id);
```

---

## 📊 **BOSQICH 6: Ma'lumotlarni Ko'chirish**

### **1. LocalStorage'dan Export Qiling:**
```
file:///home/ctrl/Documents/bak/check-data.html
```
- **"💾 Backup Olish"** tugmasini bosing
- `backup_2025-12-02.json` fayli yuklab olinadi

### **2. Supabase'ga Import Qiling:**

Supabase Dashboard'da:
1. **Table Editor** → **companies**
2. **"Insert"** → **"Insert row"**
3. Yoki SQL Editor'da:

```sql
-- JSON fayldan import (Python script bilan)
-- Yoki qo'lda bitta-bitta qo'shing
```

**Yoki oddiyroq:** Tizimda Import funksiyasini yarating.

---

## ✅ **NATIJA:**

### **Ishlaydi:**
- ✅ 200 ta korxona
- ✅ Har biri o'z ma'lumotini kiritadi
- ✅ Real-time yangilanish
- ✅ Markaziy database
- ✅ 100% BEPUL!

### **Xususiyatlar:**
- ✅ Unlimited API requests
- ✅ 500 MB storage (yetarli!)
- ✅ Real-time subscriptions
- ✅ Row Level Security
- ✅ Backup avtomatik

---

## 📞 **YORDAM:**

Muammo bo'lsa:
1. Supabase Dashboard → Logs
2. Console'da xatolarni tekshiring
3. Supabase Docs: https://supabase.com/docs

---

## 🎉 **XULOSA:**

**Supabase - eng yaxshi yechim sizning holatingiz uchun:**
- ✅ 100% BEPUL
- ✅ Professional
- ✅ 200 korxona uchun ideal
- ✅ Real-time
- ✅ Xavfsiz

**Keyingi qadam:** Supabase project yarating va kodni o'zgartiring!
