# O'zbekiston Temir Yo'llari AJ - Mehnat Muhofazasi Reyting Tizimi

## Overview
15 bandlik professional xavfsizlik reyting tizimi - O'zbekiston temir yo'l sanoati uchun maxsus ishlab chiqilgan. Firebase bilan integratsiya qilingan.

## Hozirgi Holat (2024-12-01)
- **STRICT SCORING MODEL** qo'llanildi - xavfsizlik standartlari qat'iylashtirdi
- Firebase NBT-KPI bazasi bilan ishlaydi (30 ta korxona real-time)
- 15 bandlik KPI tizimi to'liq joriy etildi (vaznlar 100% ga teng)
- Risk-asoslashtirilgan minimum requirements enforce qilindi
- LTIFR penalty-to-score konversiya OSHA standartiga muvofiq
- Barcha bazadagi korxonalar STRICT formulalarga qayta hisobland

## Asosiy Xususiyatlar

### 15 Bandlik KPI Tizimi (100% Vazn)
| # | KPI | Vazn | Tavsif |
|---|-----|------|--------|
| 1 | LTIFR (Baxtsiz hodisalar) | 40% | Accident Severity Index |
| 2 | TRIR | 10% | Mikro-jarohatlar darajasi |
| 3 | Bexavfsiz kunlar | 6% | Hodisasiz kunlar soni |
| 4 | O'qitish qamrovi | 5% | MM o'quvlarini o'tganlar |
| 5 | Uskuna nazorati | 6% | Rolling stock va uskunalar |
| 6 | SHHV ta'minoti | 5% | Shaxsiy himoya vositalari |
| 7 | Xavfni baholash | 5% | Risk Assessment qamrovi |
| 8 | Profilaktika | 4% | CAPEX/OPEX ratio |
| 9 | Near Miss | 4% | Safety Culture indicator |
| 10 | Murojaatga reaksiya | 4% | Nomuvofiqliklarni yopish |
| 11 | Nazorat rejasi | 3% | Ichki nazorat ijrosi |
| 12 | Kasbiy kasalliklar | 2% | Aniqlangan kasalliklar |
| 13 | Audit samaradorligi | 2% | Muvofiqlik darajasi |
| 14 | Avariya mashqlari | 2% | Tayyorgarlik darajasi |
| 15 | Intizomiy | 2% | Talon tizimi |

### STRICT Scoring Model (2024-12-01)
**Penalty-to-Score konversiya:**
- 0 hodisa: 100 ball
- 1 hodisa: 85 ball (eski: 95) - **-10 ball**
- 5 hodisa: 60 ball
- 10+ hodisa: 0 ball

**Minimum Requirements Violations:**
| Metrika | Oyuti | Tavsif |
|---------|-------|--------|
| LTIFR | -25 | (eski: -15) JUDA QATTIQ |
| TRIR | -20 | (eski: -10) QATTIQ |
| Training | -15 | (eski: -8) QATTIQ |
| PPE | -20 | (eski: -10) QATTIQ |
| Equipment | -15 | (eski: -8) QATTIQ |
| Risk Assessment | -12 | (eski: -7) QATTIQ |

**High Risk (Lokomotiv, Yo'l, Vagon):**
- minLTIFR: 15 ball (eski: 10)
- minTRIR: 8 ball (eski: 5)
- minTraining: 95% (eski: 90%)
- minPPE: 95% (eski: 90%)
- minEquipment: 90% (eski: 85%)

### Department Profillar (6 ta Xo'jalik)
- **Lokomotiv** (HIGH) - LTIFR 40%, Juda yuqori xavf
- **Yo'l xo'jaligi** (HIGH) - LTIFR 40%, Yuqori fizik xavf
- **Vagon xo'jaligi** (HIGH) - LTIFR 40%, Texnologik xavf
- **Elektr va Aloqa** (MEDIUM) - LTIFR 38%, Elektroxavfsizlik
- **Harakatni Boshqarish** (MEDIUM) - LTIFR 35%, Inson omili
- **Zavodlar** (MEDIUM) - LTIFR 40%, Sanoat xavfsizligi

### Zona Klassifikatsiyasi
- 🟢 Yashil: 80+ ball - Xavfsiz/A'lo
- 🟡 Sariq: 50-79 ball - Qoniqarli
- 🔴 Qizil: <50 ball - Xavfli/Kritik

### Hierarchical Filtering
- **Management Level**: Supervizor korxonalari uchun aggregated score
- **Supervisor Level**: Filiallardan subordinate datani ko'rish
- **Subsidiary Level**: Raw KPI datasi, red-flag analysis
- **Three-Tier Filtering**: Tashkiliy struktura orqali drill-down

## Texnik Tuzilma

### Frontend Files
- `index.html` - UI, Modal, Tabs (Dashboard, Add Company, Compare, Statistics, Risk Analysis)
- `styles.css` - Professional UI with 3-zone colors, modals, grids
- `app.js` - Business logic, KPI calculations, Firebase sync, STRICT scoring
- `data.js` - KPI configs, risk profiles, weights, benchmarks
- `auth.js` - Role-based access control (admin, manager, supervisor, user)
- `filter.js` - Organization hierarchy filtering
- `hierarchy.js` - Data structure & parent-child relationships

### Firebase Integration
- Project: nbt-kpi
- Real-time listener on companies collection
- Auto-sync on save
- Automatic recomputation of all company scores on app load

### Key Functions
```javascript
calculateOverallIndex(kpiResults, profileId)  // Weighted scoring + minimum penalties
recomputeAllCompaniesScores()                  // Re-calc all 30 companies with STRICT model
checkMinimumRequirements(scores, department)   // Risk-based penalty checking
penaltyToScore(penalty)                        // STRICT linear interpolation
normalizeKPI(value, kpiKey)                    // Per-KPI normalization
```

## Firebase Data (30 ta Korxona)
- Real-time loaded from NBT-KPI collection
- rawData preserved for recomputation
- Auto-updated on STRICT scoring
- 30 companies across 6 departments

## UI Features
- ✅ Professional Dashboard with ranking table
- ✅ Company Details Modal (15 KPI breakdown + minimum requirements)
- ✅ Comparison Tool (KPI cross-comparison)
- ✅ Risk Analysis (RED zone alerts)
- ✅ Statistics (Green/Yellow/Red counts)
- ✅ Role-based access (4 levels)
- ✅ Hierarchical filtering (Management → Supervisor → Subsidiary)
- ✅ Color-coded zones (3-tier safety system)

## Recent Changes (2024-12-01)
- [x] STRICT penalty-to-score model implemented (1 hodisa = 85)
- [x] TRIR scoring tightened (0.2+ = -50 ball)
- [x] Minimum requirements penalties 2x increased
- [x] Risk profile thresholds raised (95% training/PPE for HIGH risk)
- [x] recomputeAllCompaniesScores() function added
- [x] Firebase 30 ta korxona STRICT modelga qayta hisobland
- [x] Modal UI complete with 15 KPI breakdown
- [x] Professional dashboard ready

## Foydalanuvchi Sozlamalari
- **Til**: O'zbek
- **Standartlar**: ISO 45001, OSHA, ILO, O'zR Qonunlari
- **Port**: 5000
- **Scoring Model**: STRICT (as of 2024-12-01)

## Deployment Status
✅ **READY FOR PRODUCTION**
- All 30 companies recomputed with STRICT model
- Real-time Firebase sync active
- Dashboard, modals, filtering all functional
- Risk-based minimum requirements enforced
- Professional UI/UX complete

---
**Oxirgi yangilanish**: 2024-12-01 (STRICT Scoring activated)
**Status**: Production Ready ✅
