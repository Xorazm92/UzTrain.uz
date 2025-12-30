export type KPIStatus = 'green' | 'yellow' | 'red';

export type KPIDirection = 'higher' | 'lower';

export interface KPIMetadata {
    key: string;
    label: string;
    category: string;
    target: number;
    unit: string;
    formula: string;
    direction: KPIDirection;
    weight: number;
    icon?: string;
    description?: string;
    critical?: boolean;
}

export const STATUS_LABELS: Record<KPIStatus, string> = {
    green: 'Barqaror',
    yellow: 'Nazorat',
    red: 'Kritik',
};

export const KPI_METADATA: KPIMetadata[] = [
    {
        key: 'ltifr',
        label: 'Baxtsiz hodisalar (LTIFR)',
        category: 'Kritik',
        target: 0,
        unit: '%',
        formula: 'Lost Time Injury Frequency Rate',
        direction: 'lower',
        weight: 0.4,
        icon: '⚠️',
        description: 'Yo‘qotilgan ish vaqti bilan tugagan hodisalar chastotasi',
        critical: true,
    },
    {
        key: 'hseStaffing',
        label: 'MM xizmati shtat birliklari',
        category: 'Kritik',
        target: 100,
        unit: '%',
        formula: 'Normativ bo‘yicha to‘ldirilganlik darajasi',
        direction: 'higher',
        weight: 0.1,
        icon: '👥',
        description: 'MM xizmati uchun fakt va normativ nisbati',
        critical: true,
    },
    {
        key: 'noincident',
        label: 'Hodisasiz kunlar',
        category: 'Muhim',
        target: 100,
        unit: '%',
        formula: 'Hisobot davrida hodisasiz o‘tgan kunlar ulushi',
        direction: 'higher',
        weight: 0.06,
        icon: '📅',
        description: '365 kunga nisbatan hodisasiz kunlar foizi',
    },
    {
        key: 'training',
        label: 'O‘qitish qamrovi',
        category: 'Muhim',
        target: 100,
        unit: '%',
        formula: '(Treningdan o‘tganlar / Jami) × 100%',
        direction: 'higher',
        weight: 0.05,
        icon: '📚',
        description: 'Rejalashtirilgan o‘qitishlar bajarilish darajasi',
    },
    {
        key: 'ppe',
        label: 'SHHV bilan ta’minlanganlik',
        category: 'Muhim',
        target: 100,
        unit: '%',
        formula: 'Shaxsiy himoya vositalari bilan qamrov',
        direction: 'higher',
        weight: 0.05,
        icon: '🦺',
        description: 'SHHV bilan taʼminlangan xodimlar ulushi',
    },
    {
        key: 'workplaceAssessment',
        label: 'Ish o‘rinlarini baholash',
        category: 'Muhim',
        target: 100,
        unit: '%',
        formula: 'Xavflarni baholash va monitoring qamrovi',
        direction: 'higher',
        weight: 0.05,
        icon: '🎯',
        description: 'Baholangan ish o‘rinlari ulushi',
    },
    {
        key: 'prevention',
        label: 'Profilaktika xarajatlari',
        category: 'Standart',
        target: 100,
        unit: '%',
        formula: 'CAPEX/OPEX doirasida profilaktik ulush',
        direction: 'higher',
        weight: 0.04,
        icon: '💰',
        description: 'Profilaktika budjetining bajarilishi',
    },
    {
        key: 'workStoppage',
        label: 'Ishlarni to‘xtatish',
        category: 'Standart',
        target: 100,
        unit: '%',
        formula: 'Ichki (pozitiv) va tashqi (negativ) to‘xtatishlar nisbati',
        direction: 'higher',
        weight: 0.04,
        icon: '🛑',
        description: 'Ichki to‘xtatishlar (bonus) va tashqi jarimalar (penalti)',
    },
    {
        key: 'insurance',
        label: 'Sug‘urta va kompensatsiya',
        category: 'Standart',
        target: 0,
        unit: '%',
        formula: 'Baxtsiz hodisalar kompensatsiyasi bo‘yicha to‘lovlar',
        direction: 'lower',
        weight: 0.04,
        icon: '🏥',
        description: 'Ish haqi fondiga nisbatan sug‘urta to‘lovlari',
    },
    {
        key: 'equipment',
        label: 'XICO’dan o‘tgan uskunalar',
        category: 'Muhim',
        target: 100,
        unit: '%',
        formula: 'Identifikatsiyadan o‘tgan texnika ulushi',
        direction: 'higher',
        weight: 0.06,
        icon: '🔧',
        description: 'Texnik vositalarning identifikatsiya qilingan ulushi',
    },
    {
        key: 'inspection',
        label: 'Nazorat (tekshiruvlar ijrosi)',
        category: 'Standart',
        target: 100,
        unit: '%',
        formula: 'Rejalashtirilgan tekshiruvlar bajarilishi',
        direction: 'higher',
        weight: 0.03,
        icon: '📋',
        description: 'Nazorat rejalari bajarilish foizi',
    },
    {
        key: 'occupational',
        label: 'Kasbiy kasalliklar',
        category: 'Standart',
        target: 0,
        unit: '%',
        formula: 'Kasbiy kasalliklar chastotasi',
        direction: 'lower',
        weight: 0.02,
        icon: '🏥',
        description: 'Aniqlangan kasbiy kasalliklar soni',
    },
    {
        key: 'compliance',
        label: 'Audit natijasidagi nomuvofiqliklar',
        category: 'Standart',
        target: 0,
        unit: '%',
        formula: 'Audit choralari bo‘yicha natija',
        direction: 'lower',
        weight: 0.02,
        icon: '✅',
        description: 'Auditda aniqlangan nomuvofiqliklar ulushi',
    },
    {
        key: 'emergency',
        label: 'Texnik mashg‘ulotlarda qatnashuv',
        category: 'Standart',
        target: 100,
        unit: '%',
        formula: 'Favqulodda tayyorgarlik mashg‘ulotlari qamrovi',
        direction: 'higher',
        weight: 0.02,
        icon: '🚨',
        description: 'Favqulodda vaziyat mashg‘ulotlari qamrovi',
    },
    {
        key: 'violations',
        label: 'Intizomiy chora va talonlar',
        category: 'Standart',
        target: 0,
        unit: '%',
        formula: 'Talon va intizomiy choralar soni',
        direction: 'lower',
        weight: 0.02,
        icon: '🎫',
        description: 'Ichki va tashqi nazorat natijalari bo‘yicha baho',
    },
];

export interface DepartmentProfile {
    id: string;
    name: string;
    riskLevel: 'critical' | 'high' | 'medium' | 'low';
    icon: string;
}

export const DEPARTMENT_PROFILES: DepartmentProfile[] = [
    { id: 'locomotive', name: 'Lokomotiv xoʻjaligi (Juda yuqori xavf)', riskLevel: 'critical', icon: '🚂' },
    { id: 'road', name: 'Yoʻl xoʻjaligi (Yuqori fizik xavf)', riskLevel: 'high', icon: '🛤️' },
    { id: 'wagon', name: 'Vagon xoʻjaligi (Texnologik xavf)', riskLevel: 'high', icon: '🚃' },
    { id: 'electric', name: 'Elektr va aloqa (Elektroxavfsizlik)', riskLevel: 'high', icon: '⚡' },
    { id: 'traffic', name: 'Harakatni boshqarish (Inson omili)', riskLevel: 'medium', icon: '🚦' },
    { id: 'factory', name: 'Zavodlar (Sanoat xavfsizligi)', riskLevel: 'medium', icon: '🏭' },
];

export interface RiskProfile {
    name: string;
    coefficient: number;
    minLTIFR: number;
    minHSEStaffing: number;
    penaltyMultiplier: number;
    minTraining: number;
    minEquipment: number;
    minPPE: number;
    minRACoverage: number;
    description: string;
}

export const RISK_PROFILES: Record<string, RiskProfile> = {
    HIGH: {
        name: 'Juda yuqori xavf',
        coefficient: 1.0,
        minLTIFR: 15,
        minHSEStaffing: 95,
        penaltyMultiplier: 1.5,
        minTraining: 95,
        minEquipment: 90,
        minPPE: 95,
        minRACoverage: 85,
        description: "Lokomotiv, vagon, yoʻl xoʻjaliklari",
    },
    MEDIUM: {
        name: 'Oʻrtacha xavf',
        coefficient: 0.7,
        minLTIFR: 8,
        minHSEStaffing: 90,
        penaltyMultiplier: 1.2,
        minTraining: 85,
        minEquipment: 80,
        minPPE: 85,
        minRACoverage: 75,
        description: "Elektr taʼminoti, harakatni boshqarish",
    },
    LOW: {
        name: 'Past xavf',
        coefficient: 0.4,
        minLTIFR: 3,
        minHSEStaffing: 85,
        penaltyMultiplier: 1.0,
        minTraining: 70,
        minEquipment: 60,
        minPPE: 70,
        minRACoverage: 60,
        description: "Maʼmuriy va ishlab chiqarish bo‘limlari",
    },
};

export const RISK_CLASSIFICATION: Record<string, keyof typeof RISK_PROFILES> = {
    locomotive: 'HIGH',
    wagon: 'HIGH',
    road: 'HIGH',
    electric: 'MEDIUM',
    traffic: 'MEDIUM',
    factory: 'MEDIUM',
};

export const KPI_WEIGHTS: Record<string, Record<string, number>> = {
    locomotive: {
        ltifr: 0.40,
        hseStaffing: 0.10,
        noincident: 0.06,
        training: 0.05,
        equipment: 0.06,
        ppe: 0.05,
        workplaceAssessment: 0.05,
        prevention: 0.04,
        workStoppage: 0.04,
        insurance: 0.04,
        inspection: 0.03,
        occupational: 0.02,
        compliance: 0.02,
        emergency: 0.02,
        violations: 0.02,
    },
    road: {
        ltifr: 0.40,
        hseStaffing: 0.10,
        noincident: 0.06,
        training: 0.05,
        equipment: 0.06,
        ppe: 0.05,
        workplaceAssessment: 0.05,
        prevention: 0.04,
        workStoppage: 0.04,
        insurance: 0.04,
        inspection: 0.03,
        occupational: 0.02,
        compliance: 0.02,
        emergency: 0.02,
        violations: 0.02,
    },
    wagon: {
        ltifr: 0.40,
        hseStaffing: 0.10,
        noincident: 0.06,
        training: 0.05,
        equipment: 0.06,
        ppe: 0.05,
        workplaceAssessment: 0.05,
        prevention: 0.04,
        workStoppage: 0.04,
        insurance: 0.04,
        inspection: 0.03,
        occupational: 0.02,
        compliance: 0.02,
        emergency: 0.02,
        violations: 0.02,
    },
    electric: {
        ltifr: 0.38,
        hseStaffing: 0.10,
        noincident: 0.06,
        training: 0.06,
        equipment: 0.05,
        ppe: 0.06,
        workplaceAssessment: 0.05,
        prevention: 0.04,
        workStoppage: 0.04,
        insurance: 0.04,
        inspection: 0.03,
        occupational: 0.02,
        compliance: 0.02,
        emergency: 0.03,
        violations: 0.02,
    },
    traffic: {
        ltifr: 0.35,
        hseStaffing: 0.08,
        noincident: 0.08,
        training: 0.08,
        equipment: 0.04,
        ppe: 0.04,
        workplaceAssessment: 0.06,
        prevention: 0.04,
        workStoppage: 0.06,
        insurance: 0.05,
        inspection: 0.04,
        occupational: 0.02,
        compliance: 0.02,
        emergency: 0.02,
        violations: 0.02,
    },
    factory: {
        ltifr: 0.40,
        hseStaffing: 0.10,
        noincident: 0.06,
        training: 0.05,
        equipment: 0.06,
        ppe: 0.05,
        workplaceAssessment: 0.05,
        prevention: 0.04,
        workStoppage: 0.04,
        insurance: 0.04,
        inspection: 0.03,
        occupational: 0.02,
        compliance: 0.02,
        emergency: 0.02,
        violations: 0.02,
    },
};

export const ACCIDENT_COEFFICIENTS = {
    fatal: { value: 100, label: "O'lim hollari", color: '#1a1a2e', icon: '💀' },
    severe: { value: 50, label: "Og'ir va o'rta og'ir", color: '#c0392b', icon: '🚑' },
    group: { value: 40, label: 'Guruhli hodisa', color: '#d35400', icon: '👥' },
    light: { value: 10, label: 'Yengil hodisa', color: '#f39c12', icon: '🩹' },
};

export const KPI_KEY_ALIASES: Record<string, string> = {
    'Mehnat Muhofazasi': 'ltifr',
    'Texnika Xavfsizligi': 'equipment',
    "O'qitish qamrovi": 'training',
    'Profilaktika': 'prevention',
    'Profilaktika ishlari': 'prevention',
    'Tibbiy ko‘rik': 'insurance',
    "Tibbiy ko'riк": 'insurance',
    "Tibbiy ko'rik": 'insurance',
    "SHHV bilan ta'minlanganlik": 'ppe',
    "Ish o'rinlarini baholash": 'workplaceAssessment',
    'Sug‘urta va kompensatsiya': 'insurance',
    'Nazorat (Tekshiruvlar ijrosi)': 'inspection',
    'Kasbiy kasalliklar': 'occupational',
    'Audit natijasidagi nomuvofiqliklar': 'compliance',
    "Texnik mashg'ulotlarda qatnashganlar": 'emergency',
    'Intizomiy chora va talonlar': 'violations',
};

export const KPI_TARGET_FALLBACK = 80;

const STATUS_THRESHOLDS: Record<KPIDirection, (score: number, target: number) => KPIStatus> = {
    higher: (score, target) => {
        if (score >= target) return 'green';
        if (score >= Math.max(0, target - 10)) return 'yellow';
        return 'red';
    },
    lower: (score, target) => {
        if (score <= target) return 'green';
        if (score <= target + Math.max(5, target * 0.15)) return 'yellow';
        return 'red';
    },
};

export const normalizeKpiKey = (key: string): string => KPI_KEY_ALIASES[key] ?? key;

export const fallbackMeta = (key: string): KPIMetadata => ({
    key,
    label: key,
    category: 'Boshqa',
    target: KPI_TARGET_FALLBACK,
    unit: '%',
    formula: 'Supabase maʼlumotlari asosida hisoblanadi',
    direction: 'higher',
    weight: 0.05,
});

export const evaluateStatus = (score: number, meta: KPIMetadata): KPIStatus => {
    const resolver = STATUS_THRESHOLDS[meta.direction];
    return resolver(score, meta.target);
};

export const TOTAL_KPI_WEIGHT = KPI_METADATA.reduce((acc, meta) => acc + meta.weight, 0);

export const computeWeightedOverallIndex = (scores: Record<string, number>, profileId?: string): number => {
    const weights = profileId && KPI_WEIGHTS[profileId] ? KPI_WEIGHTS[profileId] : undefined;
    let totalScore = 0;
    let totalWeight = 0;

    KPI_METADATA.forEach(meta => {
        const weight = weights?.[meta.key] ?? meta.weight;
        if (weight <= 0) return;
        const value = scores[meta.key] ?? meta.target;
        totalScore += value * weight;
        totalWeight += weight;
    });

    return totalWeight > 0 ? totalScore / totalWeight : 0;
};
