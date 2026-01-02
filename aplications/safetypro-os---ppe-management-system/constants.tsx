
import { PPEItem, Category } from './types';

export const PPE_DATA: PPEItem[] = [
  // MAVSUMIY MAXSUS KIYIM
  {
    id: '1',
    name: 'Brezent Kostyum',
    category: Category.SEASONAL,
    gost: 'GOST 12.4.250-2013',
    image: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?auto=format&fit=crop&q=80&w=800',
    description: 'Issiqlik nurlanishi, uchqunlar va erigan metall chayqalishlaridan himoya qiluvchi kostyum.',
    materials: 'Zichligi 500-600 g/m2 bo\'lgan brezent mato, olovga chidamli ishlov (OP).',
    specs: [
      { label: 'Himoya klassi', value: '2-klass' },
      { label: 'Mato tarkibi', value: '100% Zig\'ir/Paxta' }
    ],
    colors: ['Xaki'],
    totalQuantity: 902
  },
  {
    id: '5',
    name: 'Kostyum Mavsumiy (OTY)',
    category: Category.SEASONAL,
    gost: 'O\'z DSt 12.4.280:2015',
    image: 'https://images.unsplash.com/photo-1589131628522-3837936a2829?auto=format&fit=crop&q=80&w=800',
    description: 'Ishchi-xodimlar uchun umumiy ishlab chiqarish ifloslanishidan himoya qiluvchi asosiy kiyim.',
    materials: 'Smesovaya mato (greta), 240 g/m2.',
    specs: [
      { label: 'Tarkibi', value: '65% PE, 35% Paxta' },
      { label: 'Ishlov', value: 'Moy-suvga chidamli (MVO)' }
    ],
    colors: ['To\'q ko\'k'],
    totalQuantity: 40151
  },
  {
    id: '13',
    name: 'Signal Jileti (Nimcha)',
    category: Category.SEASONAL,
    gost: 'O\'z DSt 12.4.281:2015',
    image: 'https://images.unsplash.com/photo-1610473068533-312957448d80?auto=format&fit=crop&q=80&w=800',
    description: 'Temir yo\'llarda yuqori ko\'rinishni ta\'minlovchi 2-klass signal jileti.',
    materials: '100% Polyester, lyuminessent mato.',
    specs: [
      { label: 'SOP kengligi', value: '50 mm' },
      { label: 'Ko\'rinish darajasi', value: '2-klass' }
    ],
    colors: ['Limon-sariq', 'To\'q sariq'],
    totalQuantity: 45036
  },
  // MAXSUS POYABZAL
  {
    id: '19',
    name: 'Botinkalar (Charmdan)',
    category: Category.FOOTWEAR,
    gost: 'GOST 28507-99',
    image: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&q=80&w=800',
    description: 'Mexanik ta\'sirlar va umumiy ifloslanishlardan himoya qiluvchi ishchi botinkalar.',
    materials: 'Yuft (natural charm), PU/TPU taban.',
    specs: [
      { label: 'Taban', value: 'MBS, KShS' },
      { label: 'Ulanish usuli', value: 'Lityevoy' }
    ],
    colors: ['Qora'],
    totalQuantity: 34702
  },
  {
    id: '23',
    name: 'Rezina Etik',
    category: Category.FOOTWEAR,
    gost: 'GOST 12.4.072-79',
    image: 'https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?auto=format&fit=crop&q=80&w=800',
    description: 'Suv va kislota-ishqorli muhitda ishlash uchun rezina etiklar.',
    materials: 'Rezina, tekstil astar.',
    specs: [
      { label: 'Balandligi', value: '35 sm' },
      { label: 'Himoya', value: 'V, K20, Sh20' }
    ],
    colors: ['Qora'],
    totalQuantity: 1598
  },
  // BOSH KIYIM
  {
    id: '30',
    name: 'Himoya Kaskasi',
    category: Category.HEADWEAR,
    gost: 'O\'z DSt EN 397:2011',
    image: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?auto=format&fit=crop&q=80&w=800',
    description: 'Boshni mexanik zarbalardan va elektr tokidan himoya qiluvchi kaska.',
    materials: 'Yuqori zarbaga chidamli ABS plastik.',
    specs: [
      { label: 'Rang', value: 'Oq (muhandis), sariq (ishchi)' },
      { label: 'Elektr izolyatsiya', value: '440V gacha' }
    ],
    colors: ['Oq', 'Sariq', 'To\'q sariq'],
    totalQuantity: 5235
  },
  // ELEKTR TOKIDAN HIMOYALOVCHI
  {
    id: '47',
    name: 'Dielektrik Botilar',
    category: Category.ELECTRICAL,
    gost: 'GOST 13385-67',
    image: 'https://images.unsplash.com/photo-1621600411688-4be93cd68504?auto=format&fit=crop&q=80&w=800',
    description: 'Yopiq va ochiq elektr qurilmalarida ishlash uchun qo\'shimcha himoya vositasi.',
    materials: 'Maxsus dielektrik rezina.',
    specs: [
      { label: 'Sinov kuchlanishi', value: '15 kV' },
      { label: 'Ishlash muddati', value: '6 oyda bir sinov' }
    ],
    colors: ['Bej', 'Kulrang'],
    totalQuantity: 334
  },
  {
    id: '50',
    name: 'Dielektrik Qo\'lqop',
    category: Category.ELECTRICAL,
    gost: 'GOST 12.4.183-91',
    image: 'https://images.unsplash.com/photo-1584305116359-243596433095?auto=format&fit=crop&q=80&w=800',
    description: '1000V gacha bo\'lgan kuchlanishda asosiy himoya vositasi.',
    materials: 'Lateks yoki dielektrik rezina.',
    specs: [
      { label: 'Klass', value: '0-klass' },
      { label: 'Sinov', value: 'Har 6 oyda' }
    ],
    colors: ['Oq-shaffof'],
    totalQuantity: 1832
  },
  // QO'LLARNI HIMOYALOVCHI
  {
    id: '62',
    name: 'Brezent Qo\'lqop',
    category: Category.HANDS,
    gost: 'GOST 12.4.010-75',
    image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=800',
    description: 'Qo\'pol mexanik ishlar va issiq yuza bilan ishlash uchun.',
    materials: 'Brezent (OP), ikki qavatli kaft qismi.',
    specs: [
      { label: 'Zichlik', value: '480 g/m2' },
      { label: 'Himoya', value: 'Mi, Mp' }
    ],
    colors: ['Xaki'],
    totalQuantity: 28374
  }
];

export const PLANNING_DATA = [
  { branch: "Toshkent filiali", total: 5786, items: ["Mavsumiy kiyim", "Signal jilet", "Botinkalar"] },
  { branch: "Qo'qon filiali", total: 3990, items: ["Mavsumiy kiyim", "Brezent qo'lqop", "Kaska"] },
  { branch: "Buxoro filiali", total: 8500, items: ["Signal jilet", "Dielektrik qo'lqop", "Mavsumiy kiyim"] },
  { branch: "Qo'ng'irot filiali", total: 4580, items: ["Qishki kiyim", "Botinkalar", "Kaska"] },
  { branch: "Qarshi filiali", total: 3390, items: ["Mavsumiy kiyim", "Signal jilet", "Gigiena"] },
  { branch: "Termiz filiali", total: 2473, items: ["Mavsumiy kiyim", "Brezent qo'lqop", "Botinkalar"] },
];
