
# MM-CONTROL Tizimini O'rnatish va Ishga Tushirish Bo'yicha Qo'llanma

Ushbu qo'llanma "MM-CONTROL" (Mehnat Muhofazasi Reyting Tizimi) loyihasini o'rnatish, test qilish va serverga joylash (deploy) jarayonini tushuntiradi.

## 1. Talablar (Prerequisites)

Loyihani ishga tushirish uchun kompyuteringizda quyidagilar o'rnatilgan bo'lishi kerak:
- **Node.js** (v18 yoki undan yuqori)
- **npm** (Node Package Manager)
- **Git**

## 2. O'rnatish (Installation)

Loyihani klonlash va kutubxonalarni o'rnatish:

```bash
# Repozitoriyni klonlash
git clone <repository-url>
cd safety-scoreboard

# Kutubxonalarni o'rnatish
npm install
```

## 3. Lokal Ishga Tushirish (Development Service)

Dasturni tuzatish va rivojlantirish rejimidan foydalanish uchun:

```bash
npm run dev
```

Bu buyruq lokal serverni (odatda `http://localhost:5173`) ishga tushiradi. Brauzerda shu manzilni ochib, dasturni tekshirishingiz mumkin.

**Login ma'lumotlari (Test):**
- **Admin:** `admin` / `admin123`
- **Menejer:** `manager` / `manager123`
- **Nazoratchi:** `supervisor` / `super123`

## 4. Loyihani Qurish (Building for Production)

Serverga joylashdan oldin loyihani optimizatsiya qilingan versiyasini "build" qilish kerak:

```bash
npm run build
```

Bu buyruq `dist` papkasida tayyor fayllarni yaratadi.

## 5. Deployment (Serverga Joylash)

### Variant A: Netlify (Tavsiya etiladi - Frontend uchun)

1. **Netlify.com** saytidan ro'yxatdan o'ting.
2. "Add new site" -> "Import an existing project" tugmasini bosing.
3. GitHub/GitLab repozitoriyingizni tanlang.
4. **Build Settings**:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. "Deploy site" tugmasini bosing.

### Variant B: Vercel

1. **Vercel.com** saytidan ro'yxatdan o'ting.
2. "Add New..." -> "Project".
3. Repozitoriyni import qiling.
4. Framework Preset avtomatik ravishda `Vite` deb aniqlanishi kerak.
5. "Deploy" tugmasini bosing.

## 6. Ma'lumotlar Bazasi (Supabase)

Loyiha hozirda Supabase ("Backend-as-a-Service") dan foydalanadi. 

- Agar siz o'zingizning Supabase loyihangizni ulamoqchi bo'lsangiz:
  1. `src/lib/supabase.ts` faylini oching.
  2. `supabaseUrl` va `supabaseAnonKey` o'zgaruvchilarini o'zingizning loyihangiz ma'lumotlariga o'zgartiring.
  
Hozirgi holatda demo ma'lumotlar bazasi ulangan va u ishlashga tayyor.

## 7. Xavfsizlik Eslatmalari

- Haqiqiy ishlab chiqarish (production) muhitida `src/lib/auth/auth.ts` dagi `INITIAL_USERS` ro'yxatini o'chirib tashlash yoki parollarni o'zgartirish tavsiya etiladi.
- Supabase xavfsizlik qoidalarini (RLS - Row Level Security) sozlashni unutmang.

---

**Muvaffaqiyat!** Tizim endi to'liq ishlashga tayyor.
