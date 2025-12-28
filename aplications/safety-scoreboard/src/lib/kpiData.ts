export interface KPIIndicator {
  id: number;
  name: string;
  nameUz: string;
  weight: number;
  description: string;
  icon: string;
  category: 'critical' | 'important' | 'standard';
}

export const KPI_INDICATORS: KPIIndicator[] = [
  { id: 1, name: "accidents", nameUz: "Baxtsiz hodisalar", weight: 40, description: "⭐ Eng muhim ko'rsatkich", icon: "🚨", category: 'critical' },
  { id: 2, name: "hseStaffing", nameUz: "MM xizmati shtat", weight: 10, description: "Shtat to'ldirilganligi", icon: "👥", category: 'critical' },
  { id: 3, name: "safeDays", nameUz: "Hodisasiz kunlar", weight: 6, description: "Yil davomida", icon: "📅", category: 'important' },
  { id: 4, name: "training", nameUz: "O'qitish", weight: 5, description: "Xodimlar o'qitilishi", icon: "📚", category: 'important' },
  { id: 5, name: "riskAssessment", nameUz: "Xavf baholash", weight: 5, description: "Risk assessment", icon: "⚠️", category: 'important' },
  { id: 6, name: "ppe", nameUz: "SHHV", weight: 5, description: "Shaxsiy himoya vositalari", icon: "🦺", category: 'important' },
  { id: 7, name: "equipment", nameUz: "Uskuna", weight: 5, description: "Texnika nazorati", icon: "🔧", category: 'important' },
  { id: 8, name: "prevention", nameUz: "Profilaktika", weight: 4, description: "Moliyaviy xarajatlar", icon: "💰", category: 'standard' },
  { id: 9, name: "reports", nameUz: "Xabarlar", weight: 4, description: "Xodimlar xabarlari", icon: "📝", category: 'standard' },
  { id: 10, name: "reaction", nameUz: "Reaksiya", weight: 4, description: "Murojaat hal qilish", icon: "⚡", category: 'standard' },
  { id: 11, name: "supervision", nameUz: "Nazorat", weight: 3, description: "Reja ijrosi", icon: "👁️", category: 'standard' },
  { id: 12, name: "occupationalDisease", nameUz: "Kasbiy kasallik", weight: 3, description: "Kasalliklar soni", icon: "🏥", category: 'standard' },
  { id: 13, name: "audit", nameUz: "Audit", weight: 2, description: "Audit samaradorligi", icon: "📋", category: 'standard' },
  { id: 14, name: "emergency", nameUz: "Avariya", weight: 2, description: "Tayyorgarlik mashqlari", icon: "🚒", category: 'standard' },
  { id: 15, name: "discipline", nameUz: "Intizom", weight: 2, description: "Buzilishlar", icon: "📏", category: 'standard' },
];

export interface Company {
  id: string;
  xId?: string;
  name: string;
  shortName?: string;
  type?: string;
  parentId?: string;
  region: string;
  employeeCount: number;
  kpiScores: Record<string, number>;
  totalScore: number;
  zone: "green" | "yellow" | "red";
  rank: number;
  lastUpdated: string;
}

export const calculateTotalScore = (scores: Record<string, number>): number => {
  return KPI_INDICATORS.reduce((total, indicator) => {
    const score = scores[indicator.name] || 0;
    return total + (score * indicator.weight) / 100;
  }, 0);
};

export const getZone = (score: number): "green" | "yellow" | "red" => {
  if (score >= 80) return "green";
  if (score >= 50) return "yellow";
  return "red";
};

// Generate random KPI scores for demo
const generateKpiScores = (baseScore: number): Record<string, number> => {
  const scores: Record<string, number> = {};
  KPI_INDICATORS.forEach(ind => {
    const variance = Math.random() * 20 - 10;
    scores[ind.name] = Math.max(0, Math.min(100, baseScore + variance));
  });
  return scores;
};

// Mock railway companies from O'zbekiston temir yo'llari structure
export const MOCK_COMPANIES: Company[] = [
  {
    id: "1574",
    xId: "1574",
    name: "O'zbekiston temir yo'llari AJ",
    shortName: "UTY",
    type: "ao",
    region: "Toshkent",
    employeeCount: 85000,
    kpiScores: generateKpiScores(92),
    totalScore: 92.4,
    zone: "green",
    rank: 1,
    lastUpdated: "2024-01-15",
  },
  {
    id: "2311",
    xId: "2311",
    name: "O'zvagonta'mir AJ",
    shortName: "O'zvagonta'mir",
    type: "ao",
    parentId: "1574",
    region: "Toshkent",
    employeeCount: 4500,
    kpiScores: generateKpiScores(88),
    totalScore: 88.7,
    zone: "green",
    rank: 2,
    lastUpdated: "2024-01-14",
  },
  {
    id: "1575",
    xId: "1575",
    name: "Temiryo'linfratuzilma AJ",
    shortName: "JDS",
    type: "ao",
    parentId: "1574",
    region: "Toshkent",
    employeeCount: 12000,
    kpiScores: generateKpiScores(85),
    totalScore: 85.2,
    zone: "green",
    rank: 3,
    lastUpdated: "2024-01-14",
  },
  {
    id: "2314",
    xId: "2314",
    name: "Temiryo'lekspress AJ",
    shortName: "LEX",
    type: "ao",
    parentId: "1574",
    region: "Toshkent",
    employeeCount: 3200,
    kpiScores: generateKpiScores(82),
    totalScore: 82.1,
    zone: "green",
    rank: 4,
    lastUpdated: "2024-01-13",
  },
  {
    id: "2313",
    xId: "2313",
    name: "Uztemiryo'lmashta'mir AJ",
    shortName: "TRZ",
    type: "ao",
    parentId: "1574",
    region: "Toshkent",
    employeeCount: 2800,
    kpiScores: generateKpiScores(79),
    totalScore: 79.5,
    zone: "yellow",
    rank: 5,
    lastUpdated: "2024-01-12",
  },
  {
    id: "1774",
    xId: "1774",
    name: "Temiryo'lkargo AJ",
    shortName: "Kargo",
    type: "ao",
    parentId: "1574",
    region: "Toshkent",
    employeeCount: 5600,
    kpiScores: generateKpiScores(76),
    totalScore: 76.3,
    zone: "yellow",
    rank: 6,
    lastUpdated: "2024-01-11",
  },
  {
    id: "2188",
    xId: "2188",
    name: "O'ztemiryo'lyo'lovchi AJ",
    shortName: "Passtrans",
    type: "ao",
    parentId: "1574",
    region: "Toshkent",
    employeeCount: 4800,
    kpiScores: generateKpiScores(73),
    totalScore: 73.8,
    zone: "yellow",
    rank: 7,
    lastUpdated: "2024-01-10",
  },
  {
    id: "2197",
    xId: "2197",
    name: "Toshkent mexanika zavodi AJ",
    shortName: "TMZ",
    type: "ao",
    parentId: "1574",
    region: "Toshkent",
    employeeCount: 1800,
    kpiScores: generateKpiScores(70),
    totalScore: 70.2,
    zone: "yellow",
    rank: 8,
    lastUpdated: "2024-01-09",
  },
  {
    id: "2312",
    xId: "2312",
    name: "Quyuv mexanika zavodi AJ",
    shortName: "LMZ",
    type: "ao",
    parentId: "1574",
    region: "Toshkent",
    employeeCount: 1200,
    kpiScores: generateKpiScores(65),
    totalScore: 65.4,
    zone: "yellow",
    rank: 9,
    lastUpdated: "2024-01-08",
  },
  {
    id: "16",
    xId: "16",
    name: "Buxoro mintaqaviy temir yo'l uzeli",
    shortName: "Buxoro MTU",
    type: "mtu",
    parentId: "1575",
    region: "Buxoro",
    employeeCount: 8500,
    kpiScores: generateKpiScores(78),
    totalScore: 78.6,
    zone: "yellow",
    rank: 10,
    lastUpdated: "2024-01-07",
  },
  {
    id: "17",
    xId: "17",
    name: "Qo'ng'irot mintaqaviy temir yo'l uzeli",
    shortName: "Qo'ng'irot MTU",
    type: "mtu",
    parentId: "1575",
    region: "Qoraqalpog'iston",
    employeeCount: 6200,
    kpiScores: generateKpiScores(72),
    totalScore: 72.1,
    zone: "yellow",
    rank: 11,
    lastUpdated: "2024-01-06",
  },
  {
    id: "1399",
    xId: "1399",
    name: "Buxoro lokomotiv deposi",
    shortName: "TCh-6",
    type: "tch",
    parentId: "16",
    region: "Buxoro",
    employeeCount: 650,
    kpiScores: generateKpiScores(81),
    totalScore: 81.3,
    zone: "green",
    rank: 12,
    lastUpdated: "2024-01-05",
  },
  {
    id: "1413",
    xId: "1413",
    name: "Qo'ng'irot lokomotiv deposi",
    shortName: "TCh-7",
    type: "tch",
    parentId: "17",
    region: "Qoraqalpog'iston",
    employeeCount: 480,
    kpiScores: generateKpiScores(68),
    totalScore: 68.5,
    zone: "yellow",
    rank: 13,
    lastUpdated: "2024-01-04",
  },
  {
    id: "1418",
    xId: "1418",
    name: "Urgench lokomotiv deposi",
    shortName: "TCh-10",
    type: "tch",
    parentId: "17",
    region: "Xorazm",
    employeeCount: 520,
    kpiScores: generateKpiScores(75),
    totalScore: 75.8,
    zone: "yellow",
    rank: 14,
    lastUpdated: "2024-01-03",
  },
  {
    id: "2319",
    xId: "2319",
    name: "Andijon vagon deposi",
    shortName: "VCHD-5",
    type: "vchd",
    parentId: "2311",
    region: "Andijon",
    employeeCount: 380,
    kpiScores: generateKpiScores(83),
    totalScore: 83.2,
    zone: "green",
    rank: 15,
    lastUpdated: "2024-01-02",
  },
  {
    id: "467",
    xId: "467",
    name: "Samarqand vagon deposi",
    shortName: "VChD-6",
    type: "vchd",
    parentId: "2311",
    region: "Samarqand",
    employeeCount: 420,
    kpiScores: generateKpiScores(77),
    totalScore: 77.4,
    zone: "yellow",
    rank: 16,
    lastUpdated: "2024-01-01",
  },
  {
    id: "474",
    xId: "474",
    name: "Termiz vagon deposi",
    shortName: "VChD-16",
    type: "vchd",
    parentId: "2311",
    region: "Surxondaryo",
    employeeCount: 290,
    kpiScores: generateKpiScores(62),
    totalScore: 62.8,
    zone: "yellow",
    rank: 17,
    lastUpdated: "2023-12-31",
  },
  {
    id: "473",
    xId: "473",
    name: "Qo'ng'irot vagon deposi",
    shortName: "VChD-14",
    type: "vchd",
    parentId: "2311",
    region: "Qoraqalpog'iston",
    employeeCount: 260,
    kpiScores: generateKpiScores(48),
    totalScore: 48.5,
    zone: "red",
    rank: 18,
    lastUpdated: "2023-12-30",
  },
  {
    id: "1541",
    xId: "1541",
    name: "1-son energomontaj poezdi MChJ",
    shortName: "EP-1",
    type: "mchj",
    parentId: "1574",
    region: "Toshkent",
    employeeCount: 180,
    kpiScores: generateKpiScores(45),
    totalScore: 45.2,
    zone: "red",
    rank: 19,
    lastUpdated: "2023-12-29",
  },
  {
    id: "1540",
    xId: "1540",
    name: "1-son qurilish montaj poezdi MChJ",
    shortName: "KVP-1",
    type: "mchj",
    parentId: "1574",
    region: "Toshkent",
    employeeCount: 220,
    kpiScores: generateKpiScores(42),
    totalScore: 42.8,
    zone: "red",
    rank: 20,
    lastUpdated: "2023-12-28",
  },
];

// Sort by total score
MOCK_COMPANIES.sort((a, b) => b.totalScore - a.totalScore);
MOCK_COMPANIES.forEach((company, index) => {
  company.rank = index + 1;
});

export interface DashboardStats {
  totalCompanies: number;
  greenZone: number;
  yellowZone: number;
  redZone: number;
  avgScore: number;
  totalEmployees: number;
}

export const getDashboardStats = (companies: Company[]): DashboardStats => {
  return {
    totalCompanies: companies.length,
    greenZone: companies.filter(c => c.zone === "green").length,
    yellowZone: companies.filter(c => c.zone === "yellow").length,
    redZone: companies.filter(c => c.zone === "red").length,
    avgScore: Math.round(companies.reduce((sum, c) => sum + c.totalScore, 0) / companies.length * 10) / 10,
    totalEmployees: companies.reduce((sum, c) => sum + c.employeeCount, 0),
  };
};

// Monthly trend data for charts
export const MONTHLY_TREND_DATA = [
  { month: 'Yan', greenZone: 3, yellowZone: 10, redZone: 7, avgScore: 68 },
  { month: 'Fev', greenZone: 4, yellowZone: 11, redZone: 5, avgScore: 71 },
  { month: 'Mar', greenZone: 5, yellowZone: 10, redZone: 5, avgScore: 73 },
  { month: 'Apr', greenZone: 5, yellowZone: 11, redZone: 4, avgScore: 74 },
  { month: 'May', greenZone: 6, yellowZone: 10, redZone: 4, avgScore: 75 },
  { month: 'Iyun', greenZone: 6, yellowZone: 11, redZone: 3, avgScore: 76 },
];

// KPI comparison data for radar chart
export const KPI_COMPARISON_DATA = KPI_INDICATORS.slice(0, 8).map(ind => ({
  indicator: ind.nameUz,
  current: Math.round(65 + Math.random() * 25),
  target: 85,
  industry: Math.round(60 + Math.random() * 20),
}));
