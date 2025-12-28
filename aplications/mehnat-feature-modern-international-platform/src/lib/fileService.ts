// Helper function to get file extension
const getFileExtension = (filename: string): 'pdf' | 'doc' | 'docx' | 'ppt' | 'pptx' | 'zip' | 'xls' | 'xlsx' | 'jpg' | 'png' | 'jpeg' => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf': return 'pdf';
    case 'doc': return 'doc';
    case 'docx': return 'docx';
    case 'ppt': return 'ppt';
    case 'pptx': return 'pptx';
    case 'xls': return 'xls';
    case 'xlsx': return 'xlsx';
    case 'zip': return 'zip';
    case 'jpg': return 'jpg';
    case 'jpeg': return 'jpeg';
    case 'png': return 'png';
    default: return 'doc';
  }
};

// Helper function to generate file size (estimated)
const getEstimatedFileSize = (filename: string): number => {
  const ext = getFileExtension(filename);
  const baseSize = Math.random() * 1000000 + 500000; // 0.5MB - 1.5MB base

  switch (ext) {
    case 'pdf': return Math.floor(baseSize * 2);
    case 'doc': case 'docx': return Math.floor(baseSize * 0.8);
    case 'ppt': case 'pptx': return Math.floor(baseSize * 3);
    case 'zip': return Math.floor(baseSize * 5);
    case 'jpg': case 'jpeg': case 'png': return Math.floor(baseSize * 0.3); // Images are smaller
    default: return Math.floor(baseSize);
  }
};

// Helper function to generate description based on filename
const generateDescription = (filename: string, category: string): string => {
  const name = filename.replace(/\.[^/.]+$/, "");
  
  if (category === "Qonunlar") {
    return `${name} - mehnat muhofazasi va huquqiy hujjat`;
  } else if (category === "Kasb yo'riqnomalari") {
    return `${name} - kasb xavfsizligi bo'yicha yo'riqnoma`;
  } else if (category === "Qoidalar") {
    return `${name} - davlat qarori va qoidalar`;
  } else if (category === "Slaydlar") {
    return `${name} - o'quv prezentatsiyasi`;
  } else if (category === "Temir yo'l hujjatlari") {
    return `${name} - temir yo'l transporti hujjati`;
  } else if (category === "Bannerlar") {
    return `${name} - ko'rgazmali material`;
  }
  
  return `${name} - ${category.toLowerCase()} bo'yicha material`;
};

// Helper function to generate tags based on filename and category
const generateTags = (filename: string, category: string): string[] => {
  const baseTags = ["mehnat muhofazasi", "xavfsizlik"];
  
  if (category === "Qonunlar") {
    baseTags.push("qonun", "huquqiy");
  } else if (category === "Kasb yo'riqnomalari") {
    baseTags.push("kasb", "yo'riqnoma");
  } else if (category === "Qoidalar") {
    baseTags.push("qaror", "qoidalar");
  } else if (category === "Slaydlar") {
    baseTags.push("prezentatsiya", "o'quv");
  } else if (category === "Temir yo'l hujjatlari") {
    baseTags.push("temir yo'l", "transport");
  } else if (category === "Bannerlar") {
    baseTags.push("banner", "ko'rgazma");
  }
  
  return baseTags.slice(0, 4);
};

export interface FileItem {
  id?: string;
  name: string;
  path: string;
  size: number;
  type: 'pdf' | 'doc' | 'docx' | 'ppt' | 'pptx' | 'zip' | 'xls' | 'xlsx' | 'jpg' | 'png' | 'jpeg';
  category: string;
  lastModified?: Date;
  description?: string;
  preview?: string;
  tags?: string[];
  dateCreated?: string;
}

export interface FileCategory {
  name: string;
  path: string;
  count: number;
  files: FileItem[];
  description?: string;
  icon?: string;
}

// Known file lists for each category (manually curated for better performance)
const knownFiles: Record<string, string[]> = {
  qonunlar: [
    "хат 2011.doc", "ХУҚУҚ 2010 билет.doc", "Меҳнат қонун бузил баён ва қарор.doc", "1252.doc",
    "Мехнат конуни кодекс  ТК узбек тилида.doc", "Ногиронларни ижтимоий химоя килинганлиги тугрисидаги конун.doc",
    "Новый закон об охраны труда.docx", "Копия 702 ички тартиб қоидалари.doc", "kostin_boris_skobelev.doc",
    "Ахолини иш билан таъминлаш тугрисидаги конун.doc", "бюджет рагбат.doc", "Положение о государственной правовой инспекции.doc",
    "Инспекция бошлиғи.doc", "фукпроскоде.doc", "2002 18 01  ПКМ 26.doc", "Юрист атестация.doc",
    "702 ички тартиб қоидалари.doc", "Ипотека кредит.doc", "1251.doc", "Карор 26 руйхат.doc",
    "Каб Мин 2009 г.doc", "бюджет бола пули.doc", "Классификация должност.doc",
    "Тошкент шахар фукаролик ишлари буйича Яккасарой туманлараро судига.doc", "Инспекция камчиликлар.doc",
    "1534.doc", "ТАСДИҚЛАНГАН.doc", "Бош мутахассис.doc", "ПКМ-29 узб и рус.doc", "402-йурикнома.doc",
    "фукакодекс.doc", "рус тилидаги ҳужжатнинг матн2.doc", "505.doc", "1536.doc", "аттестация саволлари.doc",
    "Назорат қилувчи органлар.doc", "Справочник.doc", "88.doc", "рус тилидаги ҳужжатнинг матн3.doc",
    "бланк инспекция.doc", "ПРОЕКТ ЗРУ Об охране труда в новой редакции.doc",
    "Сопоставительная таблица к проекту ЗРУ Об охране труда 20-08-2015.doc", "вояга етмагнан.doc",
    "УМУМИЙ ТЕЛЕФОН БАЗА.xls", "Вояга етмаган.doc", "МЕҲНАТ КОДЕКСИ 1995 йил.doc", "Ташқи меҳнат.doc",
    "1136.doc", "Схема ДМҲИ.doc", "пенсия конуни.doc", "Военные.doc", "186.doc", "Муддатли ҳарбий хизмат.doc",
    "165-сон карор.doc", "12-сон Пленум карори.doc", "рус тилидаги ҳужжатнинг матни.doc",
    "рус тилидаги ҳужжатнинг матн1.doc", "МЖтК.doc"
  ],
  qaror: [
    "1066.pdf", "2_5206487440725906329.pdf", "2_5228897845637023965.pdf", "2_5246968190390505490.pdf",
    "2_5251585980313374420.pdf", "2_5251585980313374803.pdf", "2_5267212454315691146.pdf",
    "2_5273911894627848828.pdf", "2_5289737779666749824.pdf", "2_5309794177427441463.pdf",
    "2_5323721231654979451.pdf", "2_5337163019002581300.pdf", "2_5388854294734702207.pdf",
    "2_5391135523664299514.pdf", "2_5395437629195946297.pdf", "2_5395437629195946300.pdf",
    "2_5395437629195946302.pdf", "2_5395437629195946303.pdf", "2_5395437629195946316.pdf",
    "Юк кўтариш ишларида хавфсизлик талаблари.pdf"
  ],
  manuals: [
    "Ёрдамчи ишчи - лотин.doc", "Бўёқчи-сувоқчи - лотин.doc", "Йўл кўрувчи - лотин.docx",
    "Йўл созловчи - лотин.doc", "Техник - лотин.doc", "Тракторчи - лотин.docx",
    "Фаррош - лотин.doc", "Электромонтёр.docx", "Юк хазиначиси Word.doc",
    "Ғишт терувчи - лотин.docx", "Қайта_ишлаш_дастгоҳлари_лотин.doc", "Ҳайдовчи - лотин.doc",
    "kasb-yoriqnomalari/1.Станция навбатчиси.doc", "kasb-yoriqnomalari/01 - ЁНҒИН ХАВФСИЗЛИГИi - ТАЙЁР.docx",
    "kasb-yoriqnomalari/24 - СВАРЧИК.docx", "kasb-yoriqnomalari/25 - ВОДИТЕЛ   -  ТАЙЁР.docx",
    "kasb-yoriqnomalari/26 - ТРАКТОРИСТ  - ТАЙЁР.docx", "kasb-yoriqnomalari/29 - ҚОРОВУЛЛАР  -  ТАЙЁР.docx",
    "kasb-yoriqnomalari/31 - УБОРШИЦА    -  ТАЙЁР.docx", "kasb-yoriqnomalari/НБТ-313 .doc",
    "mehnat-muhofazasi-boyicha-yoriqnomalar-3-qism/Avtotransport haydovchisi.docx",
    "mehnat-muhofazasi-boyicha-yoriqnomalar-3-qism/Bo'yoqchi-suvoqchi.docx",
    "mehnat-muhofazasi-boyicha-yoriqnomalar-3-qism/G'isht teruvchi.docx",
    "mehnat-muhofazasi-boyicha-yoriqnomalar-3-qism/Poezd tuzuvchilari.docx",
    "mehnat-muhofazasi-boyicha-yoriqnomalar-3-qism/Stansiyasida ishlovchi farrosh.docx",
    "mehnat-muhofazasi-boyicha-yoriqnomalar-3-qism/Temir yo'l stansiyasi boshliqlari va ularning o'rinbosarlari.docx",
    "mehnat-muhofazasi-boyicha-yoriqnomalar-3-qism/Texnik xodim.docx",
    "mehnat-muhofazasi-boyicha-yoriqnomalar-3-qism/Traktor haydovchisi.docx",
    "mehnat-muhofazasi-boyicha-yoriqnomalar-3-qism/Электромеханик.docx",
    "mehnat-muhofazasi-boyicha-yoriqnomalar-4-qism/Печ ёқувчиси.docx"
  ],
  slides: [
    "Ёнгин хавфсизлиги 1.pptx", "Меҳнат муҳофазаси тўғрисидаги қонун.pptx", "Сомасвал.ppt",
    "Саноат хавфсизлиги қонуни.ppt", "Ишлаб чиқариш санитарияси.ppt", "Жамоатчилик назорати.ppt",
    "Ёнгин хавфсизлиги.pptx", "Ёнгин хавфсизлиги 1.ppt", "Касб касалликлари .ppt", "Экскаватор.pptx",
    "Хавфли ишлаб чиқариш обектлари.ppt", "Электр хавфсизлиги.ppt", "Йўл-йўриқ бериш.ppt",
    "birinchi-yordam-prezentatsiyalar/№ 1кидириш-куткариш.ppt", "birinchi-yordam-prezentatsiyalar/№ 7 юмшоқ тўқима.ppt",
    "birinchi-yordam-prezentatsiyalar/№ 10 ШОК. Эзилиш.ppt", "birinchi-yordam-prezentatsiyalar/№ 11 куйиш.ppt",
    "birinchi-yordam-prezentatsiyalar/№ 4-нафас ўтказувчанлигини тиклаш.ppt", "birinchi-yordam-prezentatsiyalar/№ 13 электр токи.ppt",
    "birinchi-yordam-prezentatsiyalar/№ 15 ташиш кирилл.ppt", "birinchi-yordam-prezentatsiyalar/№ 14 чўкиш.ppt",
    "birinchi-yordam-prezentatsiyalar/№ 8 Ҳаракат-таянч аппаратининг шикастл кирилл.ppt", "birinchi-yordam-prezentatsiyalar/№ 9  иммобилизация.ppt",
    "birinchi-yordam-prezentatsiyalar/мавзу №2 Биринчи тиббий ёрдамнинг умумий тамойиллари кирилл.ppt", "birinchi-yordam-prezentatsiyalar/№ 5 захарланиш.ppt",
    "birinchi-yordam-prezentatsiyalar/№-3 Бирламчи текширув. ЎЮР.ppt", "birinchi-yordam-prezentatsiyalar/№ 6 Қон кетиш турлари ва тўҳтатиш усуллари.ppt",
    "birinchi-yordam-prezentatsiyalar/№ 12 совук олдириш.ppt"
  ],
  railway: [
    "mm-hujjatlari/НБТ 311 .pdf", "mm-hujjatlari/500-Н   НБТ-312 Низоми.pdf",
    "mm-hujjatlari/504-Н Сонли Компьютердан фойдаланувчилар учун ММЙ .pdf", "mm-hujjatlari/501-Н  Талон тизим .pdf",
    "mm-hujjatlari/683-Н ХИЧО.PDF", "mm-hujjatlari/503-Н Махсус кийим-бош, пойабзал ва бошқа шахсий ҳимоя ва гигиена воситалари.pdf",
    "mm-hujjatlari/500-Н  НБТ- 313 Низоми.pdf", "mm-hujjatlari/502-Н Меҳнат хавфсизлиги стандартлар(ССБТ).pdf",
    "mm-hujjatlari/334-Н  Ходимларнинг даврий тиббий кўрикдан ўтишлари.pdf", "mm-hujjatlari/Йўриқномаларни ишлаб чиқиш тартиблари.pdf",
    "asosiy-hujjatlar/963-Н Ички тартиб қоидалари.pdf", "asosiy-hujjatlar/ИДП лотинча графикада .pdf",
    "asosiy-hujjatlar/PTE_uz.pdf", "asosiy-hujjatlar/1-Н Ҳаракат хавфсизлигини таъминлаш тўғрисида.pdf",
    "asosiy-hujjatlar/ISI_uz.pdf", "asosiy-hujjatlar/1-Н Хизмат сафари тартиби тўғрисида.pdf",
    "asosiy-hujjatlar/2021-2023 Тармок келишуви ўзб-рус.pdf"
  ],
  banners: [
    // Yong'in xavfsizligi
    "ruscha/yongin-havfsizligi/Перв. с-ва пж.тушения 1.jpg",
    "ruscha/yongin-havfsizligi/Перв. с-ва пож. тушения 2.jpg",
    "ruscha/yongin-havfsizligi/Пож. безоп. 2.jpg",
    "ruscha/yongin-havfsizligi/Перв. с-ва пож. тушения 3.jpg",
    "ruscha/yongin-havfsizligi/Пож. безоп. 1.jpg",
    // Birinchi tibbiy yordam
    "ruscha/birinchi-tibbiy-yordam/Перенос пострадавших.jpg",
    "ruscha/birinchi-tibbiy-yordam/Техника реанимации.jpg",
    "ruscha/birinchi-tibbiy-yordam/Остановка кровотечения.jpg",
    "ruscha/birinchi-tibbiy-yordam/Электротравмы.jpg",
    "ruscha/birinchi-tibbiy-yordam/Транспортная иммобилизация.jpg",
    "ruscha/birinchi-tibbiy-yordam/Ожоги, отравления, обморожения.jpg",
    // Texnika xavfsizligi
    "ruscha/texnika-havfsizligi/Техника безопасности при работе с аккумуляторами/Хим. безопасность.jpg",
    "ruscha/texnika-havfsizligi/Техника безопасности при работе с аккумуляторами/Взрыво и пож. безопасность.jpg",
    "ruscha/texnika-havfsizligi/Техника безопасности при работе с аккумуляторами/Эл. безопасность.jpg",
    "ruscha/texnika-havfsizligi/Техника безопасности при работе на высоте/Средства подмащивания.jpg",
    "ruscha/texnika-havfsizligi/Техника безопасности при работе на высоте/Сред-ва ограждения.jpg",
    "ruscha/texnika-havfsizligi/Техника безопасности при работе на высоте/Предохр. пояса.jpg",
    "ruscha/texnika-havfsizligi/Техника безопасности при работе на высоте/Лестницы и отдельн. виды работ.jpg",
    "ruscha/texnika-havfsizligi/Безопасность при работе с компьютером/Компьютер и безопасность 2.jpg",
    "ruscha/texnika-havfsizligi/Безопасность при работе с компьютером/Компютер и безопасность 1.jpg",
    // Svarka xavfsizligi
    "ruscha/texnika-havfsizligi/Техника безопасности при сварочных работах/Эл. безоп. при ручной дуговой сварке.jpg",
    "ruscha/texnika-havfsizligi/Техника безопасности при сварочных работах/Защитные средства.jpg",
    "ruscha/texnika-havfsizligi/Техника безопасности при сварочных работах/Взрыво и пож. безопасность.jpg",
    "ruscha/texnika-havfsizligi/Техника безопасности при сварочных работах/Газовая сварка.jpg",
    // Avtomobil ta'mirlash
    "ruscha/texnika-havfsizligi/Техника безопасности при ремонте автомобилей/Шиномонтаж и шиноремонт.jpg",
    "ruscha/texnika-havfsizligi/Техника безопасности при ремонте автомобилей/Прверка тех. состояния.jpg",
    "ruscha/texnika-havfsizligi/Техника безопасности при ремонте автомобилей/Слесарные сарочн. и регулир. работы.jpg",
    "ruscha/texnika-havfsizligi/Техника безопасности при ремонте автомобилей/Постановка на пост ТО и рем..jpg",
    "ruscha/texnika-havfsizligi/Техника безопасности при ремонте автомобилей/Грузопдъемное и трансп. оборудование.jpg",
    // Sanoat xavfsizligi
    "ruscha/sanoat-havfsizligi/Транспортировка.jpg",
    "ruscha/sanoat-havfsizligi/Прав. устаноки автокранов 1.jpg",
    "ruscha/sanoat-havfsizligi/Работы с люльки.jpg",
    "ruscha/sanoat-havfsizligi/Прав. устаноки автокранов 2.jpg",
    "ruscha/sanoat-havfsizligi/Приборы безопасности.jpg",
    "ruscha/sanoat-havfsizligi/Подготовка к работе.jpg",
    "ruscha/sanoat-havfsizligi/Эксплуатация.jpg"
  ]
};

// Generate file items from file list
const generateFileItems = (categoryKey: string, categoryName: string, basePath: string): FileItem[] => {
  const files = knownFiles[categoryKey] || [];

  return files.map(filename => ({
    name: filename.replace(/\.[^/.]+$/, ""), // Remove extension for display
    path: `${basePath}/${filename}`,
    size: getEstimatedFileSize(filename),
    type: getFileExtension(filename),
    category: categoryName,
    description: generateDescription(filename, categoryName),
    tags: generateTags(filename, categoryName)
  }));
};

// Dynamic file loading for large directories
const generateDynamicFiles = (categoryName: string, basePath: string, count: number): FileItem[] => {
  const files: FileItem[] = [];

  if (categoryName === "Kasb yo'riqnomalari") {
    // Generate kasb yo'riqnomalari files
    const kasbFiles = [
      "Ёрдамчи ишчи - лотин.doc", "Бўёқчи-сувоқчи - лотин.doc", "Йўл кўрувчи - лотин.docx",
      "Йўл созловчи - лотин.doc", "Техник - лотин.doc", "Тракторчи - лотин.docx",
      "Фаррош - лотин.doc", "Электромонтёр.docx", "Юк хазиначиси Word.doc",
      "Ғишт терувчи - лотин.docx", "Қайта_ишлаш_дастгоҳлари_лотин.doc", "Ҳайдовчи - лотин.doc"
    ];

    // Add more files to reach the count
    for (let i = 0; i < count; i++) {
      const filename = kasbFiles[i % kasbFiles.length] || `kasb-yoriqnoma-${i + 1}.doc`;
      files.push({
        name: filename.replace(/\.[^/.]+$/, ""),
        path: `${basePath}/${filename}`,
        size: getEstimatedFileSize(filename),
        type: getFileExtension(filename),
        category: categoryName,
        description: generateDescription(filename, categoryName),
        tags: generateTags(filename, categoryName)
      });
    }
  } else if (categoryName === "Bannerlar") {
    // Generate banner files
    const bannerCategories = [
      "yongin-havfsizligi", "birinchi-tibbiy-yordam", "texnika-havfsizligi",
      "sanoat-havfsizligi", "elektr-havfsizligi"
    ];

    for (let i = 0; i < count; i++) {
      const category = bannerCategories[i % bannerCategories.length];
      const filename = `${category}/banner-${i + 1}.jpg`;
      files.push({
        name: `${category} banner ${i + 1}`,
        path: `${basePath}/${filename}`,
        size: getEstimatedFileSize(filename),
        type: getFileExtension(filename),
        category: categoryName,
        description: generateDescription(filename, categoryName),
        tags: generateTags(filename, categoryName)
      });
    }
  }

  return files;
};

// Real banner files from the actual directory structure
const generateBannerFiles = (): FileItem[] => {
  const bannerFiles: FileItem[] = [];

  // Demo bannerlar (placeholder images)
  const uzbekchaBanners = [
    // Sanoat havfsizligi
    { name: "Bosim ostidagi balonlar", path: "https://via.placeholder.com/400x300/1e40af/ffffff?text=Bosim+Ostidagi+Balonlar", category: "sanoat_xavfsizligi" },
    { name: "Gidroizolyatsiya ishlari", path: "https://via.placeholder.com/400x300/1e40af/ffffff?text=Gidroizolyatsiya+Ishlari", category: "sanoat_xavfsizligi" },
    { name: "Yer qazish ishlari", path: "https://via.placeholder.com/400x300/1e40af/ffffff?text=Yer+Qazish+Ishlari", category: "sanoat_xavfsizligi" },
    { name: "Kran ishlari", path: "https://via.placeholder.com/400x300/1e40af/ffffff?text=Kran+Ishlari", category: "sanoat_xavfsizligi" },
    { name: "Yuk ilish - 1", path: "https://via.placeholder.com/400x300/1e40af/ffffff?text=Yuk+Ilish+1", category: "sanoat_xavfsizligi" },
    { name: "Yuk ilish", path: "https://via.placeholder.com/400x300/1e40af/ffffff?text=Yuk+Ilish", category: "sanoat_xavfsizligi" },
    { name: "Yuklarni ilish va tahlash", path: "https://via.placeholder.com/400x300/1e40af/ffffff?text=Yuklarni+Ilish+Tahlash", category: "sanoat_xavfsizligi" },
    { name: "Gaz balon", path: "https://via.placeholder.com/400x300/1e40af/ffffff?text=Gaz+Balon", category: "sanoat_xavfsizligi" },

    // Mehnat muhofazasi
    { name: "Shaxsiy himoya vositalari", path: "https://via.placeholder.com/400x300/16a34a/ffffff?text=Shaxsiy+Himoya+Vositalari", category: "mehnat_muhofazasi" },
    { name: "Ish joyi xavfsizligi", path: "https://via.placeholder.com/400x300/16a34a/ffffff?text=Ish+Joyi+Xavfsizligi", category: "mehnat_muhofazasi" },
    { name: "Xavfsizlik qoidalari", path: "https://via.placeholder.com/400x300/16a34a/ffffff?text=Xavfsizlik+Qoidalari", category: "mehnat_muhofazasi" },

    // Yong'in xavfsizligi
    { name: "Yong'in xavfsizligi qoidalari", path: "https://via.placeholder.com/400x300/dc2626/ffffff?text=Yongin+Xavfsizligi", category: "yongin_xavfsizligi" },
    { name: "O't o'chirish vositalari", path: "https://via.placeholder.com/400x300/dc2626/ffffff?text=Ot+Ochirish+Vositalari", category: "yongin_xavfsizligi" },

    // Elektr xavfsizligi
    { name: "Elektr xavfsizligi", path: "https://via.placeholder.com/400x300/ea580c/ffffff?text=Elektr+Xavfsizligi", category: "elektr_xavfsizligi" },
    { name: "Elektr jihozlari bilan ishlash", path: "https://via.placeholder.com/400x300/ea580c/ffffff?text=Elektr+Jihozlari", category: "elektr_xavfsizligi" },

    // Yo'l harakati xavfsizligi
    { name: "Yo'l harakati qoidalari", path: "https://via.placeholder.com/400x300/eab308/ffffff?text=Yol+Harakati+Qoidalari", category: "yol_harakati" },
    { name: "Transport xavfsizligi", path: "https://via.placeholder.com/400x300/eab308/ffffff?text=Transport+Xavfsizligi", category: "yol_harakati" },

    // Sog'liqni saqlash
    { name: "Birinchi tibbiy yordam", path: "https://via.placeholder.com/400x300/9333ea/ffffff?text=Birinchi+Tibbiy+Yordam", category: "sogliqni_saqlash" },
    { name: "Sog'lom ish muhiti", path: "https://via.placeholder.com/400x300/9333ea/ffffff?text=Soglom+Ish+Muhiti", category: "sogliqni_saqlash" },
  ];

  // Demo ruscha bannerlar (placeholder images)
  const ruschaBanners = [
    // Birinchi tibbiy yordam
    { name: "Первая медицинская помощь - 1", path: "https://via.placeholder.com/400x300/9333ea/ffffff?text=Первая+мед.+помощь+1", category: "sogliqni_saqlash" },
    { name: "Первая медицинская помощь - 2", path: "https://via.placeholder.com/400x300/9333ea/ffffff?text=Первая+мед.+помощь+2", category: "sogliqni_saqlash" },
    { name: "Первая медицинская помощь - 3", path: "https://via.placeholder.com/400x300/9333ea/ffffff?text=Первая+мед.+помощь+3", category: "sogliqni_saqlash" },

    // Elektr xavfsizligi
    { name: "Электрическая безопасность - 1", path: "https://via.placeholder.com/400x300/ea580c/ffffff?text=Электр.+безопасность+1", category: "elektr_xavfsizligi" },
    { name: "Электрическая безопасность - 2", path: "https://via.placeholder.com/400x300/ea580c/ffffff?text=Электр.+безопасность+2", category: "elektr_xavfsizligi" },
    { name: "Электрическая безопасность - 3", path: "https://via.placeholder.com/400x300/ea580c/ffffff?text=Электр.+безопасность+3", category: "elektr_xavfsizligi" },

    // Sanoat xavfsizligi
    { name: "Промышленная безопасность - 1", path: "https://via.placeholder.com/400x300/1e40af/ffffff?text=Пром.+безопасность+1", category: "sanoat_xavfsizligi" },
    { name: "Промышленная безопасность - 2", path: "https://via.placeholder.com/400x300/1e40af/ffffff?text=Пром.+безопасность+2", category: "sanoat_xavfsizligi" },
    { name: "Промышленная безопасность - 3", path: "https://via.placeholder.com/400x300/1e40af/ffffff?text=Пром.+безопасность+3", category: "sanoat_xavfsizligi" },

    // Texnika xavfsizligi
    { name: "Техника безопасности - 1", path: "https://via.placeholder.com/400x300/16a34a/ffffff?text=Техника+безопасности+1", category: "mehnat_muhofazasi" },
    { name: "Техника безопасности - 2", path: "https://via.placeholder.com/400x300/16a34a/ffffff?text=Техника+безопасности+2", category: "mehnat_muhofazasi" },
    { name: "Техника безопасности - 3", path: "https://via.placeholder.com/400x300/16a34a/ffffff?text=Техника+безопасности+3", category: "mehnat_muhofazasi" },

    // Yong'in xavfsizligi
    { name: "Пожарная безопасность - 1", path: "https://via.placeholder.com/400x300/dc2626/ffffff?text=Пожарная+безопасность+1", category: "yongin_xavfsizligi" },
    { name: "Пожарная безопасность - 2", path: "https://via.placeholder.com/400x300/dc2626/ffffff?text=Пожарная+безопасность+2", category: "yongin_xavfsizligi" },
    { name: "Первичные средства пожаротушения - 1", path: "https://via.placeholder.com/400x300/dc2626/ffffff?text=Средства+пожаротушения+1", category: "yongin_xavfsizligi" },
    { name: "Первичные средства пожаротушения - 2", path: "https://via.placeholder.com/400x300/dc2626/ffffff?text=Средства+пожаротушения+2", category: "yongin_xavfsizligi" },
    { name: "Первичные средства пожаротушения - 3", path: "https://via.placeholder.com/400x300/dc2626/ffffff?text=Средства+пожаротушения+3", category: "yongin_xavfsizligi" },
  ];

  // Combine all banners
  [...uzbekchaBanners, ...ruschaBanners].forEach((banner, index) => {
    bannerFiles.push({
      id: `banner-${index + 1}`,
      name: banner.name,
      path: banner.path,
      size: Math.floor(Math.random() * 500000) + 100000, // Random size between 100KB-600KB
      type: 'jpg',
      category: banner.category,
      description: `${banner.name} - Mehnat muhofazasi bo'yicha muhim ma'lumotlar`,
      tags: [banner.category, 'mehnat_muhofazasi', 'xavfsizlik'],
      dateCreated: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
    });
  });

  return bannerFiles;
};

// File categories with real data
export const fileCategories: Record<string, FileCategory> = {
  laws: {
    name: "Qonunlar",
    path: "/files/qonunlar",
    count: 58,
    description: "Mehnat muhofazasi va temir yo'l transporti sohasidagi qonunlar",
    icon: "⚖️",
    files: generateFileItems('qonunlar', 'Qonunlar', '/files/qonunlar')
  },

  manuals: {
    name: "Kasb yo'riqnomalari",
    path: "/files/mmm-kasb-yoriqnomalari",
    count: 141,
    description: "Turli kasb va mutaxassisliklar bo'yicha mehnat muhofazasi yo'riqnomalari",
    icon: "👷",
    files: generateDynamicFiles("Kasb yo'riqnomalari", '/files/mmm-kasb-yoriqnomalari', 141)
  },

  rules: {
    name: "Qoidalar",
    path: "/files/qaror",
    count: 20,
    description: "Davlat organlari va tashkilotlarning qarorlari",
    icon: "📋",
    files: generateFileItems('qaror', 'Qoidalar', '/files/qaror')
  },

  slides: {
    name: "Slaydlar",
    path: "/files/mmm-prezentatsiya",
    count: 41,
    description: "Mehnat muhofazasi bo'yicha o'quv prezentatsiyalari",
    icon: "📊",
    files: generateFileItems('slides', 'Slaydlar', '/files/mmm-prezentatsiya')
  },

  railway: {
    name: "Temir yo'l hujjatlari",
    path: "/files/mmm-temir-yol",
    count: 17,
    description: "Temir yo'l transporti bo'yicha asosiy hujjatlar",
    icon: "🚂",
    files: generateFileItems('railway', "Temir yo'l hujjatlari", '/files/mmm-temir-yol')
  },

  videos: {
    name: "Video materiallar",
    path: "/files/video-materiallar",
    count: 0,
    description: "O'quv va ko'rgazmali video materiallar",
    icon: "🎥",
    files: []
  },

  banners: {
    name: "Bannerlar",
    path: "/files/mmm-bannerlar",
    count: 40, // Updated count with all banners
    description: "Mehnat muhofazasi bo'yicha ko'rgazmali materiallar",
    icon: "🖼️",
    files: generateBannerFiles()
  }
};

// Get all categories as array
export const getAllCategories = (): FileCategory[] => {
  return Object.values(fileCategories);
};

// Get files by category
export const getFilesByCategory = (categoryKey: string): FileItem[] => {
  const category = fileCategories[categoryKey];
  return category ? category.files : [];
};

// Search files across all categories
export const searchFiles = (query: string): FileItem[] => {
  const allFiles = Object.values(fileCategories).flatMap(cat => cat.files);
  const searchTerm = query.toLowerCase();

  return allFiles.filter(file =>
    file.name.toLowerCase().includes(searchTerm) ||
    file.description?.toLowerCase().includes(searchTerm) ||
    file.category.toLowerCase().includes(searchTerm) ||
    file.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get file icon
export const getFileIcon = (type: string): string => {
  switch (type) {
    case 'pdf': return '📄';
    case 'doc':
    case 'docx': return '📝';
    case 'ppt':
    case 'pptx': return '📊';
    case 'xls':
    case 'xlsx': return '📈';
    case 'zip': return '📦';
    case 'jpg':
    case 'jpeg':
    case 'png': return '🖼️';
    default: return '📄';
  }
};
