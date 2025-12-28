// server/config/kpiConfig.js

export const KPI_CONFIG = {
    ltifr: {
        name: "Baxtsiz hodisalar (LTIFR)",
        weight: 0.40,
        lowerIsBetter: true,
        critical: true,
        icon: "⚠️",
        description: "Lost Time Injury Frequency Rate"
    },
    hseStaffing: {
        name: "MM xizmati shtat birliklari",
        weight: 0.10,
        lowerIsBetter: false,
        critical: true,
        icon: "👥",
        description: "MM xizmati uchun normativ bo'yicha talab etiladigan shtat soni"
    },
    noincident: {
        name: "Hodisasiz kunlar",
        weight: 0.06,
        lowerIsBetter: false,
        icon: "📅"
    },
    training: {
        name: "O'qitish qamrovi",
        weight: 0.05,
        lowerIsBetter: false,
        icon: "📚"
    },
    ppe: {
        name: "SHHV bilan ta'minlanganlik",
        weight: 0.05,
        lowerIsBetter: false,
        icon: "🦺"
    },
    workplaceAssessment: {
        name: "Ish o'rinlarini baholash",
        weight: 0.05,
        lowerIsBetter: false,
        icon: "🎯",
        description: "Mehnat sharoitlari va xavflarni baholash"
    },
    prevention: {
        name: "Profilaktika xarajatlari",
        weight: 0.04,
        lowerIsBetter: false,
        icon: "💰",
        description: "CAPEX/OPEX ratio"
    },
    workStoppage: {
        name: "Ishlarni to'xtatish",
        weight: 0.04,
        lowerIsBetter: false,
        icon: "🛑",
        description: "Internal (Positive) vs External (Negative)"
    },
    insurance: {
        name: "Sug'urta va Kompensatsiya",
        weight: 0.04,
        lowerIsBetter: true,
        icon: "🏥",
        description: "Ishchi sog'lig'iga yetkazilgan zarar"
    },
    equipment: {
        name: "XICHO bo'yicha identifikatsiyadan o'tgan uskunalar",
        weight: 0.06,
        lowerIsBetter: false,
        icon: "🔧",
        description: "Rolling stock va uskunalar"
    },
    inspection: {
        name: "Nazorat (Tekshiruvlar ijrosi)",
        weight: 0.03,
        lowerIsBetter: false,
        icon: "📋"
    },
    occupational: {
        name: "Kasbiy kasalliklar",
        weight: 0.02,
        lowerIsBetter: true,
        icon: "🏥"
    },
    compliance: {
        name: "Auditda aniqlangan nomuvofiqliklar",
        weight: 0.02,
        lowerIsBetter: false,
        icon: "✅"
    },
    emergency: {
        name: "Texnik mashg'ulotlarda qatnashganlar",
        weight: 0.02,
        lowerIsBetter: false,
        icon: "🚨"
    },
    violations: {
        name: "Talonlar (Intizomiy choralar)",
        weight: 0.02,
        lowerIsBetter: true,
        icon: "🎫"
    }
};

export const DEPARTMENT_PROFILES = [
    { id: 'locomotive', name: 'Lokomotiv xo\'jaligi (Juda yuqori xavf)', riskLevel: 'critical', icon: '🚂' },
    { id: 'road', name: 'Yo\'l xo\'jaligi (Yuqori fizik xavf)', riskLevel: 'high', icon: '🛤️' },
    { id: 'wagon', name: 'Vagon xo\'jaligi (Texnologik xavf)', riskLevel: 'high', icon: '🚃' },
    { id: 'electric', name: 'Elektr va Aloqa (Elektroxavfsizlik)', riskLevel: 'high', icon: '⚡' },
    { id: 'traffic', name: 'Harakatni Boshqarish (Inson omili)', riskLevel: 'medium', icon: '🚦' },
    { id: 'factory', name: 'Zavodlar (Sanoat xavfsizligi)', riskLevel: 'high', icon: '🏭' }
];

export const RISK_PROFILES = {
    HIGH: {
        name: 'Juda Yuqori Xavf',
        coefficient: 1.0,
        minLTIFR: 15,
        minHSEStaffing: 95,
        penaltyMultiplier: 1.5,
        minTraining: 95,
        minEquipment: 90,
        minPPE: 95,
        minRACoverage: 85,
        description: "Lokomotiv, Vagon, Yo'l - Juda yuqori xavf"
    },
    MEDIUM: {
        name: 'O\'rtacha Xavf',
        coefficient: 0.7,
        minLTIFR: 8,
        minHSEStaffing: 90,
        penaltyMultiplier: 1.2,
        minTraining: 85,
        minEquipment: 80,
        minPPE: 85,
        minRACoverage: 75,
        description: "Elektr, Harakatni Boshqarish"
    },
    LOW: {
        name: 'Past Xavf',
        coefficient: 0.4,
        minLTIFR: 3,
        minHSEStaffing: 85,
        penaltyMultiplier: 1.0,
        minTraining: 70,
        minEquipment: 60,
        minPPE: 70,
        minRACoverage: 60,
        description: "Ofis ishlari, Zavodlar"
    }
};

export const RISK_CLASSIFICATION = {
    locomotive: 'HIGH',
    wagon: 'HIGH',
    road: 'HIGH',
    electric: 'MEDIUM',
    traffic: 'MEDIUM',
    factory: 'MEDIUM'
};

export const KPI_WEIGHTS = {
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
        violations: 0.02
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
        violations: 0.02
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
        violations: 0.02
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
        violations: 0.02
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
        violations: 0.02
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
        violations: 0.02
    }
};

export const ACCIDENT_COEFFICIENTS = {
    fatal: { value: 100, label: "O'lim hollari", color: "#1a1a2e", icon: "💀" },
    severe: { value: 50, label: "Og'ir-o'rta og'ir", color: "#c0392b", icon: "🚑" },
    group: { value: 40, label: "Guruhli hodisa", color: "#d35400", icon: "👥" },
    light: { value: 10, label: "Yengil hodisa", color: "#f39c12", icon: "🩹" }
};
