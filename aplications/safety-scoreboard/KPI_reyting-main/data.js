// O'zbekiston Temir Yo'llari AJ - Tashkiliy Tuzilma Ma'lumotlari
// Xalqaro standartlar: ISO 45001, OSHA, ILO va O'zbekiston mehnat qonunchiligi asosida

// ========================================
// RISK PROFILES - Xavfsizlik talablarining darajasi
// ISO 45001, OSHA va O'zbekiston talablari asosida
// ========================================
window.RISK_PROFILES = {
    'HIGH': {
        name: 'Juda Yuqori Xavf',
        coefficient: 1.0,        // 100% - To'liq talablar
        minLTIFR: 15,           // QATTIQ: Minimum 15 ball (OLD: 10)
        minTRIR: 8,             // QATTIQ: Minimum 8 ball (OLD: 5)
        penaltyMultiplier: 1.5, // Xavfni neglect qilish uchun 50% oyuti
        minTraining: 95,        // QATTIQ: 95% (OLD: 90%)
        minEquipment: 90,       // QATTIQ: 90% (OLD: 85%)
        minPPE: 95,             // QATTIQ: 95% (OLD: 90%)
        minRACoverage: 85,      // QATTIQ: 85% (OLD: 80%)
        description: "Lokomotiv, Vagon, Yo'l - Juda yuqori xavf"
    },
    'MEDIUM': {
        name: 'O\'rtacha Xavf',
        coefficient: 0.7,
        minLTIFR: 8,            // QATTIQ: 8 ball (OLD: 5)
        minTRIR: 5,             // QATTIQ: 5 ball (OLD: 3)
        penaltyMultiplier: 1.2,
        minTraining: 85,        // QATTIQ: 85% (OLD: 80%)
        minEquipment: 80,       // QATTIQ: 80% (OLD: 75%)
        minPPE: 85,             // QATTIQ: 85% (OLD: 80%)
        minRACoverage: 75,      // QATTIQ: 75% (OLD: 70%)
        description: "Elektr, Harakatni Boshqarish"
    },
    'LOW': {
        name: 'Past Xavf',
        coefficient: 0.4,
        minLTIFR: 3,            // QATTIQ: 3 ball (OLD: 0)
        minTRIR: 2,             // QATTIQ: 2 ball (OLD: 0)
        penaltyMultiplier: 1.0,
        minTraining: 70,        // QATTIQ: 70% (OLD: 60%)
        minEquipment: 60,       // QATTIQ: 60% (OLD: 50%)
        minPPE: 70,             // QATTIQ: 70% (OLD: 60%)
        minRACoverage: 60,      // QATTIQ: 60% (OLD: 50%)
        description: "Ofis ishlari, Zavodlar"
    }
};

// ========================================
// RISK KLASSIFIKATSIYASI - Korxonalarni turga ajratish
// ========================================
window.RISK_CLASSIFICATION = {
    'locomotive': 'HIGH',      // Lokomotiv operatorlari
    'wagon': 'HIGH',           // Vagon operatorlari
    'road': 'HIGH',            // Yo'l ishlari - fizik xavf juda yuqori
    'electric': 'MEDIUM',      // Elektr - o'rta xavf
    'traffic': 'MEDIUM',       // Harakatni boshqarish - o'rta xavf
    'factory': 'MEDIUM'        // Zavodlar - o'rta xavf
};

// ========================================
// TEMIR YO'L XAVFSIZLIK KPI VAZNLARI
// Rail-optimized weights (15 band)
// ========================================
window.KPI_WEIGHTS = {
    // LOKOMOTIV - Juda yuqori xavfli (mashinist, elektr, harakat)
    // Jami: 1.00 (100%)
    'locomotive': {
        'ltifr': 0.40,        // Baxtsiz hodisalar - ENG MUHIM
        'trir': 0.10,         // TRIR / Mikro-jarohatlar
        'noincident': 0.06,   // Bexavfsiz kunlar
        'training': 0.05,     // O'qitish
        'equipment': 0.06,    // Uskuna nazorati (rolling stock)
        'ppe': 0.05,          // SHHV va PPE
        'raCoverage': 0.05,   // Xavfni baholash
        'prevention': 0.04,   // Profilaktika (CAPEX/OPEX)
        'nearMiss': 0.04,     // Xabarlar va Safety Culture
        'responseTime': 0.04, // Murojaatga reaksiya
        'inspection': 0.03,   // Nazorat rejasi
        'occupational': 0.02, // Kasbiy kasalliklar
        'compliance': 0.02,   // Audit
        'emergency': 0.02,    // Avariya mashqlari
        'violations': 0.02    // Intizomiy
    },
    
    // YO'L XO'JALIGI - Yuqori fizik xavf
    // Jami: 1.00 (100%)
    'road': {
        'ltifr': 0.40,
        'trir': 0.10,
        'noincident': 0.06,
        'training': 0.05,
        'equipment': 0.06,
        'ppe': 0.05,
        'raCoverage': 0.05,
        'prevention': 0.04,
        'nearMiss': 0.04,
        'responseTime': 0.04,
        'inspection': 0.03,
        'occupational': 0.02,
        'compliance': 0.02,
        'emergency': 0.02,
        'violations': 0.02
    },
    
    // VAGON XO'JALIGI - Texnologik xavf
    // Jami: 1.00 (100%)
    'wagon': {
        'ltifr': 0.40,
        'trir': 0.10,
        'noincident': 0.06,
        'training': 0.05,
        'equipment': 0.06,
        'ppe': 0.05,
        'raCoverage': 0.05,
        'prevention': 0.04,
        'nearMiss': 0.04,
        'responseTime': 0.04,
        'inspection': 0.03,
        'occupational': 0.02,
        'compliance': 0.02,
        'emergency': 0.02,
        'violations': 0.02
    },
    
    // ELEKTR VA ALOQA - Elektr xavfsizlik muhim
    // Jami: 1.00 (100%)
    'electric': {
        'ltifr': 0.38,
        'trir': 0.10,
        'noincident': 0.06,
        'training': 0.06,     // O'qitish muhimroq
        'equipment': 0.05,
        'ppe': 0.06,          // PPE muhimroq
        'raCoverage': 0.05,
        'prevention': 0.04,
        'nearMiss': 0.04,
        'responseTime': 0.04,
        'inspection': 0.03,
        'occupational': 0.02,
        'compliance': 0.02,
        'emergency': 0.03,
        'violations': 0.02
    },
    
    // HARAKATNI BOSHQARISH - Inson omili muhim
    // Jami: 1.00 (100%)
    'traffic': {
        'ltifr': 0.35,
        'trir': 0.08,
        'noincident': 0.08,   // Bexavfsiz kunlar muhimroq
        'training': 0.08,     // O'qitish muhimroq
        'equipment': 0.04,
        'ppe': 0.04,
        'raCoverage': 0.06,
        'prevention': 0.04,
        'nearMiss': 0.06,
        'responseTime': 0.05,
        'inspection': 0.04,
        'occupational': 0.02,
        'compliance': 0.02,
        'emergency': 0.02,
        'violations': 0.02
    },
    
    // ZAVODLAR - Sanoat xavfsizligi
    // Jami: 1.00 (100%)
    'factory': {
        'ltifr': 0.40,
        'trir': 0.10,
        'noincident': 0.06,
        'training': 0.05,
        'equipment': 0.06,
        'ppe': 0.05,
        'raCoverage': 0.05,
        'prevention': 0.04,
        'nearMiss': 0.04,
        'responseTime': 0.04,
        'inspection': 0.03,
        'occupational': 0.02,
        'compliance': 0.02,
        'emergency': 0.02,
        'violations': 0.02
    }
};

// ========================================
// DEPARTMENT PROFILES (Sektorlar)
// ========================================
window.DEPARTMENT_PROFILES = [
    { id: 'locomotive', name: 'Lokomotiv xo\'jaligi (Juda yuqori xavf)', riskLevel: 'critical', icon: '🚂' },
    { id: 'road', name: 'Yo\'l xo\'jaligi (Yuqori fizik xavf)', riskLevel: 'high', icon: '🛤️' },
    { id: 'wagon', name: 'Vagon xo\'jaligi (Texnologik xavf)', riskLevel: 'high', icon: '🚃' },
    { id: 'electric', name: 'Elektr va Aloqa (Elektroxavfsizlik)', riskLevel: 'high', icon: '⚡' },
    { id: 'traffic', name: 'Harakatni Boshqarish (Inson omili)', riskLevel: 'medium', icon: '🚦' },
    { id: 'factory', name: 'Zavodlar (Sanoat xavfsizligi)', riskLevel: 'high', icon: '🏭' }
];

// ========================================
// PENALTY TO SCORE NORMALIZATION TABLE
// Professional formula - xalqaro standartlar
// ========================================
window.PENALTY_TO_SCORE = {
    // Baxtsiz hodisalar uchun jarima -> ball konversiyasi
    accidentPenalty: [
        { min: 0, max: 0, score: 100 },      // Hech qanday hodisa yo'q
        { min: 1, max: 10, scoreMin: 95, scoreMax: 80 },   // Yengil
        { min: 11, max: 50, scoreMin: 80, scoreMax: 40 },  // O'rtacha
        { min: 51, max: 100, scoreMin: 40, scoreMax: 10 }, // Og'ir
        { min: 101, max: 200, scoreMin: 10, scoreMax: 5 }, // Juda og'ir
        { min: 201, max: 500, scoreMin: 5, scoreMax: 0 },  // Kritik
        { min: 501, max: Infinity, score: 0 }              // Falokatli
    ],
    
    // LTIFR benchmarks (xalqaro standartlar)
    ltifrBenchmarks: {
        excellent: 0.5,   // Ajoyib - xalqaro miqyosda eng yaxshi
        good: 1.0,        // Yaxshi
        average: 2.0,     // O'rtacha
        poor: 4.0,        // Yomon
        critical: 8.0     // Kritik
    },
    
    // TRIR benchmarks
    trirBenchmarks: {
        excellent: 1.0,
        good: 2.5,
        average: 5.0,
        poor: 10.0,
        critical: 20.0
    }
};

// ========================================
// SOAT HAJMI ASOSIDA BAND GURUHLARI (Peer Grouping)
// ========================================
window.PEER_GROUPS = {
    'A': { minHours: 500000, maxHours: Infinity, name: 'Katta korxonalar', minEmployees: 300 },
    'B': { minHours: 100000, maxHours: 499999, name: 'O\'rta korxonalar', minEmployees: 100 },
    'C': { minHours: 0, maxHours: 99999, name: 'Kichik korxonalar', minEmployees: 0 }
};

// ========================================
// KPI CONFIGURATION (15 band)
// ========================================
window.KPI_CONFIG_EXTENDED = {
    ltifr: { 
        name: "Baxtsiz hodisalar (LTIFR)", 
        weight: 0.45, 
        lowerIsBetter: true, 
        critical: true,
        description: "Lost Time Injury Frequency Rate",
        formula: "(Lost Time Injuries × 1,000,000) / Total Hours Worked",
        icon: "⚠️"
    },
    trir: { 
        name: "TRIR / Mikro-jarohatlar", 
        weight: 0.12, 
        lowerIsBetter: true, 
        critical: true,
        description: "Total Recordable Incident Rate",
        formula: "(Recordable Incidents / Total Hours Worked) × 200,000",
        icon: "🩹"
    },
    noincident: { 
        name: "Bexavfsiz kunlar", 
        weight: 0.06, 
        lowerIsBetter: false,
        description: "Hodisasiz o'tgan kunlar soni",
        icon: "📅"
    },
    training: { 
        name: "O'qitish qamrovi", 
        weight: 0.05, 
        lowerIsBetter: false,
        description: "Majburiy MM o'quvlarini o'tgan xodimlar ulushi",
        icon: "📚"
    },
    equipment: { 
        name: "Uskuna nazorati", 
        weight: 0.06, 
        lowerIsBetter: false,
        description: "Rolling stock va uskunalar ko'rigi",
        icon: "🔧"
    },
    ppe: { 
        name: "SHHV ta'minoti", 
        weight: 0.05, 
        lowerIsBetter: false,
        description: "Shaxsiy himoya vositalari bilan ta'minlanganlik",
        icon: "🦺"
    },
    raCoverage: { 
        name: "Xavfni baholash", 
        weight: 0.05, 
        lowerIsBetter: false,
        description: "Risk Assessment qamrovi",
        icon: "🎯"
    },
    prevention: { 
        name: "Profilaktika xarajatlari", 
        weight: 0.04, 
        lowerIsBetter: false,
        description: "CAPEX/OPEX ratio for safety",
        icon: "💰"
    },
    nearMiss: { 
        name: "Xabarlar (Near Miss)", 
        weight: 0.04, 
        lowerIsBetter: false,
        description: "Safety Culture - near-miss reporting rate",
        icon: "📢"
    },
    responseTime: { 
        name: "Murojaatga reaksiya", 
        weight: 0.03, 
        lowerIsBetter: false,
        description: "Nomuvofiqliklarni yopish tezligi",
        icon: "⏱️"
    },
    inspection: { 
        name: "Nazorat rejasi", 
        weight: 0.03, 
        lowerIsBetter: false,
        description: "Ichki nazorat rejasi ijrosi",
        icon: "📋"
    },
    occupational: { 
        name: "Kasbiy kasalliklar", 
        weight: 0.02, 
        lowerIsBetter: true,
        description: "Aniqlangan kasbiy kasalliklar soni",
        icon: "🏥"
    },
    compliance: { 
        name: "Audit samaradorligi", 
        weight: 0.02, 
        lowerIsBetter: false,
        description: "Audit natijasi va muvofiqlik darajasi",
        icon: "✅"
    },
    emergency: { 
        name: "Avariya mashqlari", 
        weight: 0.02, 
        lowerIsBetter: false,
        description: "Favqulodda vaziyatlarga tayyorgarlik",
        icon: "🚨"
    },
    violations: { 
        name: "Intizomiy buzilishlar", 
        weight: 0.01, 
        lowerIsBetter: true,
        description: "Talon tizimi bo'yicha buzilishlar",
        icon: "🎫"
    }
};

// ========================================
// ACCIDENT SEVERITY COEFFICIENTS
// O'zbekiston va xalqaro standartlar
// ========================================
window.ACCIDENT_COEFFICIENTS = {
    fatal: { value: 100, label: "O'lim hollari", color: "#1a1a2e", icon: "💀" },
    severe: { value: 50, label: "Og'ir-o'rta og'ir", color: "#c0392b", icon: "🚑" },
    group: { value: 40, label: "Guruhli hodisa", color: "#d35400", icon: "👥" },
    light: { value: 10, label: "Yengil hodisa", color: "#f39c12", icon: "🩹" }
};

// ========================================
// LTIFR & TRIR CALCULATION HELPERS
// ========================================
window.SafetyMetrics = {
    // LTIFR = (Lost Time Injuries × 200,000) / Total Hours Worked
    // OSHA standart normalizatsiya faktori: 200,000 (100 xodim × 2000 soat/yil)
    calculateLTIFR: function(lostTimeInjuries, totalHoursWorked) {
        if (totalHoursWorked <= 0) return 0;
        return (lostTimeInjuries * 200000) / totalHoursWorked;
    },
    
    // TRIR = (Recordable Incidents × 200,000) / Total Hours Worked
    // OSHA standart normalizatsiya faktori: 200,000
    calculateTRIR: function(recordableIncidents, totalHoursWorked) {
        if (totalHoursWorked <= 0) return 0;
        return (recordableIncidents * 200000) / totalHoursWorked;
    },
    
    // Penalty score from accidents
    calculatePenaltyScore: function(fatal, severe, group, light) {
        const coeffs = window.ACCIDENT_COEFFICIENTS;
        return (fatal * coeffs.fatal.value) + 
               (severe * coeffs.severe.value) + 
               (group * coeffs.group.value) + 
               (light * coeffs.light.value);
    },
    
    // Convert penalty to normalized score (0-100)
    penaltyToScore: function(penalty) {
        const table = window.PENALTY_TO_SCORE.accidentPenalty;
        
        for (const range of table) {
            if (penalty >= range.min && penalty <= range.max) {
                if (range.score !== undefined) {
                    return range.score;
                }
                // Linear interpolation
                const ratio = (penalty - range.min) / (range.max - range.min);
                return Math.round(range.scoreMax + (range.scoreMin - range.scoreMax) * (1 - ratio));
            }
        }
        return 0;
    },
    
    // Z-Score for benchmarking
    calculateZScore: function(value, mean, stdDev) {
        if (stdDev === 0) return 0;
        return (value - mean) / stdDev;
    },
    
    // Get peer group based on hours/employees
    getPeerGroup: function(totalHours, employees) {
        const groups = window.PEER_GROUPS;
        
        if (totalHours >= groups.A.minHours || employees >= groups.A.minEmployees) {
            return 'A';
        } else if (totalHours >= groups.B.minHours || employees >= groups.B.minEmployees) {
            return 'B';
        }
        return 'C';
    },
    
    // Calculate yearly hours from employee count (standard: 1820 hours/year)
    calculateYearlyHours: function(employees, hoursPerEmployee = 1820) {
        return employees * hoursPerEmployee;
    }
};

// ========================================
// BENCHMARK DATA (Sector Medians)
// ========================================
window.SECTOR_BENCHMARKS = {
    locomotive: {
        ltifr: { median: 3.5, stdDev: 1.8, excellent: 1.0, poor: 6.0 },
        trir: { median: 8.0, stdDev: 3.5, excellent: 2.0, poor: 15.0 }
    },
    road: {
        ltifr: { median: 4.0, stdDev: 2.0, excellent: 1.5, poor: 7.0 },
        trir: { median: 9.0, stdDev: 4.0, excellent: 2.5, poor: 16.0 }
    },
    wagon: {
        ltifr: { median: 3.0, stdDev: 1.5, excellent: 0.8, poor: 5.0 },
        trir: { median: 7.0, stdDev: 3.0, excellent: 1.8, poor: 13.0 }
    },
    electric: {
        ltifr: { median: 2.5, stdDev: 1.2, excellent: 0.5, poor: 4.5 },
        trir: { median: 6.0, stdDev: 2.5, excellent: 1.5, poor: 11.0 }
    },
    traffic: {
        ltifr: { median: 1.5, stdDev: 0.8, excellent: 0.3, poor: 3.0 },
        trir: { median: 4.0, stdDev: 2.0, excellent: 1.0, poor: 8.0 }
    },
    factory: {
        ltifr: { median: 3.2, stdDev: 1.6, excellent: 0.8, poor: 5.5 },
        trir: { median: 7.5, stdDev: 3.2, excellent: 2.0, poor: 14.0 }
    }
};

// Keep const for backward compatibility
const KPI_WEIGHTS = window.KPI_WEIGHTS;
const DEPARTMENT_PROFILES = window.DEPARTMENT_PROFILES;

// Helper to generate empty KPIs for clean start
function getEmptyKPIs() {
    const kpis = {};
    const keys = [
        'ltifr', 'trir', 'noincident', 'training', 'raCoverage',
        'nearMiss', 'responseTime', 'prevention', 'ppe', 'equipment',
        'inspection', 'occupational', 'compliance', 'emergency', 'violations'
    ];

    keys.forEach(key => {
        kpis[key] = {
            value: 0,
            score: 0
        };
    });

    return kpis;
}

const UZ_RAILWAY_DATA = [
    // 1-Daraja: Boshqaruv
    {
        id: 'aj_head',
        name: "O'zbekiston Temir Yo'llari AJ",
        level: 'management',
        supervisorId: null,
        riskGroup: 'low',
        employees: 500,
        overallIndex: 0,
        kpis: getEmptyKPIs()
    },

    // 2-Daraja: Asosiy Platformalar va Direksiyalar
    {
        id: 'infra_aj',
        name: "\"Temiryo'linfratuzilma\" AJ",
        level: 'supervisor',
        supervisorId: 'aj_head',
        riskGroup: 'high',
        employees: 15000,
        overallIndex: 0,
        kpis: getEmptyKPIs()
    },
    {
        id: 'yolovchi_aj',
        name: "\"O'ztemiryo'lyo'lovchi\" AJ",
        level: 'supervisor',
        supervisorId: 'aj_head',
        riskGroup: 'medium',
        employees: 5000,
        overallIndex: 0,
        kpis: getEmptyKPIs()
    },
    {
        id: 'kargo_aj',
        name: "\"O'ztemiryo'lkargo\" AJ",
        level: 'supervisor',
        supervisorId: 'aj_head',
        riskGroup: 'medium',
        employees: 3000,
        overallIndex: 0,
        kpis: getEmptyKPIs()
    },
    {
        id: 'quyuv_mex',
        name: "\"Quyuv mexanika zavodi\" AJ",
        level: 'subsidiary',
        supervisorId: 'aj_head',
        riskGroup: 'high',
        employees: 1200,
        overallIndex: 0,
        kpis: getEmptyKPIs()
    },

    // 3-Daraja: Temiryo'linfratuzilma tarkibidagi MTUlar
    {
        id: 'toshkent_mtu',
        name: "Toshkent MTU",
        level: 'supervisor',
        supervisorId: 'infra_aj',
        riskGroup: 'high',
        employees: 3500,
        overallIndex: 0,
        kpis: getEmptyKPIs()
    },
    {
        id: 'qoqon_mtu',
        name: "Qo'qon MTU",
        level: 'supervisor',
        supervisorId: 'infra_aj',
        riskGroup: 'high',
        employees: 2800,
        overallIndex: 0,
        kpis: getEmptyKPIs()
    },
    {
        id: 'buxoro_mtu',
        name: "Buxoro MTU",
        level: 'supervisor',
        supervisorId: 'infra_aj',
        riskGroup: 'high',
        employees: 3100,
        overallIndex: 0,
        kpis: getEmptyKPIs()
    },
    {
        id: 'qongirot_mtu',
        name: "Qo'ng'irot MTU",
        level: 'supervisor',
        supervisorId: 'infra_aj',
        riskGroup: 'high',
        employees: 2200,
        overallIndex: 0,
        kpis: getEmptyKPIs()
    },
    {
        id: 'qarshi_mtu',
        name: "Qarshi MTU",
        level: 'supervisor',
        supervisorId: 'infra_aj',
        riskGroup: 'high',
        employees: 2500,
        overallIndex: 0,
        kpis: getEmptyKPIs()
    },
    {
        id: 'termiz_mtu',
        name: "Termiz MTU",
        level: 'supervisor',
        supervisorId: 'infra_aj',
        riskGroup: 'high',
        employees: 1800,
        overallIndex: 0,
        kpis: getEmptyKPIs()
    },

    // 4-Daraja: Filiallar
    { id: 'salor_masofa', name: "Salor temir yo'l masofasi", level: 'subsidiary', supervisorId: 'toshkent_mtu', riskGroup: 'high', employees: 150, overallIndex: 0, kpis: getEmptyKPIs() },
    { id: 'toshkent_masofa', name: "Toshkent temir yo'l masofasi", level: 'subsidiary', supervisorId: 'toshkent_mtu', riskGroup: 'high', employees: 200, overallIndex: 0, kpis: getEmptyKPIs() },
    { id: 'xovos_masofa', name: "Xovos temir yo'l masofasi", level: 'subsidiary', supervisorId: 'toshkent_mtu', riskGroup: 'high', employees: 180, overallIndex: 0, kpis: getEmptyKPIs() },
    { id: 'toshkent_elektr', name: "Toshkent elektr ta'minoti", level: 'subsidiary', supervisorId: 'toshkent_mtu', riskGroup: 'high', employees: 120, overallIndex: 0, kpis: getEmptyKPIs() },

    { id: 'qoqon_depo', name: "Qo'qon lokomotiv deposi", level: 'subsidiary', supervisorId: 'qoqon_mtu', riskGroup: 'high', employees: 450, overallIndex: 0, kpis: getEmptyKPIs() },
    { id: 'andijon_depo', name: "Andijon lokomotiv deposi", level: 'subsidiary', supervisorId: 'qoqon_mtu', riskGroup: 'high', employees: 300, overallIndex: 0, kpis: getEmptyKPIs() },
    { id: 'qoqon_masofa', name: "Qo'qon temir yo'l masofasi", level: 'subsidiary', supervisorId: 'qoqon_mtu', riskGroup: 'high', employees: 220, overallIndex: 0, kpis: getEmptyKPIs() },

    { id: 'buxoro_depo', name: "Buxoro lokomotiv deposi", level: 'subsidiary', supervisorId: 'buxoro_mtu', riskGroup: 'high', employees: 380, overallIndex: 0, kpis: getEmptyKPIs() },
    { id: 'tinchlik_depo', name: "Tinchlik lokomotiv deposi", level: 'subsidiary', supervisorId: 'buxoro_mtu', riskGroup: 'high', employees: 250, overallIndex: 0, kpis: getEmptyKPIs() },

    { id: 'vokzallar', name: "\"Temiryo'lvokzallari\" MChJ", level: 'subsidiary', supervisorId: 'yolovchi_aj', riskGroup: 'medium', employees: 800, overallIndex: 0, kpis: getEmptyKPIs() },
    { id: 'shahar_atrofi', name: "\"Shahar atrofida yo'lovchi tashish\" MChJ", level: 'subsidiary', supervisorId: 'yolovchi_aj', riskGroup: 'medium', employees: 400, overallIndex: 0, kpis: getEmptyKPIs() },

    { id: 'vagon_tamir', name: "\"O'zvagonta'mir\" AJ", level: 'subsidiary', supervisorId: 'aj_head', riskGroup: 'high', employees: 600, overallIndex: 0, kpis: getEmptyKPIs() },
    { id: 'konteyner', name: "\"O'ztemiryo'lkontener\" AJ", level: 'subsidiary', supervisorId: 'aj_head', riskGroup: 'medium', employees: 350, overallIndex: 0, kpis: getEmptyKPIs() },

    {
        id: 'energiya_poezd',
        name: "1-son Energiyamontaj poezdi",
        level: 'supervisor',
        supervisorId: 'aj_head',
        riskGroup: 'high',
        employees: 280,
        overallIndex: 0,
        kpis: getEmptyKPIs(),
        profile: 'electric'
    },
    {
        id: 'tashkent_vagon_zavod',
        name: "Toshkent yo'lovchi vagonlarni ta'minlash zavodi",
        level: 'supervisor',
        supervisorId: 'aj_head',
        riskGroup: 'high',
        employees: 520,
        overallIndex: 0,
        kpis: getEmptyKPIs(),
        profile: 'factory'
    },
    {
        id: 'andijon_mex_zavod',
        name: "Andijon mehanika zavodi",
        level: 'supervisor',
        supervisorId: 'aj_head',
        riskGroup: 'high',
        employees: 450,
        overallIndex: 0,
        kpis: getEmptyKPIs(),
        profile: 'factory'
    }
];

// Make globally accessible
window.UZ_RAILWAY_DATA = UZ_RAILWAY_DATA;
