# "MM-CONTROL" Tizimi Metodologik Qo'llanmasi

## Kirish

Ushbu hujjat "MM-CONTROL" (Mehnat Muhofazasi Nazorati) platformasining asosiy "Konstitutsiyasi" bo'lib xizmat qiladi. Hujjatda tizimning asosiy baholash mezonlari (KPI), ularning vaznlari va hisoblash mantiqi batafsil bayon etilgan.

## 1. KPI Tizimi (Baholash Ko'rsatkichlari)

Tizim 15 ta asosiy indikator (KPI) asosida korxona va bo'linmalarning xavfsizlik reytingini aniqlaydi.
Jami vazn yig'indisi: **1.00 (100%)**

| № | KPI Kodi | Nomi | Vazn (Weight) | Yo'nalish | Tavsif |
|---|---|---|---|---|---|
| 1 | `ltifr` | **Baxtsiz hodisalar (LTIFR)** | 0.40 (40%) | 📉 Kamaytirish | Lost Time Injury Frequency Rate - Eng muhim ko'rsatkich. |
| 2 | `hseStaffing` | **MM xizmati shtat birliklari** | 0.10 (10%) | 📈 Oshirish | MM xizmati uchun normativ bo'yicha talab etiladigan shtat to'liqligi. |
| 3 | `noincident` | **Hodisasiz kunlar** | 0.06 (6%) | 📈 Oshirish | Korxonada baxtsiz hodisa sodir bo'lmagan ketma-ket kunlar soni. |
| 4 | `equipment` | **XICHO bo'yicha uskunalar** | 0.06 (6%) | 📈 Oshirish | Identifikatsiyadan o'tgan, soz holatdagi uskunalar va rolling stock ulushi. |
| 5 | `training` | **O'qitish qamrovi** | 0.05 (5%) | 📈 Oshirish | Xodimlar o'z vaqtida o'qitish va imtihonlardan o'tganligi. |
| 6 | `ppe` | **SHHV bilan ta'minlanganlik** | 0.05 (5%) | 📈 Oshirish | Shaxsiy Himoya Vositalari (SHHV) bilan ta'minlanganlik darajasi. |
| 7 | `workplaceAssessment`| **Ish o'rinlarini baholash** | 0.05 (5%) | 📈 Oshirish | Mehnat sharoitlari va xavflarni baholash (Assessment) qamrovi. |
| 8 | `prevention` | **Profilaktika xarajatlari** | 0.04 (4%) | 📈 Oshirish | Mehnat muhofazasi uchun ajratilgan mablag'lar (CAPEX/OPEX). |
| 9 | `workStoppage` | **Ishlarni to'xtatish** | 0.04 (4%) | 📈 Oshirish | Xavfli holatlarda ishlarni to'xtatish tashabbusi (Internal vs External). |
| 10 | `insurance` | **Sug'urta va Kompensatsiya** | 0.04 (4%) | 📉 Kamaytirish | Ishchi sog'lig'iga yetkazilgan zarar uchun to'lovlar. |
| 11 | `inspection` | **Nazorat (Tekshiruvlar)** | 0.03 (3%) | 📈 Oshirish | Rejalashtirilgan tekshiruvlarning o'z vaqtida bajarilishi. |
| 12 | `occupational` | **Kasbiy kasalliklar** | 0.02 (2%) | 📉 Kamaytirish | Ro'yxatga olingan kasbiy kasalliklar soni. |
| 13 | `compliance` | **Audit nomuvofiqliklar** | 0.02 (2%) | 📉 Kamaytirish* | Tashqi va ichki auditlarda aniqlangan kamchiliklar. (*oz bo'lishi yaxshi, lekin bartaraf etilishi inobatga olinadi) |
| 14 | `emergency` | **Texnik mashg'ulotlar** | 0.02 (2%) | 📈 Oshirish | Favqulodda vaziyatlarga tayyorgarlik mashg'ulotlarida qatnashganlar. |
| 15 | `violations` | **Talonlar (Intizomiy choralar)**| 0.02 (2%) | 📉 Kamaytirish | Xavfsizlik qoidalarini buzganlik uchun qo'llanilgan choralar. |

---

## 2. Xavf Profillari (Risk Profiles)

Har bir xo'jalik turi o'zining xavf darajasiga qarab tasniflanadi. Bu sinflar KPI talablarini (Target) belgilaydi.

| Sinf | Nomi | Koeffitsient | Xo'jaliklar (Misol) |
|---|---|---|---|
| **HIGH** | Juda Yuqori Xavf | 1.0 | Lokomotiv, Vagon, Yo'l xo'jaligi |
| **MEDIUM**| O'rtacha Xavf | 0.7 | Elektr ta'minoti, Harakatni boshqarish, Zavodlar |
| **LOW** | Past Xavf | 0.4 | Ofis, Ma'muriyat |

Targetlar (Maqsadli ko'rsatkichlar) har bir xavf profili uchun alohida belgilanadi (Masalan, **HIGH** profili uchun `minLTIFR` chegarasi yuqoriroq, lekin jazo qattiqroq).

## 3. Hisoblash Algoritmi (Calculation Engine)

Yakuniy Reyting quyidagi formula asosida hisoblanadi:

```javascript
FinalScore = SUM(KPI_Value * KPI_Weight * Risk_Coefficient)
```
*(Aniq formulalar Backend Calculation Engine qismida to'liq implementatsiya qilinadi)*

Ushbu metodologiya "MM-CONTROL" tizimining "Miyadagi" asosiy mantiqiy qismidir.
