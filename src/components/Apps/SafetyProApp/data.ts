import { Category, PPEItem, PlanningRow } from './types';

const shxvAsset = (file: string) =>
  new URL(
    `../../../../aplications/safetypro-os---ppe-management-system/SHXV/${file}`,
    import.meta.url
  ).href;

export const PPE_DATA: PPEItem[] = [
  {
    id: 'seasonal-oty',
    name: "Mavsumiy kostyum (OTY AJ)",
    category: Category.SEASONAL,
    gost: "O'z DSt 12.4.280:2015",
    image: shxvAsset('maxsuskiyim_umumiy.jpg'),
    gallery: [
      shxvAsset('maxsuskiyim_umumiy.jpg'),
      shxvAsset('maxsuskiyim_stansiya.jpg'),
      shxvAsset('maxsuskiyim_yolxojaligi.jpg'),
    ],
    department: "Lokomotiv xo‘jaligi· Temir yo‘l brigadalari",
    description:
      "Yuqori ifloslanishli texnologik zonalarda ishlovchi brigadalar uchun asosiy SHHV komplekti. Kiyim OTY AJ 1-ILOVA xarid rejasi va GOST talablari bo‘yicha sertifikatlangan.",
    materials: "Greta aralash mato · 240 g/m² · Moy va suvga chidamli (MVO) ishlovi",
    specs: [
      { label: 'Himoya turkum', value: "II — mexanik va ifloslanishdan himoya" },
      { label: 'O‘lcham diapazoni', value: '44–64 / 170–188' },
      { label: 'Ishlab chiqaruvchi', value: 'OTY AJ SHXV Boshqarmasi' },
    ],
    colors: ["To‘q ko‘k", 'Grafit'],
    totalQuantity: 40151,
    unit: 'komplekt',
    documents: [
      {
        label: 'TЗ — demisazon SHHV (6 vid) PDF',
        url: shxvAsset('ТЗ_на_демисезонную_спецодежду_6_видов_2025.pdf'),
      },
      {
        label: 'TЗ — demisazon SHHV (6 vid) DOC',
        url: shxvAsset('ТЗ_на_демисезонную_спецодежду_6_видов_2025.doc'),
      },
      {
        label: '1-ILOVA 2025 xarid jadvali',
        url: shxvAsset('ПОТРЕБНОСТЬ_оригинал_заявки_СИЗ_на_2025_год_по_АО.xls'),
      },
    ],
  },
  {
    id: 'signal-vest',
    name: 'Signal jileti (2-klass)',
    category: Category.SEASONAL,
    gost: "O'z DSt 12.4.281:2015",
    image: shxvAsset('jilet.jpg'),
    gallery: [
      shxvAsset('jilet.jpg'),
      shxvAsset('maxsuskiyim_aloqa.jpg'),
      shxvAsset('maxsuskiyim_stansiya.jpg'),
    ],
    department: "Harakatni boshqarish xizmati · Nazorat postlari",
    description:
      "Yuqori ko‘rinuvchanlik talab qilinadigan kechki va tumanli sharoitlarda ishlash uchun refliktorli nimcha. Lex.uz dagi namunaviy nizomga muvofiq OTY AJ 2025 chastotasi asosida tanlangan.",
    materials: 'Lyuminessent polyester · 130 g/m² · 360° reflektor lenta (50 mm)',
    specs: [
      { label: 'Ko‘rinish sinfi', value: 'EN ISO 20471 — Class 2' },
      { label: 'Sovuqda elastiklik', value: '−25°C gacha saqlanadi' },
      { label: 'Regulyatsiya', value: 'Velkro va elastik bel to‘plami' },
    ],
    colors: ['Limon-sariq', "To‘q sariq"],
    totalQuantity: 45036,
    unit: 'dona',
    documents: [
      {
        label: 'TЗ — signal jileti 2025',
        url: shxvAsset('ТЗ на жилет сигнальный -2025.pdf'),
      },
      {
        label: 'TЗ — signal jileti 2025 DOC',
        url: shxvAsset('ТЗ на жилет сигнальный -2025.doc'),
      },
    ],
  },
  {
    id: 'electro-gloves',
    name: "Dielektrik qo‘lqop (0-klass)",
    category: Category.ELECTRICAL,
    gost: 'GOST 12.4.183-91',
    image: shxvAsset('xb_qolqop.jpg'),
    gallery: [
      shxvAsset('xb_qolqop.jpg'),
      shxvAsset('beshpanja_qolqop.jpg'),
      shxvAsset('kombinatsiyali_qolqop.jpg'),
    ],
    department: "Elektr ta’minoti korxonasi · Oblast laboratoriyalari",
    description:
      "1000 V gacha bo‘lgan kuchlanishda ishlovchi xodimlar uchun asosiy dielektrik himoya vositasi. Har 6 oyda sinovdan o‘tishi SHXV reglamenti bilan tasdiqlangan.",
    materials: 'Lateks / dielektrik rezina · 0-klass · GOST 12.4.103-83',
    specs: [
      { label: 'Sinov kuchlanishi', value: '6 kV (ichki), 9 kV (tashqi)' },
      { label: 'Qalinlik', value: '1.1 ± 0.1 mm' },
      { label: 'Standart paket', value: '2 juft + pasport' },
    ],
    colors: ['Oq-shaffof'],
    totalQuantity: 1832,
    unit: 'juft',
    documents: [
      {
        label: 'TЗ — dielektrik qo‘lqop 2024',
        url: shxvAsset('ТЗ рукавицы 2024.doc'),
      },
      {
        label: 'TЗ — dielektrik qo‘lqop (NH G‘ijduvon)',
        url: shxvAsset('ТЗ рукавицы 2025 для НХ в Гиждуван.doc'),
      },
      {
        label: 'GOST 12.4.183-91 matni',
        url: 'https://lex.uz/docs/343932',
      },
    ],
  },
  {
    id: 'winter-parka',
    name: 'Qishki issiq kurtka',
    category: Category.WINTER,
    gost: 'GOST 12.4.236-2011',
    image: shxvAsset('maxsuskiyim_elektr.jpg'),
    gallery: [
      shxvAsset('maxsuskiyim_elektr.jpg'),
      shxvAsset('maxsuskiyim_aloqa.jpg'),
      shxvAsset('maxsuskiyim_stansiya.jpg'),
    ],
    department: 'Yo‘l xo‘jaligi · Balansdagi brigadalar',
    description:
      "−35°C gacha bo‘lgan sovuq hududlarda kechki smenada ishlash uchun issiqlikni saqlovchi yuqori texnologik parka. Bo‘limlar kesimida talab 2025 yil xarid jadvalida tasdiqlangan.",
    materials: 'Rip-stop tashqi qatlam · Isitgich: hollofiber 280 g/m² · Termo podklad',
    specs: [
      { label: 'Himoya sinfi', value: 'Yuklab tushirish ishlari uchun III daraja' },
      { label: 'Germetik tikiqlar', value: 'AQSh 3M™ tasdiqlangan lenta' },
      { label: 'Qo‘shimcha', value: 'Kapishon + reflektor paneli' },
    ],
    colors: ['Ko‘k', 'Qizil-trim'],
    totalQuantity: 7820,
    unit: 'komplekt',
    documents: [
      {
        label: 'TЗ — qishki kurtka 2025',
        url: shxvAsset('ТЗ на зимние куртки 2025.pdf'),
      },
      {
        label: 'TЗ — qishki kurtka 2025 DOCX',
        url: shxvAsset('ТЗ на зимние куртки 2025.docx'),
      },
    ],
  },
  {
    id: 'harness-montaj',
    name: 'Montajchi xavfsizlik kamari',
    category: Category.HEIGHT,
    gost: 'GOST R EN 361-2008',
    image: shxvAsset('ximoya_belbog.jpg'),
    gallery: [
      shxvAsset('ximoya_belbog.jpg'),
      shxvAsset('maxsuskiyim_aloqa.jpg'),
      shxvAsset('maxsuskiyim_yolxojaligi.jpg'),
    ],
    department: 'Aloqa va signalizatsiya xizmati (SЦБ)',
    description:
      "Balansdagi ustunlar va balandlikda montaj ishlari davomida tushishdan individuall himoya vositasi. SHXV ichki reglamenti bo‘yicha 2023-yil tasdiqlangan talabga mos.",
    materials: 'Poliester sling · GiD texnologiyali karabinchalar',
    specs: [
      { label: 'Yuk ko‘tarish qobiliyati', value: '140 kg gacha' },
      { label: 'Sertifikat', value: 'EN 361 · EN 358' },
      { label: 'Komplekt', value: 'Lanyard + amortizator' },
    ],
    colors: ['To‘q ko‘k', 'Sariq aktsent'],
    totalQuantity: 1965,
    unit: 'komplekt',
    documents: [
      {
        label: 'TЗ — montajchi kamari',
        url: shxvAsset('ТЗ на монтажный пояс  2023.doc'),
      },
    ],
  },
  {
    id: 'kirza-boots',
    name: 'Kirza etik (GOST 8752-79)',
    category: Category.FOOTWEAR,
    gost: 'GOST 8752-79',
    image: shxvAsset('kirza_etik.jpg'),
    gallery: [
      shxvAsset('kirza_etik.jpg'),
      shxvAsset('obuv.jpg'),
      shxvAsset('obuv_1.jpg'),
    ],
    department: 'Vagon xo‘jaligi · Ta’mirlash sexlari',
    description:
      "Metallga ishlov berish va umumiy ishlab chiqarish sexlari uchun yog‘ va mexanik ta’sirlarga chidamli kirza etiklar.",
    materials: 'Yuft va kirza kombinatsiyasi · Issiq astar · Antistatik PU tag qismi',
    specs: [
      { label: 'Himoya sinfi', value: 'SB + E + P' },
      { label: 'Tag struktura', value: 'Ikki qatlamli PU/TPU' },
      { label: 'O‘lchamlar', value: '38–47' },
    ],
    colors: ['Qora'],
    totalQuantity: 12480,
    unit: 'juft',
    documents: [
      {
        label: 'TЗ — maxsus poyabzal 2025',
        url: shxvAsset('ТЗ на обувь.pdf'),
      },
    ],
  },
  {
    id: 'safety-helmet',
    name: 'Elektr xavfsizlik kaskasi',
    category: Category.HEADWEAR,
    gost: "O'z DSt EN 397:2011",
    image: shxvAsset('kaska.jpg'),
    gallery: [
      shxvAsset('kaska.jpg'),
      shxvAsset('kaska_1.jpg'),
      shxvAsset('kaska_2.jpg'),
      shxvAsset('kaska_3..jpg'),
    ],
    department: 'Markaziy dispetcherlik · Elektrlashtirish brigadalari',
    description:
      "Boshni mexanik zarbalar va past kuchlanishli elektr ta’siridan himoya qilish uchun dielektrik qo‘shimcha opsiya bilan ta’minlangan kaska.",
    materials: 'ABS + dielektrik polikarbonat · To‘rt nuqtali osma tizim',
    specs: [
      { label: 'Elektr izolyatsiyasi', value: '440 V AC gacha' },
      { label: 'Suvga chidamlilik', value: 'IPX3 darajasida' },
      { label: 'Ventilyatsiya', value: '12 ta aerodinamik kanal' },
    ],
    colors: ['Oq', 'Sariq', "To‘q sariq"],
    totalQuantity: 6420,
    unit: 'dona',
    documents: [
      {
        label: 'TЗ — kaska 2025',
        url: shxvAsset('ТЗ на подшлемник 2023.doc'),
      },
    ],
  },
  {
    id: 'panama-headgear',
    name: 'Signal panama bosh kiyimi',
    category: Category.HEADWEAR,
    gost: "O'z DSt 12.4.280:2015",
    image: shxvAsset('boshkiyim_panama.jpg'),
    gallery: [
      shxvAsset('boshkiyim_panama.jpg'),
      shxvAsset('boshkiyim_panama_1.jpg'),
    ],
    department: 'Yo‘l xo‘jaligi · Issiq hudud brigadalari',
    description:
      "Yozgi smenada quyoshdan himoya va yuqori ko‘rinuvchanlikni ta’minlovchi reflektorli panama bosh kiyimi.",
    materials: 'Lyuminessent polyester + paxta astar · UV 40+ filtri',
    specs: [
      { label: 'Reflektor lentalar', value: '2 × 50 mm' },
      { label: 'Ventilyatsiya', value: '4 ta kapron teshik' },
      { label: 'O‘lchamlar', value: '56–62' },
    ],
    colors: ['Neon sariq', 'Neon to‘q sariq'],
    totalQuantity: 5120,
    unit: 'dona',
    documents: [
      {
        label: 'TЗ — panama 2025',
        url: shxvAsset('ТЗ на панамы.pdf'),
      },
      {
        label: 'TЗ — panama 2025 DOC',
        url: shxvAsset('ТЗ на панамы 2025 год.doc'),
      },
    ],
  },
  {
    id: 'brezent-gloves',
    name: 'Brezent qo‘lqop (GOST 12.4.010-75)',
    category: Category.HANDS,
    gost: 'GOST 12.4.010-75',
    image: shxvAsset('brezent_qolqop.jpg'),
    gallery: [
      shxvAsset('brezent_qolqop.jpg'),
      shxvAsset('xb_qolqop.jpg'),
    ],
    department: 'Mexanik sexlar · Payvandlash uchastkalari',
    description:
      "Issiqlik va uchqunlarga yaqin hududlarda qo‘llaniladigan brezent qo‘lqoplar. 2025-yil SHXV ehtiyoj rejasida payvandchilar uchun majburiy sifatida ko‘rsatilgan.",
    materials: 'Brezent mato · Ichki paxta astar · 350 °C gacha qisqa muddatli himoya',
    specs: [
      { label: 'Issiqlik himoyasi', value: '350 °C gacha qisqa muddat' },
      { label: 'Tikuv materiali', value: 'Aramid ip (Kevlar)' },
      { label: 'Standart o‘lcham', value: '2-razmer (universal)' },
    ],
    colors: ['Tabiiy brezent', 'Grafit'],
    totalQuantity: 9850,
    unit: 'juft',
    documents: [
      {
        label: 'TЗ — brezent qo‘lqop 2025',
        url: shxvAsset('ТЗ рукавицы 2025 для НХ в Гиждуван.doc'),
      },
      {
        label: 'TЗ — brezent qo‘lqop (umumiy)',
        url: shxvAsset('ТЗ рукавицы 2024.doc'),
      },
    ],
  },
  {
    id: 'rain-coat',
    name: 'Yomg‘irga chidamli plash',
    category: Category.SEASONAL,
    gost: "O'z DSt 12.4.280:2015",
    image: shxvAsset('yomgir_plash.jpg'),
    gallery: [
      shxvAsset('yomgir_plash.jpg'),
      shxvAsset('maxsuskiyim_aloqa.jpg'),
    ],
    department: 'Stansiya navbatchilari · Ochiq maydon brigadalari',
    description:
      "Yomg‘ir va shamolga qarshi qo‘shimcha himoya vositasi. Harakat xavfsizligi bo‘yicha smena reglamentida ochiq maydon xodimlari uchun belgilangan.",
    materials: 'PVC qoplamali polyester · Germetik yopishtirilgan choklar · Reflektor panellar',
    specs: [
      { label: 'Suv o‘tkazmaslik', value: '5000 mm H₂O' },
      { label: 'Havoning o‘tkazuvchanligi', value: '3000 g/m²/24h' },
      { label: 'Standart to‘plam', value: 'Plash + sumka' },
    ],
    colors: ['To‘q ko‘k', 'Neon sariq'],
    totalQuantity: 6120,
    unit: 'dona',
    documents: [
      {
        label: 'TЗ — yomg‘ir plashi 2025',
        url: shxvAsset('ТЗ на плащ 2025 год.pdf'),
      },
      {
        label: 'TЗ — yomg‘ir plashi 2025 DOC',
        url: shxvAsset('ТЗ на плащ 2025 год.doc'),
      },
    ],
  },
];

export const PLANNING_DATA: PlanningRow[] = [
  { branch: 'Toshkent filiali', total: 5786, items: ['Mavsumiy kostyum', 'Signal jilet', 'Kirza etik'] },
  { branch: "Qo‘qon filiali", total: 3990, items: ['Qishki kurtka', 'Dielektrik qo‘lqop', 'Yomg‘ir plash'] },
  { branch: 'Buxoro filiali', total: 8500, items: ['Signal panama', 'Signal jilet', 'Brezent qo‘lqop'] },
  { branch: "Qo‘ng‘irot filiali", total: 4580, items: ['Montaj kamari', 'Elektr kaska', 'Mavsumiy kostyum'] },
  { branch: 'Qarshi filiali', total: 3390, items: ['Qishki kurtka', 'Kirza etik', 'Signal panama'] },
  { branch: 'Termiz filiali', total: 2473, items: ['Signal jilet', 'Montaj kamari', 'Brezent qo‘lqop'] },
];
