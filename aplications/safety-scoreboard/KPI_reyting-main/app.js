// ===================================
// SUPABASE CONFIGURATION (NBT-KPI)
// ===================================
const SUPABASE_URL = 'https://uqxtzlmdvmseirolfwgq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxeHR6bG1kdm1zZWlyb2xmd2dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NzQ1ODUsImV4cCI6MjA4MDA1MDU4NX0.Hzol82Uz0gxOX1lsgFB-zLmt3uuoRB8Dsrkx6vE9C5k';

// Initialize Supabase
let supabase;
let db;

try {
    if (typeof window.supabase !== 'undefined') {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        db = supabase; // For compatibility
        console.log("✅ Supabase (NBT-KPI) muvaffaqiyatli ulandi!");
    } else {
        console.warn("⚠️ Supabase SDK yuklanmagan. LocalStorage ishlatiladi.");
        db = null;
    }
} catch (error) {
    console.error("❌ Supabase ulanishda xatolik:", error);
    console.warn("⚠️ LocalStorage ishlatiladi.");
    db = null;
}

// ===================================
// KPI Configuration & Weights (15 BAND)
// Xalqaro standartlar: ISO 45001, OSHA, ILO
// O'zbekiston mehnat qonunchiligiga moslashtirilgan
// ===================================
const KPI_CONFIG = {
    ltifr: {
        name: "Baxtsiz hodisalar (LTIFR)",
        weight: 0.40,
        lowerIsBetter: true,
        critical: true,
        icon: "⚠️",
        description: "Lost Time Injury Frequency Rate"
    },
    trir: {
        name: "TRIR / Mikro-jarohatlar",
        weight: 0.10,
        lowerIsBetter: true,
        critical: true,
        icon: "🩹",
        description: "Total Recordable Incident Rate"
    },
    noincident: {
        name: "Bexavfsiz kunlar",
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
    equipment: {
        name: "Uskuna nazorati",
        weight: 0.06,
        lowerIsBetter: false,
        icon: "🔧",
        description: "Rolling stock va uskunalar"
    },
    ppe: {
        name: "SHHV ta'minoti",
        weight: 0.05,
        lowerIsBetter: false,
        icon: "🦺"
    },
    raCoverage: {
        name: "Xavfni baholash",
        weight: 0.05,
        lowerIsBetter: false,
        icon: "🎯"
    },
    prevention: {
        name: "Profilaktika xarajatlari",
        weight: 0.04,
        lowerIsBetter: false,
        icon: "💰",
        description: "CAPEX/OPEX ratio"
    },
    nearMiss: {
        name: "Xabarlar (Near Miss)",
        weight: 0.04,
        lowerIsBetter: false,
        icon: "📢",
        description: "Safety Culture indicator"
    },
    responseTime: {
        name: "Murojaatga reaksiya",
        weight: 0.04,
        lowerIsBetter: false,
        icon: "⏱️"
    },
    inspection: {
        name: "Nazorat rejasi",
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
        name: "Audit samaradorligi",
        weight: 0.02,
        lowerIsBetter: false,
        icon: "✅"
    },
    emergency: {
        name: "Avariya mashqlari",
        weight: 0.02,
        lowerIsBetter: false,
        icon: "🚨"
    },
    violations: {
        name: "Intizomiy buzilishlar",
        weight: 0.02,
        lowerIsBetter: true,
        icon: "🎫"
    }
};

// ===================================
// Global State
// ===================================
let companies = [];
let currentEditId = null;
let comparisonCharts = {};
let selectedOrganizationId = 'all'; // Default: Show all entered companies (with data)

// Initialize Application
// This initialization is moved to the main DOMContentLoaded at the end of the file

function populateProfileSelect() {
    console.log('populateProfileSelect called');
    const select = document.getElementById('company-profile');

    // Use global variable explicitly
    const profiles = window.DEPARTMENT_PROFILES || [];
    console.log('DEPARTMENT_PROFILES (global):', profiles);

    if (!select) {
        console.error('company-profile select not found!');
        return;
    }

    // Clear existing options except the first one
    while (select.options.length > 1) {
        select.remove(1);
    }

    profiles.forEach(profile => {
        const option = document.createElement('option');
        option.value = profile.id;
        option.textContent = profile.name;
        select.appendChild(option);
        console.log('Added profile:', profile.name);
    });

    console.log('Total options:', select.options.length);
}

// ===================================
// KPI Calculator Class
// ===================================
class KPICalculator {
    constructor(companyData) {
        this.company = companyData;
    }

    calculateAccidentSeverity(fatal, severe, group, light) {
        // Penalty points: Fatal=100, Severe=50, Group=40, Light=10
        const penalty = (fatal * 100) + (severe * 50) + (group * 40) + (light * 10);
        return penalty;
    }

    calculateMicroInjury(count) {
        // Rate per 100 employees
        return this.company.employees > 0 ? (count / this.company.employees) * 100 : 0;
    }

    calculateNoincident(days) {
        return (days / 365) * 100;
    }

    calculateTrainingEffectiveness(passed, required) {
        return required > 0 ? (passed / required) * 100 : 0;
    }

    calculateRACoverage(assessed, total) {
        return total > 0 ? (assessed / total) * 100 : 0;
    }

    calculateNearMissCulture(count) {
        // Rate per 100 employees
        return this.company.employees > 0 ? (count / this.company.employees) * 100 : 0;
    }

    calculateResponseIndex(closed, total) {
        return total > 0 ? (closed / total) * 100 : 0;
    }

    calculatePrevention(mmBudget, totalBudget) {
        return totalBudget > 0 ? (mmBudget / totalBudget) * 100 : 0;
    }

    calculatePPECompliance(equipped, required) {
        return required > 0 ? (equipped / required) * 100 : 0;
    }

    calculateHighRiskControl(inspected, totalRisk, authorized, totalStaff) {
        const equipmentPart = totalRisk > 0 ? (inspected / totalRisk) * 100 : 0;
        const staffPart = totalStaff > 0 ? (authorized / totalStaff) * 100 : 0;
        // Weighted: 60% Equipment, 40% Staff
        return (equipmentPart * 0.6) + (staffPart * 0.4);
    }

    calculateInspectionExecution(done, planned) {
        return planned > 0 ? (done / planned) * 100 : 0;
    }

    calculateOccupational(count) {
        return count;
    }

    calculateAuditEffectiveness(issues, totalPoints) {
        return totalPoints > 0 ? (1 - (issues / totalPoints)) * 100 : 0;
    }

    calculateEmergencyPreparedness(participated, planned) {
        return planned > 0 ? (participated / planned) * 100 : 0;
    }

    calculateDisciplineIndex(red, yellow, green) {
        // Penalty points: Red=10, Yellow=3, Green=1
        const penaltyPoints = (red * 10) + (yellow * 3) + (green * 1);
        // Rate per 100 employees
        return this.company.employees > 0 ? (penaltyPoints / this.company.employees) * 100 : 0;
    }
}

// ===================================
// Normalization Functions
// Xalqaro standartlar + O'zbekiston temir yo'l tizimiga moslashtirilgan
// Professional Penalty → Score konversiyasi
// ===================================

// LTIFR = (Lost Time Injuries × 200,000) / Total Hours Worked
// OSHA standart normalizatsiya faktori: 200,000 (100 xodim × 2000 soat/yil)
function calculateLTIFR(lostTimeInjuries, totalHoursWorked) {
    if (totalHoursWorked <= 0) return 0;
    return (lostTimeInjuries * 200000) / totalHoursWorked;
}

// TRIR = (Recordable Incidents × 200,000) / Total Hours Worked
// OSHA standart normalizatsiya faktori: 200,000
function calculateTRIR(recordableIncidents, totalHoursWorked) {
    if (totalHoursWorked <= 0) return 0;
    return (recordableIncidents * 200000) / totalHoursWorked;
}

// Risk-adjusted scoring system
// Har bir korxona uchun risk profili asosida qat'iy minimum talablar
function getRiskProfile(department) {
    const riskClass = window.RISK_CLASSIFICATION[department] || 'MEDIUM';
    return window.RISK_PROFILES[riskClass];
}

// Minimum talablarni tekshirish - xavfni inobatga olgan
function checkMinimumRequirements(scores, department) {
    const risk = getRiskProfile(department);
    const violations = [];

    // CRITICAL SAFETY METRICS - Xavfga asosan qat'iy
    if (scores.ltifr && scores.ltifr < risk.minLTIFR) {
        violations.push({
            metric: 'ltifr',
            required: risk.minLTIFR,
            actual: scores.ltifr,
            penalty: 25  // QATTIQ: 25 ball oyuti (OLD: 15)
        });
    }

    if (scores.trir && scores.trir < risk.minTRIR) {
        violations.push({
            metric: 'trir',
            required: risk.minTRIR,
            actual: scores.trir,
            penalty: 20  // QATTIQ: 20 ball oyuti (OLD: 10)
        });
    }

    // CRITICAL COMPLIANCE METRICS
    if (scores.training && scores.training < risk.minTraining) {
        violations.push({
            metric: 'training',
            required: risk.minTraining,
            actual: scores.training,
            penalty: 15  // QATTIQ: 15 ball oyuti (OLD: 8)
        });
    }

    if (scores.equipment && scores.equipment < risk.minEquipment) {
        violations.push({
            metric: 'equipment',
            required: risk.minEquipment,
            actual: scores.equipment,
            penalty: 15  // QATTIQ: 15 ball oyuti (OLD: 8)
        });
    }

    if (scores.ppe && scores.ppe < risk.minPPE) {
        violations.push({
            metric: 'ppe',
            required: risk.minPPE,
            actual: scores.ppe,
            penalty: 20  // QATTIQ: 20 ball oyuti (OLD: 10)
        });
    }

    if (scores.raCoverage && scores.raCoverage < risk.minRACoverage) {
        violations.push({
            metric: 'raCoverage',
            required: risk.minRACoverage,
            actual: scores.raCoverage,
            penalty: 12  // QATTIQ: 12 ball oyuti (OLD: 7)
        });
    }

    return violations;
}

// Penalty → Score konversiyasi (STRICT - xalqaro standart)
function penaltyToScore(penalty) {
    // STRICTER MODEL - Xavfga amal qilish
    // Hodisa = jarima, jarima juda og'ir cezalanadi
    if (penalty === 0) return 100;
    if (penalty === 1) return 85;      // 1 hodisa jismlani = 85 (30% tushish)
    if (penalty <= 5) return Math.round(85 - (penalty - 1) * (25 / 4)); // 85-60
    if (penalty <= 20) return Math.round(60 - (penalty - 5) * (30 / 15)); // 60-30
    if (penalty <= 50) return Math.round(30 - (penalty - 20) * (20 / 30)); // 30-10
    if (penalty <= 100) return Math.round(10 - (penalty - 50) * (10 / 50)); // 10-0
    return 0;
}

// Z-Score for benchmarking (peer comparison)
function calculateZScore(value, mean, stdDev) {
    if (stdDev === 0) return 0;
    return (value - mean) / stdDev;
}

// Peer Group classification
function getPeerGroup(totalHours, employees) {
    if (totalHours >= 500000 || employees >= 300) return 'A'; // Katta
    if (totalHours >= 100000 || employees >= 100) return 'B'; // O'rta
    return 'C'; // Kichik
}

function normalizeKPI(value, kpiKey) {
    let score = 0;

    switch (kpiKey) {
        case 'ltifr': // Baxtsiz hodisalar og'irligi - ENG MUHIM (45%)
            // Penalty-based scoring system
            // Koeffitsentlar: O'lim=100, Og'ir=50, Guruh=40, Yengil=10
            score = penaltyToScore(value);
            break;

        case 'trir': // TRIR / Mikro-jarohatlar (10%) - STRICTER MODEL
            // 100 xodimga nisbatan jarohatlar
            // TRIR 2.0+ = kritik - RED ZONE
            if (value === 0) {
                score = 100;
            } else if (value <= 0.2) {
                score = 100 - (value * 50); // 100→90 (0→0.2) JUDA QATTIQ
            } else if (value <= 0.5) {
                score = 90 - ((value - 0.2) * 40); // 90→82 (0.2→0.5)
            } else if (value <= 1.0) {
                score = 82 - ((value - 0.5) * 24); // 82→70 (0.5→1.0)
            } else if (value <= 2.0) {
                score = 70 - ((value - 1.0) * 40); // 70→30 (1.0→2.0)
            } else if (value <= 3.0) {
                score = 30 - ((value - 2.0) * 15); // 30→15 (2.0→3.0)
            } else if (value <= 5.0) {
                score = 15 - ((value - 3.0) * 7.5); // 15→0 (3.0→5.0)
            } else {
                score = 0; // 5+ = 0
            }
            break;

        case 'noincident': // Bexavfsiz kunlar (6%)
            // 365 kun = 100%, interpolation
            score = Math.min(100, (value / 365) * 100);
            break;

        case 'training': // O'qitish qamrovi (5%)
        case 'raCoverage': // Xavfni baholash (5%)
        case 'ppe': // SHHV ta'minoti (5%)
        case 'equipment': // Uskuna nazorati (6%)
        case 'inspection': // Nazorat rejasi (3%)
        case 'compliance': // Audit samaradorligi (2%)
        case 'emergency': // Avariya mashqlari (2%)
        case 'responseTime': // Murojaatga reaksiya (3%)
            // Foizli ko'rsatkichlar - to'g'ridan-to'g'ri ball
            score = Math.min(100, Math.max(0, value));
            break;

        case 'nearMiss': // Near Miss xabarlari (4%)
            // Safety Culture indicator - yuqori = yaxshi madaniyat
            // Target: 100 xodimga 5 ta xabar/oy (60 yillik)
            if (value >= 60) {
                score = 100;
            } else if (value >= 40) {
                score = 85 + ((value - 40) / 20) * 15; // 85-100
            } else if (value >= 20) {
                score = 60 + ((value - 20) / 20) * 25; // 60-85
            } else if (value >= 10) {
                score = 40 + ((value - 10) / 10) * 20; // 40-60
            } else if (value >= 5) {
                score = 20 + ((value - 5) / 5) * 20; // 20-40
            } else {
                score = (value / 5) * 20; // 0-20
            }
            break;

        case 'prevention': // Profilaktika xarajatlari (4%)
            // Ideal: 2-5% of total budget
            // CAPEX/OPEX ratio for safety
            if (value >= 2 && value <= 5) {
                score = 100; // Ideal diapazon
            } else if (value >= 1.5 && value < 2) {
                score = 80 + ((value - 1.5) * 40); // 80-100
            } else if (value >= 1 && value < 1.5) {
                score = 60 + ((value - 1) * 40); // 60-80
            } else if (value > 5 && value <= 7) {
                score = 100 - ((value - 5) * 15); // 100-70
            } else if (value < 1) {
                score = value * 60; // 0-60
            } else {
                score = Math.max(0, 70 - ((value - 7) * 10));
            }
            break;

        case 'occupational': // Kasbiy kasalliklar (2%)
            // Har bir kasallik uchun katta jarima
            if (value === 0) {
                score = 100;
            } else if (value === 1) {
                score = 55;
            } else if (value === 2) {
                score = 30;
            } else if (value === 3) {
                score = 15;
            } else {
                score = Math.max(0, 10 - (value - 3) * 3);
            }
            break;

        case 'violations': // Intizomiy buzilishlar (1%)
            // Talon tizimi: Qizil×10 + Sariq×3 + Yashil×1
            // 100 xodimga nisbatan
            if (value === 0) {
                score = 100;
            } else if (value <= 2) {
                score = 95 - (value * 10); // 75-95
            } else if (value <= 5) {
                score = 75 - ((value - 2) * 10); // 45-75
            } else if (value <= 10) {
                score = 45 - ((value - 5) * 6); // 15-45
            } else if (value <= 20) {
                score = 15 - ((value - 10) * 1.5); // 0-15
            } else {
                score = 0;
            }
            break;
    }

    return Math.round(Math.max(0, Math.min(100, score)));
}

// ===================================
// Zone Classification
// ===================================
function getZone(score) {
    if (score >= 80) return { name: 'green', label: '🟢 Yaxshi', class: 'green' };
    if (score >= 50) return { name: 'yellow', label: '🟡 Qoniqarli', class: 'yellow' };
    return { name: 'red', label: '🔴 Xavfli', class: 'red' };
}

// ===================================
// Calculate Overall Index
// ===================================
function calculateOverallIndex(kpiResults, profileId) {
    let totalScore = 0;
    let totalWeight = 0;

    // Get weights for the selected profile, or fallback to default weights from KPI_CONFIG
    const profileWeights = KPI_WEIGHTS[profileId] || {};

    for (const [key, result] of Object.entries(kpiResults)) {
        const config = KPI_CONFIG[key];
        if (config && result.score !== undefined) {
            // Use profile-specific weight if available, otherwise use default
            const weight = profileWeights[key] !== undefined ? profileWeights[key] : config.weight;

            totalScore += result.score * weight;
            totalWeight += weight;
        }
    }

    let weightedScore = totalWeight > 0 ? totalScore / totalWeight : 0;

    // RISK-BASED MINIMUM REQUIREMENTS CHECK
    // Xavfli operatsiyalar uchun qat'iy talablar - offis ishiga teng bo'lib qolish man etiladi
    const kpiValues = {};
    for (const [key, result] of Object.entries(kpiResults)) {
        kpiValues[key] = result.score || 0;
    }

    const violations = checkMinimumRequirements(kpiValues, profileId);
    if (violations.length > 0) {
        // Her xilof uchun ball oyutish
        let minRequirementsPenalty = 0;
        for (const violation of violations) {
            minRequirementsPenalty += violation.penalty;
        }
        // Penalty qo'llash - xavfli operatsiyalar uchun qat'iy
        weightedScore = Math.max(0, weightedScore - minRequirementsPenalty);
    }

    return Math.round(weightedScore * 100) / 100;
}

// ===================================
// Calculate Company KPIs
// ===================================
function calculateCompanyKPIs(formData) {
    const companyData = {
        employees: parseFloat(formData.employees) || 0,
        totalHours: parseFloat(formData.totalHours) || 0
    };

    const calculator = new KPICalculator(companyData);
    const kpiResults = {};

    // Calculate all KPIs
    kpiResults.ltifr = {
        value: calculator.calculateAccidentSeverity(
            parseFloat(formData.fatal) || 0,
            parseFloat(formData.severe) || 0,
            parseFloat(formData.group) || 0,
            parseFloat(formData.light) || 0
        ),
        score: 0
    };
    kpiResults.ltifr.score = normalizeKPI(kpiResults.ltifr.value, 'ltifr');

    kpiResults.trir = {
        value: calculator.calculateMicroInjury(parseFloat(formData.microInjuries) || 0),
        score: 0
    };
    kpiResults.trir.score = normalizeKPI(kpiResults.trir.value, 'trir');

    kpiResults.noincident = {
        value: calculator.calculateNoincident(parseFloat(formData.noincident) || 0),
        score: 0
    };
    kpiResults.noincident.score = normalizeKPI(kpiResults.noincident.value, 'noincident');

    kpiResults.training = {
        value: calculator.calculateTrainingEffectiveness(
            parseFloat(formData.trainingPassed) || 0,
            parseFloat(formData.trainingRequired) || 1
        ),
        score: 0
    };
    kpiResults.training.score = normalizeKPI(kpiResults.training.value, 'training');

    kpiResults.raCoverage = {
        value: calculator.calculateRACoverage(
            parseFloat(formData.assessed) || 0,
            parseFloat(formData.totalWorkplaces) || 1
        ),
        score: 0
    };
    kpiResults.raCoverage.score = normalizeKPI(kpiResults.raCoverage.value, 'raCoverage');

    kpiResults.nearMiss = {
        value: calculator.calculateNearMissCulture(parseFloat(formData.reports) || 0),
        score: 0
    };
    kpiResults.nearMiss.score = normalizeKPI(kpiResults.nearMiss.value, 'nearMiss');

    kpiResults.responseTime = {
        value: calculator.calculateResponseIndex(
            parseFloat(formData.closedIssues) || 0,
            parseFloat(formData.totalIssues) || 1
        ),
        score: 0
    };
    kpiResults.responseTime.score = normalizeKPI(kpiResults.responseTime.value, 'responseTime');

    kpiResults.prevention = {
        value: calculator.calculatePrevention(
            parseFloat(formData.mmBudget) || 0,
            parseFloat(formData.totalBudget) || 1
        ),
        score: 0
    };
    kpiResults.prevention.score = normalizeKPI(kpiResults.prevention.value, 'prevention');

    kpiResults.ppe = {
        value: calculator.calculatePPECompliance(
            parseFloat(formData.ppeEquipped) || 0,
            parseFloat(formData.ppeRequired) || 1
        ),
        score: 0
    };
    kpiResults.ppe.score = normalizeKPI(kpiResults.ppe.value, 'ppe');

    kpiResults.equipment = {
        value: calculator.calculateHighRiskControl(
            parseFloat(formData.equipmentInspected) || 0,
            parseFloat(formData.equipmentTotal) || 1,
            parseFloat(formData.authorizedStaff) || 0,
            parseFloat(formData.totalStaffEquipment) || 1
        ),
        score: 0
    };
    kpiResults.equipment.score = normalizeKPI(kpiResults.equipment.value, 'equipment');

    kpiResults.inspection = {
        value: calculator.calculateInspectionExecution(
            parseFloat(formData.inspectionDone) || 0,
            parseFloat(formData.inspectionPlanned) || 1
        ),
        score: 0
    };
    kpiResults.inspection.score = normalizeKPI(kpiResults.inspection.value, 'inspection');

    kpiResults.occupational = {
        value: calculator.calculateOccupational(parseFloat(formData.occupational) || 0),
        score: 0
    };
    kpiResults.occupational.score = normalizeKPI(kpiResults.occupational.value, 'occupational');

    kpiResults.compliance = {
        value: calculator.calculateAuditEffectiveness(
            parseFloat(formData.auditIssues) || 0,
            parseFloat(formData.auditTotal) || 1
        ),
        score: 0
    };
    kpiResults.compliance.score = normalizeKPI(kpiResults.compliance.value, 'compliance');

    kpiResults.emergency = {
        value: calculator.calculateEmergencyPreparedness(
            parseFloat(formData.emergencyParticipated) || 0,
            parseFloat(formData.emergencyPlanned) || 1
        ),
        score: 0
    };
    kpiResults.emergency.score = normalizeKPI(kpiResults.emergency.value, 'emergency');

    kpiResults.violations = {
        value: calculator.calculateDisciplineIndex(
            parseFloat(formData.ticketRed) || 0,
            parseFloat(formData.ticketYellow) || 0,
            parseFloat(formData.ticketGreen) || 0
        ),
        score: 0
    };
    kpiResults.violations.score = normalizeKPI(kpiResults.violations.value, 'violations');

    return kpiResults;
}

// ===================================
// Company Management
// Company Management (Hybrid: Firebase + LocalStorage)
// ===================================

async function addOrUpdateCompany(formData) {
    console.log("🚀 addOrUpdateCompany ishga tushdi", formData);

    try {
        const kpis = calculateCompanyKPIs(formData);
        const profileId = document.getElementById('company-profile').value;
        const overallIndex = calculateOverallIndex(kpis, profileId);
        const zone = getZone(overallIndex);

        const id = currentEditId || generateId();
        console.log(`📌 ID: ${id} | Edit mode: ${currentEditId ? 'Ha' : "Yo'q"}`);

        // Prepare data for Supabase (snake_case)
        const companyData = {
            id: id,
            name: formData.name,
            level: formData.level,
            parent: formData.parent,
            profile: profileId,
            employees: parseFloat(formData.employees) || 0,
            total_hours: parseFloat(formData.totalHours) || 0,
            kpis: kpis,
            overall_index: overallIndex,
            zone: zone.name,
            date_added: currentEditId
                ? (companies.find(c => c.id === currentEditId)?.dateAdded || new Date().toISOString())
                : new Date().toISOString(),
            raw_data: formData,
            updated_at: new Date().toISOString()
        };

        // Clear edit mode immediately
        const wasEditing = !!currentEditId;
        currentEditId = null;

        if (db) {
            console.log("🔥 Supabase'ga saqlanmoqda...");

            const { data, error } = await supabase
                .from('companies')
                .upsert(companyData, { onConflict: 'id' })
                .select();

            if (error) throw error;

            console.log("✅ Supabase: Muvaffaqiyatli saqlandi!");
            finishSave(wasEditing);
        } else {
            console.warn("⚠️ Supabase ulanmagan. LocalStorage ishlatiladi.");
            // LocalStorage fallback (need to map back to camelCase for local usage)
            const localData = {
                ...companyData,
                totalHours: companyData.total_hours,
                overallIndex: companyData.overall_index,
                dateAdded: companyData.date_added,
                rawData: companyData.raw_data
            };
            saveLocal(localData, wasEditing);
        }

    } catch (err) {
        console.error("❌ addOrUpdateCompany ichida xato:", err);
        alert("Dastur xatosi: " + err.message);
        currentEditId = null; // Reset state
    }
}

function saveLocal(companyData, wasEditing) {
    console.log("💾 LocalStorage ga saqlanmoqda...");

    if (wasEditing) {
        const index = companies.findIndex(c => c.id === companyData.id);
        if (index !== -1) {
            companies[index] = companyData;
            console.log("✏️ Mavjud korxona yangilandi:", companyData.name);
        } else {
            companies.push(companyData);
            console.log("➕ Yangi korxona qo'shildi (edit topilmadi):", companyData.name);
        }
    } else {
        companies.push(companyData);
        console.log("➕ Yangi korxona qo'shildi:", companyData.name);
    }

    localStorage.setItem('mm_companies', JSON.stringify(companies));
    console.log("✅ LocalStorage yangilandi. Jami:", companies.length);
    finishSave(wasEditing);
}

function finishSave(wasEditing = false) {
    console.log("🎯 finishSave:", wasEditing ? "Tahrirlandi" : "Yangi qo'shildi");

    try {
        // 1. Switch tab immediately
        switchTab('dashboard');

        // 2. Update UI
        calculateRankings();
        renderDashboard();

        // 3. Reset form
        resetForm();

        // 4. Show success
        const message = wasEditing
            ? 'Korxona muvaffaqiyatli yangilandi! ✅'
            : 'Korxona muvaffaqiyatli qo\'shildi! ✅';

        if (typeof showNotification === 'function') {
            showNotification(message, 'success');
        }

        console.log("✅ finishSave tugadi");
    } catch (e) {
        console.error("❌ finishSave xatosi:", e);
    }
}

async function deleteCompany(id) {
    if (confirm('Bu korxonani o\'chirmoqchimisiz?')) {
        if (db) {
            try {
                const { error } = await supabase
                    .from('companies')
                    .delete()
                    .eq('id', id);

                if (error) throw error;

                console.log("🗑️ Supabase: O'chirildi!");
                if (typeof showNotification === 'function') showNotification('Korxona o\'chirildi 🗑️', 'warning');

                // Real-time listener will handle UI update, but we can force it locally too
                companies = companies.filter(c => c.id !== id);
                localStorage.setItem('mm_companies', JSON.stringify(companies));
                calculateRankings();
                renderDashboard();

            } catch (err) {
                console.error("❌ O'chirishda xato:", err);
                alert("O'chirishda xatolik: " + err.message);
            }
        } else {
            companies = companies.filter(c => c.id !== id);
            localStorage.setItem('mm_companies', JSON.stringify(companies));
            calculateRankings();
            renderDashboard();
            if (typeof showNotification === 'function') showNotification('Korxona o\'chirildi (Lokal) 🗑️', 'warning');
        }
    }
}

// ===================================
// Data Loading (Hybrid)
// ===================================

async function loadCompanies() {
    console.log("📡 loadCompanies chaqirildi. db:", db ? "Mavjud ✅" : "Yo'q ❌");

    if (db) {
        console.log("🔥 Supabase'dan yuklanmoqda...");

        try {
            // 1. Initial fetch
            const { data, error } = await supabase
                .from('companies')
                .select('*')
                .order('overall_index', { ascending: false });

            if (error) throw error;

            if (data && data.length > 0) {
                // Map Supabase data format to app format if needed
                companies = data.map(c => ({
                    ...c,
                    // Ensure camelCase for app compatibility if DB uses snake_case
                    totalHours: c.total_hours,
                    overallIndex: c.overall_index,
                    dateAdded: c.date_added,
                    rawData: c.raw_data
                }));

                console.log(`✅ Supabase: ${companies.length} ta korxona yuklandi`);
                localStorage.setItem('mm_companies', JSON.stringify(companies));
                refreshUI();
            } else {
                console.warn("⚠️ Supabase bo'sh. LocalStorage tekshirilmoqda...");
                loadLocal();
            }

            // 2. Real-time Subscription
            const channel = supabase
                .channel('companies_realtime')
                .on('postgres_changes',
                    { event: '*', schema: 'public', table: 'companies' },
                    (payload) => {
                        console.log('🔄 Real-time o\'zgarish:', payload);
                        // Oddiy yechim: o'zgarish bo'lsa qayta yuklash
                        // Optimizatsiya uchun faqat o'zgargan qatorni yangilash mumkin
                        loadCompaniesFetchOnly();
                    }
                )
                .subscribe();

            console.log("✅ Real-time kuzatuv yoqildi");

        } catch (error) {
            console.error("❌ Supabase yuklash xatosi:", error);
            console.warn("⚠️ LocalStorage'dan yuklanmoqda...");
            loadLocal();
        }
    } else {
        console.warn("⚠️ Supabase ulanmagan. LocalStorage ishlatiladi.");
        loadLocal();
    }
}

// Helper for real-time updates to avoid re-subscribing
async function loadCompaniesFetchOnly() {
    try {
        const { data, error } = await supabase
            .from('companies')
            .select('*')
            .order('overall_index', { ascending: false });

        if (!error && data) {
            companies = data.map(c => ({
                ...c,
                totalHours: c.total_hours,
                overallIndex: c.overall_index,
                dateAdded: c.date_added,
                rawData: c.raw_data
            }));
            localStorage.setItem('mm_companies', JSON.stringify(companies));
            refreshUI();
            console.log("🔄 Ro'yxat yangilandi");
        }
    } catch (e) {
        console.error("Real-time update error:", e);
    }
}

function loadLocal() {
    console.log("💾 LocalStorage dan yuklash...");
    const saved = localStorage.getItem('mm_companies');
    let localData = [];
    if (saved) {
        try {
            localData = JSON.parse(saved);
        } catch (e) {
            console.error("❌ LocalStorage parse xatosi:", e);
        }
    }

    // Merge logic REMOVED to respect "Only what is saved" rule
    // But if local is completely empty, we load the template (0 scores) so user can start

    if (localData.length === 0) {
        console.log("ℹ️ LocalStorage bo'sh, default shablon yuklanmoqda...");
        companies = window.UZ_RAILWAY_DATA || [];
    } else {
        console.log("💾 LocalStorage ma'lumotlari ishlatilmoqda.");
        companies = localData;
    }

    console.log("✅ Jami korxonalar:", companies.length);
    refreshUI();
}

function refreshUI() {
    console.log("🔄 refreshUI: UI yangilanmoqda...");
    // RECOMPUTE all companies with NEW STRICT scoring model
    if (companies.length > 0 && companies[0].rawData) {
        console.log("🔐 Barcha korxonalarni STRICT modelga qayta hisoblash...");
        recomputeAllCompaniesScores();
    }
    calculateParentCompanyRatings(); // Calculate parent ratings from subsidiaries
    calculateRankings();
    initializeOrganizationFilter(); // Initialize filter selector
    renderDashboard();
    updateUIForRole();
    console.log("✅ UI yangilandi");
}

// Helper: Generate ID
function generateId() {
    return 'comp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
}

function editCompany(id) {
    const company = companies.find(c => c.id === id);
    if (!company) return;

    currentEditId = id;

    // Fill form with company data
    document.getElementById('company-name').value = company.name;
    document.getElementById('company-profile').value = company.profile || '';
    document.getElementById('company-employees').value = company.employees;

    // Set Level and Update Parent Select
    const levelSelect = document.getElementById('company-level');
    if (levelSelect) {
        levelSelect.value = company.level || 'subsidiary';
        // Trigger update to populate parent dropdown
        updateParentSelect();

        // Set Parent after dropdown is populated
        const parentSelect = document.getElementById('company-parent');
        if (parentSelect && company.parent) {
            parentSelect.value = company.parent;
        }
    }

    // Restore raw data if available
    if (company.rawData) {
        const d = company.rawData;

        // KPI 1
        document.getElementById('input-fatal').value = d.fatal || 0;
        document.getElementById('input-severe').value = d.severe || 0;
        document.getElementById('input-group').value = d.group || 0;
        document.getElementById('input-light').value = d.light || 0;

        // KPI 2
        document.getElementById('input-micro-injuries').value = d.microInjuries || 0;

        // KPI 3
        document.getElementById('input-noincident').value = d.noincident || 0;

        // KPI 4
        document.getElementById('input-training-required').value = d.trainingRequired || 0;
        document.getElementById('input-training-passed').value = d.trainingPassed || 0;

        // KPI 5
        document.getElementById('input-assessed').value = d.assessed || 0;
        document.getElementById('input-total-workplaces').value = d.totalWorkplaces || 0;

        // KPI 6
        document.getElementById('input-reports').value = d.reports || 0;

        // KPI 7
        document.getElementById('input-closed-issues').value = d.closedIssues || 0;
        document.getElementById('input-total-issues').value = d.totalIssues || 0;

        // KPI 8
        document.getElementById('input-mm-budget').value = d.mmBudget || 0;
        document.getElementById('input-total-budget').value = d.totalBudget || 0;

        // KPI 9
        document.getElementById('input-ppe-equipped').value = d.ppeEquipped || 0;
        document.getElementById('input-ppe-required').value = d.ppeRequired || 0;

        // KPI 10
        document.getElementById('input-equipment-inspected').value = d.equipmentInspected || 0;
        document.getElementById('input-total-equipment').value = d.equipmentTotal || 0;
        document.getElementById('input-authorized-personnel').value = d.authorizedStaff || 0;
        document.getElementById('input-required-personnel').value = d.totalStaffEquipment || 0;

        // KPI 11
        document.getElementById('input-inspections-conducted').value = d.inspectionDone || 0;
        document.getElementById('input-inspections-planned').value = d.inspectionPlanned || 0;

        // KPI 12
        document.getElementById('input-occupational-diseases').value = d.occupational || 0;

        // KPI 13
        document.getElementById('input-audit-noncompliance').value = d.auditIssues || 0;
        document.getElementById('input-audit-points').value = d.auditTotal || 0;

        // KPI 14
        document.getElementById('input-drills-conducted').value = d.emergencyParticipated || 0;
        document.getElementById('input-drills-planned').value = d.emergencyPlanned || 0;

        // KPI 15
        document.getElementById('input-ticket-red').value = d.ticketRed || 0;
        document.getElementById('input-ticket-yellow').value = d.ticketYellow || 0;
        document.getElementById('input-ticket-green').value = d.ticketGreen || 0;
    }

    document.getElementById('form-title').textContent = '✏️ Korxonani Tahrirlash';
    document.getElementById('save-company-btn').textContent = '💾 Yangilash';
    switchTab('add-company');
}

function resetForm() {
    document.getElementById('company-form').reset();
    currentEditId = null;
    document.getElementById('form-title').textContent = '➕ Yangi Korxona Qo\'shish';
    document.getElementById('save-company-btn').textContent = '💾 Saqlash';

    // Set default values if needed
    document.getElementById('company-profile').value = 'factory';
}

// RECOMPUTE ALL COMPANIES WITH NEW STRICT SCORING
function recomputeAllCompaniesScores() {
    console.log("🔄 Barcha korxonalarning scorelari STRICT modelga qayta hisoblana boshlandi...");

    companies.forEach(company => {
        if (!company.rawData) return; // Skip if no raw data

        const formData = company.rawData;
        const kpiResults = {};

        // Recalculate all KPIs with new strict formulas
        const companyData = {
            employees: parseFloat(company.employees) || 0,
            totalHours: parseFloat(company.totalHours) || 0
        };

        const calculator = new KPICalculator(companyData);

        // LTIFR - NEW STRICT
        kpiResults.ltifr = {
            value: calculator.calculateAccidentSeverity(
                parseFloat(formData.fatal) || 0,
                parseFloat(formData.severe) || 0,
                parseFloat(formData.group) || 0,
                parseFloat(formData.light) || 0
            ),
            score: 0
        };
        kpiResults.ltifr.score = normalizeKPI(kpiResults.ltifr.value, 'ltifr');

        // TRIR - NEW STRICT MODEL
        kpiResults.trir = {
            value: calculator.calculateMicroInjury(parseFloat(formData.microInjuries) || 0),
            score: 0
        };
        kpiResults.trir.score = normalizeKPI(kpiResults.trir.value, 'trir');

        // Rest of KPIs...
        kpiResults.noincident = {
            value: calculator.calculateNoincident(parseFloat(formData.noincident) || 0),
            score: 0
        };
        kpiResults.noincident.score = normalizeKPI(kpiResults.noincident.value, 'noincident');

        kpiResults.training = {
            value: calculator.calculateTrainingEffectiveness(
                parseFloat(formData.trainingPassed) || 0,
                parseFloat(formData.trainingRequired) || 1
            ),
            score: 0
        };
        kpiResults.training.score = normalizeKPI(kpiResults.training.value, 'training');

        kpiResults.raCoverage = {
            value: calculator.calculateRACoverage(
                parseFloat(formData.assessed) || 0,
                parseFloat(formData.totalWorkplaces) || 1
            ),
            score: 0
        };
        kpiResults.raCoverage.score = normalizeKPI(kpiResults.raCoverage.value, 'raCoverage');

        kpiResults.nearMiss = {
            value: calculator.calculateNearMissCulture(parseFloat(formData.reports) || 0),
            score: 0
        };
        kpiResults.nearMiss.score = normalizeKPI(kpiResults.nearMiss.value, 'nearMiss');

        kpiResults.responseTime = {
            value: calculator.calculateResponseIndex(
                parseFloat(formData.closedIssues) || 0,
                parseFloat(formData.totalIssues) || 1
            ),
            score: 0
        };
        kpiResults.responseTime.score = normalizeKPI(kpiResults.responseTime.value, 'responseTime');

        kpiResults.prevention = {
            value: calculator.calculatePrevention(
                parseFloat(formData.mmBudget) || 0,
                parseFloat(formData.totalBudget) || 1
            ),
            score: 0
        };
        kpiResults.prevention.score = normalizeKPI(kpiResults.prevention.value, 'prevention');

        kpiResults.ppe = {
            value: calculator.calculatePPECompliance(
                parseFloat(formData.ppeEquipped) || 0,
                parseFloat(formData.ppeRequired) || 1
            ),
            score: 0
        };
        kpiResults.ppe.score = normalizeKPI(kpiResults.ppe.value, 'ppe');

        kpiResults.equipment = {
            value: calculator.calculateHighRiskControl(
                parseFloat(formData.equipmentInspected) || 0,
                parseFloat(formData.equipmentTotal) || 1,
                parseFloat(formData.authorizedStaff) || 0,
                parseFloat(formData.totalStaffEquipment) || 1
            ),
            score: 0
        };
        kpiResults.equipment.score = normalizeKPI(kpiResults.equipment.value, 'equipment');

        kpiResults.inspection = {
            value: calculator.calculateInspectionExecution(
                parseFloat(formData.inspectionDone) || 0,
                parseFloat(formData.inspectionPlanned) || 1
            ),
            score: 0
        };
        kpiResults.inspection.score = normalizeKPI(kpiResults.inspection.value, 'inspection');

        kpiResults.occupational = {
            value: calculator.calculateOccupational(parseFloat(formData.occupational) || 0),
            score: 0
        };
        kpiResults.occupational.score = normalizeKPI(kpiResults.occupational.value, 'occupational');

        kpiResults.compliance = {
            value: calculator.calculateAuditEffectiveness(
                parseFloat(formData.auditIssues) || 0,
                parseFloat(formData.auditTotal) || 1
            ),
            score: 0
        };
        kpiResults.compliance.score = normalizeKPI(kpiResults.compliance.value, 'compliance');

        kpiResults.emergency = {
            value: calculator.calculateEmergencyPreparedness(
                parseFloat(formData.emergencyParticipated) || 0,
                parseFloat(formData.emergencyPlanned) || 1
            ),
            score: 0
        };
        kpiResults.emergency.score = normalizeKPI(kpiResults.emergency.value, 'emergency');

        kpiResults.violations = {
            value: calculator.calculateDisciplineIndex(
                parseFloat(formData.ticketRed) || 0,
                parseFloat(formData.ticketYellow) || 0,
                parseFloat(formData.ticketGreen) || 0
            ),
            score: 0
        };
        kpiResults.violations.score = normalizeKPI(kpiResults.violations.value, 'violations');

        // Update company KPIs
        company.kpis = kpiResults;

        // Recalculate overall index with NEW STRICT rules
        const overallIndex = calculateOverallIndex(kpiResults, company.profile);
        company.overallIndex = overallIndex;
        company.zone = getZone(overallIndex).name;

        // Update Firebase if connected
        // Update Supabase if connected
        if (db && company.id) {
            supabase.from('companies').update({
                kpis: kpiResults,
                overall_index: overallIndex,
                zone: company.zone,
                updated_at: new Date().toISOString()
            })
                .eq('id', company.id)
                .then(({ error }) => {
                    if (error) console.error("❌ Recompute update error:", error);
                });
        }
    });

    console.log("✅ Barcha korxonalar STRICT modelga qayta hisobland!");
}

function calculateRankings() {
    companies.sort((a, b) => b.overallIndex - a.overallIndex);
    companies.forEach((company, index) => {
        company.rank = index + 1;
    });
}

// Calculate parent company ratings based on subsidiaries
function calculateParentCompanyRatings() {
    // Get all parent companies (supervisors)
    const parents = companies.filter(c => c.level === 'supervisor');

    parents.forEach(parent => {
        // Find all subsidiaries of this parent
        const subsidiaries = companies.filter(c => c.supervisorId === parent.id);

        if (subsidiaries.length > 0) {
            // Calculate average rating from subsidiaries
            const totalIndex = subsidiaries.reduce((sum, sub) => sum + (sub.overallIndex || 0), 0);
            const avgIndex = totalIndex / subsidiaries.length;

            // Update parent's overall index
            parent.overallIndex = avgIndex;
            parent.zone = getZone(avgIndex).name;

            // Also calculate average KPIs
            if (subsidiaries[0].kpis) {
                const avgKPIs = {};
                const kpiKeys = Object.keys(subsidiaries[0].kpis);

                kpiKeys.forEach(key => {
                    const totalScore = subsidiaries.reduce((sum, sub) =>
                        sum + (sub.kpis[key]?.score || 0), 0);
                    avgKPIs[key] = {
                        value: totalScore / subsidiaries.length,
                        score: Math.round(totalScore / subsidiaries.length)
                    };
                });

                parent.kpis = avgKPIs;
            }
        }
    });
}

// ===================================
// Rendering Functions
// ===================================
// OLD renderDashboard REMOVED - Using robust version below (line ~1633)

function renderStatistics(displayCompanies = companies) {
    // Faqat ko'rsatilayotgan korxonalar sonini ko'rsat
    const companyCount = displayCompanies.length;
    document.getElementById('total-companies').textContent = companyCount;

    // Calculate zones only from displayed companies with data
    const companiesWithData = displayCompanies.filter(c => c.overallIndex > 0);

    const greenCount = companiesWithData.filter(c => getZone(c.overallIndex).name === 'green').length;
    const yellowCount = companiesWithData.filter(c => getZone(c.overallIndex).name === 'yellow').length;
    const redCount = companiesWithData.filter(c => getZone(c.overallIndex).name === 'red').length;

    document.getElementById('green-zone-count').textContent = greenCount;
    document.getElementById('yellow-zone-count').textContent = yellowCount;
    document.getElementById('red-zone-count').textContent = redCount;
}

// ... (renderPodium is fine) ...

// ===================================
// Data Generation
// ===================================
function generateSampleData() {
    const baseKPIs = {
        ltifr: { value: 0, score: 100 },
        trir: { value: 0, score: 100 },
        noincident: { value: 365, score: 100 },
        training: { value: 100, score: 100 },
        raCoverage: { value: 100, score: 100 },
        nearMiss: { value: 120, score: 100 },
        responseTime: { value: 100, score: 100 },
        prevention: { value: 5, score: 100 },
        ppe: { value: 100, score: 100 },
        equipment: { value: 100, score: 100 },
        inspection: { value: 100, score: 100 },
        occupational: { value: 0, score: 100 },
        compliance: { value: 100, score: 100 },
        emergency: { value: 100, score: 100 },
        violations: { value: 0, score: 100 }
    };

    // Helper to create a company with slight variations
    const createCompany = (id, name, level, parent, baseScore, employees) => {
        const kpis = JSON.parse(JSON.stringify(baseKPIs));

        // Vary scores slightly based on baseScore
        Object.keys(kpis).forEach(key => {
            const variance = Math.random() * 20 - 10; // +/- 10
            let score = baseScore + variance;
            score = Math.max(0, Math.min(100, score));
            kpis[key].score = Math.round(score);
        });

        // Force some specific issues for realism
        if (baseScore < 60) {
            kpis.ltifr.score = 20; // High severity accident
            kpis.violations.score = 30; // Discipline issues
        } else if (baseScore < 80) {
            kpis.nearMiss.score = 50; // Low reporting culture
        }

        const overallIndex = calculateOverallIndex(kpis, 'factory'); // Use default profile
        const zone = getZone(overallIndex);

        return {
            id, name, level, parent, employees, totalHours: employees * 2000,
            kpis, overallIndex, zone: zone.name, dateAdded: new Date().toISOString(),
            profile: 'factory'
        };
    };

    const companies = [];

    // 1. Management (Headquarters)
    const mgmtId = 'comp_mgmt_01';
    companies.push(createCompany(mgmtId, "O'zbekiston Temir Yo'llari AJ", 'management', null, 95, 5000));

    // 2. Supervisors (Regional)
    const sup1Id = 'comp_sup_01';
    const sup2Id = 'comp_sup_02';
    companies.push(createCompany(sup1Id, "Toshkent MTU", 'supervisor', mgmtId, 88, 1200));
    companies.push(createCompany(sup2Id, "Qo'qon MTU", 'supervisor', mgmtId, 82, 900));

    // 3. Subsidiaries (Factories/Depots)
    // Under Toshkent MTU
    companies.push(createCompany('comp_sub_01', "Toshkent elektr ta'minoti", 'subsidiary', sup1Id, 92, 350));
    companies.push(createCompany('comp_sub_02', "Salor temir yo'l masofasi", 'subsidiary', sup1Id, 75, 200)); // Yellow
    companies.push(createCompany('comp_sub_03', "Toshkent vagon deposi", 'subsidiary', sup1Id, 45, 450)); // Red

    // Under Qo'qon MTU
    companies.push(createCompany('comp_sub_04', "Qo'qon lokomotiv deposi", 'subsidiary', sup2Id, 85, 300));
    companies.push(createCompany('comp_sub_05', "Andijon signalizatsiya", 'subsidiary', sup2Id, 65, 150)); // Yellow

    return companies;
}

function renderPodium(displayCompanies = companies) {
    const podiumSection = document.getElementById('podium-section');

    if (displayCompanies.length === 0) {
        podiumSection.style.display = 'none';
        return;
    }

    podiumSection.style.display = 'flex';
    podiumSection.innerHTML = '';

    const medals = ['🥇', '🥈', '🥉'];
    const places = ['first', 'second', 'third'];

    for (let i = 0; i < Math.min(3, displayCompanies.length); i++) {
        const company = displayCompanies[i];
        const zone = getZone(company.overallIndex);

        const podiumPlace = document.createElement('div');
        podiumPlace.className = `podium-place ${places[i]}`;
        podiumPlace.innerHTML = `
        <div class="podium-medal">${medals[i]}</div>
        <div class="podium-company">${company.name}</div>
        <div class="podium-index">${company.overallIndex.toFixed(1)}</div>
        <div class="podium-base">
            <div class="zone-badge ${zone.class}">${zone.label}</div>
        </div>
    `;

        podiumSection.appendChild(podiumPlace);
    }
}

// The original renderRankingTable function is now integrated into the new renderDashboard.
// Keeping it commented out or removing it depends on whether it's used elsewhere.
// For this change, it's effectively replaced.

function viewCompanyDetails(companyId) {
    const company = companies.find(c => c.id === companyId);
    if (!company) {
        alert('Korxona topilmadi!');
        return;
    }

    const modal = document.getElementById('company-details-modal');
    if (!modal) {
        alert('Modal topilmadi!');
        return;
    }

    const risk = getRiskProfile(company.profile);
    const violations = checkMinimumRequirements(company.kpis || {}, company.profile);

    // Header info
    document.getElementById('detail-company-name').textContent = company.name;
    document.getElementById('detail-profile').textContent = company.profile || '--';
    document.getElementById('detail-risk-level').textContent = risk.name;
    document.getElementById('detail-overall-score').textContent = (company.overallIndex || 0).toFixed(1);
    const zone = getZone(company.overallIndex);
    document.getElementById('detail-zone').innerHTML = zone.label;

    // 15 KPI Breakdown
    const kpiConfig = window.KPI_CONFIG || {};
    const profileWeights = window.KPI_WEIGHTS[company.profile] || {};
    let kpiHTML = '';

    for (const [key, config] of Object.entries(kpiConfig)) {
        const kpiData = company.kpis && company.kpis[key] ? company.kpis[key] : { value: 0, score: 0 };
        const weight = profileWeights[key] || config.weight;
        const score = kpiData.score || 0;
        const percentage = (weight * 100).toFixed(0);
        const displayValue = kpiData.value !== undefined ? (typeof kpiData.value === 'number' ? kpiData.value.toFixed(1) : kpiData.value) : '--';
        const scoreColor = score >= 80 ? '#2d9f5d' : score >= 50 ? '#ffb84d' : '#e74c3c';

        kpiHTML += `
    <div class="kpi-card">
        <div class="kpi-card-header">
            <span class="kpi-icon">${config.icon}</span>
            <span class="kpi-name">${config.name}</span>
        </div>
        <div class="kpi-score">
            <span class="kpi-score-label">Ball:</span>
            <span class="kpi-score-value">${Math.round(score)}</span>
        </div>
        <div class="kpi-progress-bar">
            <div class="kpi-progress-fill" style="width: ${Math.min(100, score)}%; background: ${scoreColor};"></div>
        </div>
        <div class="kpi-weight">
            <span>Vazn: ${percentage}%</span>
            <span>Qiymat: ${displayValue}</span>
        </div>
    </div>
    `;
    }

    document.getElementById('detail-kpi-breakdown').innerHTML = kpiHTML;

    // Requirements Check
    let reqHTML = '';
    if (violations.length === 0) {
        reqHTML = '<div class="requirement-item met"><span class="requirement-icon">✅</span><span class="requirement-text">Barcha minimum talablar bajarilgan</span></div>';
    } else {
        violations.forEach(v => {
            const metricName = window.KPI_CONFIG[v.metric]?.name || v.metric;
            reqHTML += `
        <div class="requirement-item violation">
            <span class="requirement-icon">⚠️</span>
            <span class="requirement-text"><strong>${metricName}:</strong> ${v.actual.toFixed(1)} < ${v.required} kerak (oyuti: -${v.penalty} ball)</span>
        </div>
        `;
        });
    }

    document.getElementById('detail-requirements').innerHTML = reqHTML;
    modal.style.display = 'flex';
}

function closeDetailModal() {
    const modal = document.getElementById('company-details-modal');
    if (modal) modal.style.display = 'none';
}

// ===================================
// Comparison Functions
// ===================================
function updateComparisonSelection() {
    const container = document.getElementById('comparison-selection');
    const emptyState = document.getElementById('comparison-empty');

    if (companies.length < 2) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        document.getElementById('compare-btn').disabled = true;
        return;
    }

    emptyState.style.display = 'none';
    document.getElementById('compare-btn').disabled = false;

    container.innerHTML = companies.map(company => `
    <label class="comparison-checkbox">
        <input type="checkbox" value="${company.id}" class="compare-checkbox">
        <span>${company.name}</span>
    </label>
`).join('');
}

function compareCompanies() {
    const selected = Array.from(document.querySelectorAll('.compare-checkbox:checked')).map(cb => cb.value);

    if (selected.length < 2) {
        alert('Kamida 2 ta korxonani tanlang!');
        return;
    }

    const selectedCompanies = companies.filter(c => selected.includes(c.id));
    renderComparisonTable(selectedCompanies);
    renderComparisonCharts(selectedCompanies);

    document.getElementById('comparison-results').style.display = 'block';
}

function renderComparisonTable(selectedCompanies) {
    const table = document.getElementById('comparison-table');

    let html = '<thead><tr><th>KPI</th>';
    selectedCompanies.forEach(c => {
        html += `<th>${c.name}</th>`;
    });
    html += '</tr></thead><tbody>';

    // Add overall index row
    html += '<tr><td><strong>MM Indeksi</strong></td>';
    const maxIndex = Math.max(...selectedCompanies.map(c => c.overallIndex));
    const minIndex = Math.min(...selectedCompanies.map(c => c.overallIndex));
    selectedCompanies.forEach(c => {
        const isBest = c.overallIndex === maxIndex;
        const isWorst = c.overallIndex === minIndex && selectedCompanies.length > 2;
        html += `<td class="${isBest ? 'best' : isWorst ? 'worst' : ''}">${c.overallIndex.toFixed(1)}</td>`;
    });
    html += '</tr>';

    // Add KPI rows
    for (const [key, config] of Object.entries(KPI_CONFIG)) {
        html += `<tr><td>${config.name}</td>`;

        const scores = selectedCompanies.map(c => c.kpis[key].score);
        const maxScore = Math.max(...scores);
        const minScore = Math.min(...scores);

        selectedCompanies.forEach(c => {
            const score = c.kpis[key].score;
            const isBest = score === maxScore;
            const isWorst = score === minScore && selectedCompanies.length > 2;
            html += `<td class="${isBest ? 'best' : isWorst ? 'worst' : ''}">${score}</td>`;
        });

        html += '</tr>';
    }

    html += '</tbody>';
    table.innerHTML = html;
}

function renderComparisonCharts(selectedCompanies) {
    // Destroy existing charts
    if (comparisonCharts.bar) comparisonCharts.bar.destroy();
    if (comparisonCharts.radar) comparisonCharts.radar.destroy();

    // Bar Chart
    const barCtx = document.getElementById('comparison-chart').getContext('2d');
    const kpiNames = Object.values(KPI_CONFIG).map(c => c.name);

    const datasets = selectedCompanies.map((company, index) => {
        const colors = ['#F56400', '#2d9f5d', '#ffb84d', '#e74c3c', '#3498db'];
        return {
            label: company.name,
            data: Object.keys(KPI_CONFIG).map(key => company.kpis[key].score),
            backgroundColor: colors[index % colors.length],
            borderColor: colors[index % colors.length],
            borderWidth: 2
        };
    });

    comparisonCharts.bar = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: kpiNames,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#222222' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { color: '#555555' },
                    grid: { color: '#e0e0e0' }
                },
                x: {
                    ticks: { color: '#555555' },
                    grid: { color: '#e0e0e0' }
                }
            }
        }
    });

    // Radar Chart
    const radarCtx = document.getElementById('radar-chart').getContext('2d');
    comparisonCharts.radar = new Chart(radarCtx, {
        type: 'radar',
        data: {
            labels: kpiNames,
            datasets: datasets.map(ds => ({
                ...ds,
                fill: true,
                backgroundColor: ds.backgroundColor + '33',
                pointBackgroundColor: ds.backgroundColor,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: ds.backgroundColor
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#222222' }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { color: '#555555', backdropColor: 'transparent' },
                    grid: { color: '#e0e0e0' },
                    pointLabels: { color: '#555555' }
                }
            }
        }
    });
}

// ===================================
// Statistics Charts
// ===================================
function renderStatisticsCharts() {
    if (companies.length === 0) return;

    // Index Distribution
    const indexCtx = document.getElementById('index-distribution-chart')?.getContext('2d');
    if (indexCtx) {
        if (comparisonCharts.indexDist) comparisonCharts.indexDist.destroy();

        comparisonCharts.indexDist = new Chart(indexCtx, {
            type: 'bar',
            data: {
                labels: companies.map(c => c.name),
                datasets: [{
                    label: 'MM Indeksi',
                    data: companies.map(c => c.overallIndex),
                    backgroundColor: companies.map(c => {
                        if (c.zone === 'green') return '#2d9f5d';
                        if (c.zone === 'yellow') return '#ffb84d';
                        return '#e74c3c';
                    })
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#222222' } }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { color: '#555555' },
                        grid: { color: '#e0e0e0' }
                    },
                    x: {
                        ticks: { color: '#555555' },
                        grid: { color: '#e0e0e0' }
                    }
                }
            }
        });
    }

    // Zone Pie Chart
    const pieCtx = document.getElementById('zone-pie-chart')?.getContext('2d');
    if (pieCtx) {
        if (comparisonCharts.zonePie) comparisonCharts.zonePie.destroy();

        const greenCount = companies.filter(c => c.zone === 'green').length;
        const yellowCount = companies.filter(c => c.zone === 'yellow').length;
        const redCount = companies.filter(c => c.zone === 'red').length;

        comparisonCharts.zonePie = new Chart(pieCtx, {
            type: 'doughnut',
            data: {
                labels: ['🟢 Yaxshi', '🟡 Qoniqarli', '🔴 Xavfli'],
                datasets: [{
                    data: [greenCount, yellowCount, redCount],
                    backgroundColor: ['#2d9f5d', '#ffb84d', '#e74c3c']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#222222' } }
                }
            }
        });
    }

    // Average KPI Scores
    const avgCtx = document.getElementById('avg-kpi-chart')?.getContext('2d');
    if (avgCtx && companies.length > 0) {
        if (comparisonCharts.avgKpi) comparisonCharts.avgKpi.destroy();

        const avgScores = {};
        Object.keys(KPI_CONFIG).forEach(key => {
            const scores = companies.map(c => c.kpis[key].score);
            avgScores[key] = scores.reduce((a, b) => a + b, 0) / scores.length;
        });

        comparisonCharts.avgKpi = new Chart(avgCtx, {
            type: 'bar',
            data: {
                labels: Object.values(KPI_CONFIG).map(c => c.name),
                datasets: [{
                    label: 'O\'rtacha ball',
                    data: Object.values(avgScores),
                    backgroundColor: '#F56400'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#222222' } }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { color: '#555555' },
                        grid: { color: '#e0e0e0' }
                    },
                    x: {
                        ticks: { color: '#555555' },
                        grid: { color: '#e0e0e0' }
                    }
                }
            }
        });
    }
}

// ===================================
// Tab Navigation
// ===================================
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');

    if (tabName === 'statistics') {
        setTimeout(renderStatisticsCharts, 100);
    }
}

// ===================================
// Form Handling
// ===================================
function resetForm() {
    document.getElementById('company-form').reset();
    currentEditId = null;
    document.getElementById('form-title').textContent = '➕ Yangi Korxona Qo\'shish';
}

function loadSampleData() {
    document.getElementById('company-name').value = 'Xorazm Metall LLC';
    document.getElementById('company-profile').value = 'factory'; // Default to Factory for sample
    document.getElementById('company-employees').value = '190';
    document.getElementById('company-hours').value = '420000';

    // Detailed inputs
    document.getElementById('input-fatal').value = '0';
    document.getElementById('input-severe').value = '1';
    document.getElementById('input-group').value = '0';
    document.getElementById('input-light').value = '2';

    document.getElementById('input-micro-injuries').value = '7';
    document.getElementById('input-noincident').value = '353';

    document.getElementById('input-training-required').value = '50';
    document.getElementById('input-training-passed').value = '48';

    document.getElementById('input-assessed').value = '45';
    document.getElementById('input-total-workplaces').value = '50';

    document.getElementById('input-reports').value = '60';

    document.getElementById('input-closed-issues').value = '35';
    document.getElementById('input-total-issues').value = '40';

    document.getElementById('input-mm-budget').value = '420';
    document.getElementById('input-total-budget').value = '18200';

    document.getElementById('input-ppe-equipped').value = '188';
    document.getElementById('input-ppe-required').value = '190';

    document.getElementById('input-equipment-inspected').value = '14';
    document.getElementById('input-total-equipment').value = '15'; // Updated ID
    document.getElementById('input-authorized-personnel').value = '28'; // Updated ID
    document.getElementById('input-required-personnel').value = '30'; // Updated ID

    document.getElementById('input-inspections-conducted').value = '26'; // Updated ID
    document.getElementById('input-inspections-planned').value = '30'; // Updated ID

    document.getElementById('input-occupational-diseases').value = '1'; // Updated ID

    document.getElementById('input-audit-noncompliance').value = '11'; // Updated ID
    document.getElementById('input-audit-points').value = '120'; // Updated ID

    document.getElementById('input-drills-conducted').value = '162'; // Updated ID
    document.getElementById('input-drills-planned').value = '180'; // Updated ID

    document.getElementById('input-ticket-red').value = '1';
    document.getElementById('input-ticket-yellow').value = '3';
    document.getElementById('input-ticket-green').value = '8';
}

// ===================================
// LocalStorage
// ===================================
function saveToLocalStorage() {
    localStorage.setItem('mm_companies', JSON.stringify(companies));
}

// This function is now handled by the hybrid version above (lines 525-567)
// Removed duplicate to prevent conflicts

// ===================================
// Form Helpers
// ===================================
function updateParentSelect() {
    const levelSelect = document.getElementById('company-level');
    const parentSelect = document.getElementById('company-parent');
    const parentGroup = document.getElementById('parent-select-group');

    if (!levelSelect || !parentSelect) return;

    const level = levelSelect.value;

    // Hide parent select for management level
    if (level === 'management') {
        parentGroup.style.display = 'none';
        return;
    }

    parentGroup.style.display = 'block';

    // Use EXACT SAME structure data as filter (UZ_RAILWAY_DATA)
    const structureData = window.UZ_RAILWAY_DATA || [];

    // Clear and rebuild using SAME logic as createOrganizationSelector
    parentSelect.innerHTML = '<option value="">Tanlang...</option>';

    if (level === 'supervisor') {
        // Supervisors can report to Management
        const management = structureData.filter(c => c.level === 'management');
        if (management.length > 0) {
            const group = document.createElement('optgroup');
            group.label = "🏛️ Boshqaruv";
            management.forEach(org => {
                const option = document.createElement('option');
                option.value = org.id;
                option.textContent = org.name;
                group.appendChild(option);
            });
            parentSelect.appendChild(group);
        }

    } else if (level === 'subsidiary') {
        // Subsidiaries report to Supervisors - USE EXACT SAME GROUPING AS FILTER
        const supervisors = structureData.filter(c => c.level === 'supervisor');

        // Group by parent (same as filter.js)
        const supervisorsByParent = {};
        supervisors.forEach(org => {
            const parentId = org.supervisorId || 'other';
            if (!supervisorsByParent[parentId]) {
                supervisorsByParent[parentId] = [];
            }
            supervisorsByParent[parentId].push(org);
        });

        // Add "Yuqori Tashkilotlar" group
        const group = document.createElement('optgroup');
        group.label = "🏭 Yuqori Tashkilotlar";

        // Direct AJ Supervisors
        if (supervisorsByParent['aj_head']) {
            supervisorsByParent['aj_head'].forEach(org => {
                const option = document.createElement('option');
                option.value = org.id;
                option.textContent = `  📍 ${org.name}`;
                group.appendChild(option);
            });
        }

        parentSelect.appendChild(group);

        // Infrastructure MTUs (under infra_aj) - with separator
        if (supervisorsByParent['infra_aj']) {
            const separator = document.createElement('option');
            separator.disabled = true;
            separator.textContent = "─── Temiryo'linfratuzilma ───";
            parentSelect.appendChild(separator);

            supervisorsByParent['infra_aj'].forEach(org => {
                const option = document.createElement('option');
                option.value = org.id;
                option.textContent = `    🚉 ${org.name}`;
                parentSelect.appendChild(option);
            });
        }
    }
}

// Initialize form listeners
document.addEventListener('DOMContentLoaded', () => {
    const levelSelect = document.getElementById('company-level');
    if (levelSelect) {
        levelSelect.addEventListener('change', updateParentSelect);
        // Call immediately to populate on page load
        updateParentSelect();
    }
});

// ===================================
// Export/Import
// ===================================
function exportData() {
    const data = {
        companies: companies,
        exportDate: new Date().toISOString(),
        version: '2.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MM_Reyting_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importData() {
    document.getElementById('file-input').click();
}

// ===================================
// Event Listeners & Initialization
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Form submission
    const form = document.getElementById('company-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const employeesCount = parseInt(document.getElementById('company-employees').value) || 0;

            const formData = {
                name: document.getElementById('company-name').value,
                level: document.getElementById('company-level').value,
                parent: document.getElementById('company-parent').value,
                employees: employeesCount,
                totalHours: employeesCount * 1820,

                // KPI 1
                fatal: document.getElementById('input-fatal').value,
                severe: document.getElementById('input-severe').value,
                group: document.getElementById('input-group').value,
                light: document.getElementById('input-light').value,

                // KPI 2
                microInjuries: document.getElementById('input-micro-injuries').value,

                // KPI 3
                noincident: document.getElementById('input-noincident').value,

                // KPI 4
                trainingRequired: document.getElementById('input-training-required').value,
                trainingPassed: document.getElementById('input-training-passed').value,

                // KPI 5
                assessed: document.getElementById('input-assessed').value,
                totalWorkplaces: document.getElementById('input-total-workplaces').value,

                // KPI 6
                reports: document.getElementById('input-reports').value,

                // KPI 7
                closedIssues: document.getElementById('input-closed-issues').value,
                totalIssues: document.getElementById('input-total-issues').value,

                // KPI 8
                mmBudget: document.getElementById('input-mm-budget').value,
                totalBudget: document.getElementById('input-total-budget').value,

                // KPI 9
                ppeEquipped: document.getElementById('input-ppe-equipped').value,
                ppeRequired: document.getElementById('input-ppe-required').value,

                // KPI 10
                equipmentInspected: document.getElementById('input-equipment-inspected').value,
                equipmentTotal: document.getElementById('input-total-equipment').value,
                authorizedStaff: document.getElementById('input-authorized-personnel').value,
                totalStaffEquipment: document.getElementById('input-required-personnel').value,

                // KPI 11
                inspectionDone: document.getElementById('input-inspections-conducted').value,
                inspectionPlanned: document.getElementById('input-inspections-planned').value,

                // KPI 12
                occupational: document.getElementById('input-occupational-diseases').value,

                // KPI 13
                auditIssues: document.getElementById('input-audit-noncompliance').value,
                auditTotal: document.getElementById('input-audit-points').value,

                // KPI 14
                emergencyParticipated: document.getElementById('input-drills-conducted').value,
                emergencyPlanned: document.getElementById('input-drills-planned').value,

                // KPI 15
                ticketRed: document.getElementById('input-ticket-red').value,
                ticketYellow: document.getElementById('input-ticket-yellow').value,
                ticketGreen: document.getElementById('input-ticket-green').value
            };

            addOrUpdateCompany(formData);
        });
    }

    // Buttons
    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            resetForm();
            switchTab('dashboard');
        });
    }

    const compareBtn = document.getElementById('compare-btn');
    if (compareBtn) compareBtn.addEventListener('click', compareCompanies);

    const exportBtn = document.getElementById('export-all-btn');
    if (exportBtn) exportBtn.addEventListener('click', exportData);

    const importBtn = document.getElementById('import-btn');
    if (importBtn) importBtn.addEventListener('click', importData);

    const fileInput = document.getElementById('file-input');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const data = JSON.parse(event.target.result);
                        if (data.companies) {
                            companies = data.companies;
                            // For Firebase, we might need to loop and save each, but for now let's just render
                            // Or warn user that import only works locally for now
                            alert("Import qilingan ma'lumotlar faqat lokal ko'rinadi. Saqlash uchun har birini tahrirlab saqlash kerak.");
                            renderDashboard();
                            switchTab('dashboard');
                        }
                    } catch (error) {
                        alert('Fayl formatida xatolik!');
                    }
                };
                reader.readAsText(file);
            }
        });
    }

    // Initialize
    initializeTabs();
    populateProfileSelect();
    updateParentSelect();
    loadCompanies(); // This will call refreshUI which includes renderDashboard

    console.log('MM Ko\'p Korxonali Reyting Tizimi yuklandi ✅');
});

// ===================================
// Global Rendering Functions
// ===================================

// ===================================
// ROBUST FILTERING & RENDERING SYSTEM
// ===================================

// 1. Clear and Simple Filtering Logic
// Faqat ma'lumot kiritilgan korxonalarni ko'rsatadi - ierarxik drill-down bilan
function getFilteredCompanies() {
    const orgId = selectedOrganizationId;
    const structureData = window.UZ_RAILWAY_DATA || [];

    console.log(`🔍 Filter: "${orgId}", Companies count: ${companies.length}`);

    // Helper: Ma'lumot kiritilganligini tekshirish
    const hasData = (company) => {
        if (!company) return false;
        if ((company.overallIndex || 0) > 0) return true;
        if (company.kpis) {
            return Object.values(company.kpis).some(kpi => (kpi.score || 0) > 0);
        }
        return false;
    };

    // Helper: Ota korxona yoki bolalarida ma'lumot bormi
    const hasDataOrChildren = (parentId) => {
        // Parent o'zida ma'lumot bor
        const parent = companies.find(c => c.id === parentId);
        if (parent && hasData(parent)) return true;
        // Yoki bolalarida ma'lumot bor
        return companies.some(c => c.supervisorId === parentId && hasData(c));
    };

    // Ma'lumot kiritilgan korxonalarni ajratib olamiz
    const companiesWithData = companies.filter(hasData);
    console.log(`📊 Companies with data: ${companiesWithData.length}`);

    // CASE 1: Show ALL companies with data (default) - sorted by index
    if (!orgId || orgId === 'all') {
        if (companiesWithData.length > 0) {
            console.log(`✅ Showing all ${companiesWithData.length} companies with data`);
            return companiesWithData.sort((a, b) => (b.overallIndex || 0) - (a.overallIndex || 0));
        }
        console.log(`⚠️ No companies with data`);
        return [];
    }

    // CASE 2: Filter by organization
    // Birinchi structureData dan, keyin companies dan qidiramiz
    let selectedOrg = structureData.find(c => c.id === orgId);
    if (!selectedOrg) {
        selectedOrg = companies.find(c => c.id === orgId);
    }

    // CASE 2a: "O'zbekiston Temir Yo'llari AJ" selected - show supervisors (structure-based)
    if (orgId === 'aj_head') {
        // Structure dan supervisorlarni olamiz va bolalari bor supervisorlarni filtrlash
        const structureSupervisors = structureData.filter(c =>
            c.level === 'supervisor' && c.supervisorId === 'aj_head'
        );

        // Har bir supervisor uchun bolalarida ma'lumot bormi tekshiramiz
        const supervisorsWithChildren = structureSupervisors.filter(sup =>
            hasDataOrChildren(sup.id)
        );

        // Companies dan supervisorlar bilan birlashtirish (aggregate data uchun)
        const result = supervisorsWithChildren.map(structSup => {
            const liveSup = companies.find(c => c.id === structSup.id);
            if (liveSup && hasData(liveSup)) {
                return liveSup; // Live data bor
            }
            // Bolalardan aggregate qilamiz
            const children = companiesWithData.filter(c => c.supervisorId === structSup.id);
            if (children.length > 0) {
                const avgIndex = children.reduce((sum, c) => sum + (c.overallIndex || 0), 0) / children.length;
                return { ...structSup, overallIndex: Math.round(avgIndex), aggregated: true, childCount: children.length };
            }
            return null;
        }).filter(Boolean);

        console.log(`✅ Showing ${result.length} supervisors under AJ`);
        return result.sort((a, b) => (b.overallIndex || 0) - (a.overallIndex || 0));
    }

    // CASE 2b: Parent company (supervisor/MTU) selected - show children with data
    if (selectedOrg && (selectedOrg.level === 'supervisor' || selectedOrg.level === 'management')) {
        // 1. Avval supervisorId bo'yicha to'g'ridan-to'g'ri qidiramiz
        let childrenWithData = companiesWithData.filter(c => c.supervisorId === orgId);

        // 2. Agar supervisorId bo'yicha topilmasa, nom bo'yicha qidiramiz
        if (childrenWithData.length === 0) {
            // Structure dan bu supervisorga tegishli bolalarni nomlarini olamiz
            const structChildren = structureData.filter(c => c.supervisorId === orgId);
            const structChildNames = structChildren.map(c => c.name.toLowerCase());

            // Parent nomiga oid kalitlar
            const orgName = selectedOrg.name.toLowerCase();
            const keywords = orgName
                .replace(/['"]/g, '')
                .split(/\s+/)
                .filter(w => w.length > 3 && !['mtu', 'aj', 'filial', 'the'].includes(w.toLowerCase()));

            // Nom bo'yicha moslik qidirish
            childrenWithData = companiesWithData.filter(company => {
                const companyName = company.name.toLowerCase();
                // Structure child nomlari bilan solishtiramiz
                if (structChildNames.some(scn => companyName.includes(scn) || scn.includes(companyName))) {
                    return true;
                }
                // Yoki parent kalit so'zlari bilan
                return keywords.some(kw => companyName.includes(kw));
            });

            if (childrenWithData.length > 0) {
                console.log(`✅ Showing ${childrenWithData.length} name-matched subsidiaries under "${selectedOrg.name}"`);
            }
        }

        if (childrenWithData.length > 0) {
            console.log(`✅ Showing ${childrenWithData.length} subsidiaries under "${selectedOrg.name}"`);
            return childrenWithData.sort((a, b) => (b.overallIndex || 0) - (a.overallIndex || 0));
        }

        // 3. Structure dan bolalarni ham tekshiramiz (live data bilan birlashtirish)
        const structChildren = structureData.filter(c => c.supervisorId === orgId);
        const structChildrenWithData = structChildren.filter(sc => {
            const live = companies.find(c => c.id === sc.id || c.name === sc.name);
            return live && hasData(live);
        }).map(sc => {
            const live = companies.find(c => c.id === sc.id || c.name === sc.name);
            return live || sc;
        });

        if (structChildrenWithData.length > 0) {
            console.log(`✅ Showing ${structChildrenWithData.length} structure children under "${selectedOrg.name}"`);
            return structChildrenWithData.sort((a, b) => (b.overallIndex || 0) - (a.overallIndex || 0));
        }

        console.log(`⚠️ No subsidiaries with data for "${selectedOrg.name}"`);
        return [];
    }

    // CASE 2c: Children by supervisorId - direct match
    const childrenWithData = companiesWithData.filter(c => c.supervisorId === orgId);
    if (childrenWithData.length > 0) {
        console.log(`✅ Found ${childrenWithData.length} children with data for "${orgId}"`);
        return childrenWithData.sort((a, b) => (b.overallIndex || 0) - (a.overallIndex || 0));
    }

    // CASE 3: Single company - if it has data
    const companyFromDB = companies.find(c => c.id === orgId);
    if (companyFromDB && hasData(companyFromDB)) {
        console.log(`✅ Showing single company: "${companyFromDB.name}"`);
        return [companyFromDB];
    }

    // CASE 4: No match - show all with data
    console.log(`⚠️ No match for "${orgId}", showing all with data`);
    return companiesWithData;
}

// 2. Main Render Function
function renderDashboard() {
    // Get filtered data
    const displayCompanies = getFilteredCompanies();
    console.log(`📊 Render Dashboard: ${displayCompanies.length} companies for filter '${selectedOrganizationId}'`);

    // Update UI components
    renderStatistics(displayCompanies);
    renderPodium(displayCompanies);
    renderRankingTable(displayCompanies);

    updateComparisonSelection();
    renderStatisticsCharts(displayCompanies);
    renderRiskAnalysis(displayCompanies);
}

// 3. Robust Table Rendering
function renderRankingTable(displayCompanies) {
    // Safety check: if argument is missing, use global companies
    const data = displayCompanies || companies;

    const tbody1 = document.getElementById('ranking-tbody');
    const tbody2 = document.getElementById('ranking-table-body');
    const emptyState = document.getElementById('empty-state');

    // Clear existing content
    if (tbody1) tbody1.innerHTML = '';
    if (tbody2) tbody2.innerHTML = '';

    // Handle Empty State
    if (!data || data.length === 0) {
        if (tbody2) tbody2.innerHTML = '<tr><td colspan="6" class="empty-msg">Ma\'lumotlar yo\'q. Korxona qo\'shing.</td></tr>';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    // Hide empty state
    if (emptyState) emptyState.style.display = 'none';

    // Sort by score descending
    const sortedCompanies = [...data].sort((a, b) => b.overallIndex - a.overallIndex);

    // Generate HTML
    const tableHTML = sortedCompanies.map((company, index) => {
        const zone = getZone(company.overallIndex);
        return `
    <tr>
        <td>
            <div class="rank-badge ${index < 3 ? 'top3' : ''}">${index + 1}</div>
        </td>
        <td>
            <div class="company-info">
                <div class="company-name">${company.name}</div>
                <div class="company-meta">${company.profile || 'Korxona'}</div>
            </div>
        </td>
        <td>${company.employees}</td>
        <td>
            <div class="index-display">${company.overallIndex.toFixed(1)}</div>
        </td>
        <td><span class="zone-badge ${zone.class}">${zone.label}</span></td>
        <td>
            <div class="action-btns">
                <button class="btn-icon" onclick="viewCompanyDetails('${company.id}')" title="Ko'rish">👁️</button>
                <button class="btn-icon" onclick="editCompany('${company.id}')" title="Tahrirlash">✏️</button>
                <button class="btn-icon" onclick="deleteCompany('${company.id}')" title="O'chirish">🗑️</button>
            </div>
        </td>
    </tr>
    `;
    }).join('');

    // Inject HTML
    if (tbody1) tbody1.innerHTML = tableHTML;
    if (tbody2) tbody2.innerHTML = tableHTML;
}

function renderRiskAnalysis(displayCompanies = companies) {
    const container = document.getElementById('risk-analysis-container');
    if (!container) return;

    if (displayCompanies.length === 0) {
        container.innerHTML = '<div class="empty-state">Tahlil qilish uchun korxonalar mavjud emas.</div>';
        return;
    }

    // Re-calculate zones to be safe
    const redCompanies = displayCompanies.filter(c => getZone(c.overallIndex).name === 'red');
    const yellowCompanies = displayCompanies.filter(c => getZone(c.overallIndex).name === 'yellow');
    const greenCompanies = displayCompanies.filter(c => getZone(c.overallIndex).name === 'green');

    let html = `
<div class="risk-dashboard">
    <div class="risk-column red-column">
        <h3>🔴 Yuqori Xavf (${redCompanies.length})</h3>
        <div class="risk-list">
            ${redCompanies.length ? redCompanies.map(c => createRiskCard(c)).join('') : '<p class="empty-msg">Toza</p>'}
        </div>
    </div>
    <div class="risk-column yellow-column">
        <h3>🟡 O'rta Xavf (${yellowCompanies.length})</h3>
        <div class="risk-list">
            ${yellowCompanies.length ? yellowCompanies.map(c => createRiskCard(c)).join('') : '<p class="empty-msg">Toza</p>'}
        </div>
    </div>
     <div class="risk-column green-column">
        <h3>🟢 Past Xavf (${greenCompanies.length})</h3>
        <div class="risk-list">
            ${greenCompanies.length ? greenCompanies.map(c => createRiskCard(c)).join('') : '<p class="empty-msg">Toza</p>'}
        </div>
    </div>
</div>
`;

    container.innerHTML = html;
}

function createRiskCard(company) {
    // Find worst KPIs (lowest scores)
    const worstKPIs = Object.entries(company.kpis)
        .sort(([, a], [, b]) => a.score - b.score)
        .slice(0, 3);

    return `
<div class="risk-card">
    <div class="risk-header">
        <strong>${company.name}</strong>
        <span class="risk-score">${company.overallIndex.toFixed(1)}</span>
    </div>
    <div class="worst-kpis">
        <small>Muammoli sohalar:</small>
        <ul>
            ${worstKPIs.map(([key, val]) => `
                <li>${KPI_CONFIG[key].name}: <strong>${val.score}</strong></li>
            `).join('')}
        </ul>
    </div>
    <button class="btn-sm btn-outline" onclick="viewCompanyDetails('${company.id}')">Tahlil</button>
</div>
`;
}

function exportTableToExcel(tableId, filename = 'reyting_jadvali') {
    const table = document.getElementById(tableId);
    if (!table) return;

    let downloadLink;
    const dataType = 'application/vnd.ms-excel';
    const tableHTML = table.outerHTML.replace(/ /g, '%20');

    filename = filename ? filename + '.xls' : 'excel_data.xls';

    downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);

    if (navigator.msSaveOrOpenBlob) {
        var blob = new Blob(['\ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob(blob, filename);
    } else {
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
        downloadLink.download = filename;
        downloadLink.click();
    }
}

// renderDashboard now includes all necessary renders
// No override needed - integrated directly

function initializeTabs() {
    // Set default tab
    switchTab('dashboard');
}

function populateProfileSelect() {
    // This function ensures the profile select is populated correctly
    // Currently profiles are hardcoded in HTML, but we can enhance this later
    // For now, it's a placeholder to prevent errors
}

// ===================================
// Organization Filtering Functions
// ===================================

function initializeOrganizationFilter() {
    const container = document.getElementById('organization-filter-container');
    if (!container) return;

    // Use Firebase/Database companies if available, otherwise use structure
    // This ensures filter shows actual saved organizations
    const structureData = window.UZ_RAILWAY_DATA || [];
    const dataSource = companies.length > 0 ? companies : structureData;

    // Create selector HTML using actual database data
    container.innerHTML = createOrganizationSelector(dataSource);

    // Attach event listener
    const select = document.getElementById('org-filter');
    if (select) {
        // Set default value to 'all' to show all entered companies
        select.value = selectedOrganizationId || 'all';

        select.addEventListener('change', (e) => {
            selectedOrganizationId = e.target.value;
            applyOrganizationFilter();
        });
    }
}

function applyOrganizationFilter() {
    console.log('🔍 Filtrlash:', selectedOrganizationId);

    // Update ranking title and context
    updateRankingContext();

    // Re-render dashboard with filtered data
    renderDashboard();
}

function updateRankingContext() {
    const titleEl = document.getElementById('ranking-title');
    const contextEl = document.getElementById('ranking-context');

    if (!titleEl || !contextEl) return;

    // Look up in structure data first (for static info like name), then in loaded companies
    const structureData = window.UZ_RAILWAY_DATA || [];
    const selectedOrg = structureData.find(c => c.id === selectedOrganizationId) || companies.find(c => c.id === selectedOrganizationId);

    const context = getRankingContext(selectedOrg);

    // Update title
    titleEl.textContent = context.title;

    // Update context box
    if (selectedOrganizationId === 'all') {
        contextEl.classList.remove('active');
    } else {
        contextEl.classList.add('active');
        contextEl.innerHTML = `
        <h3>
            📊 ${context.title}
            <span class="context-badge">${context.level === 'supervisor' ? 'Yuqori tashkilotlar' : 'Korxonalar'}</span>
        </h3>
        <p>${context.description}</p>
    `;
    }
}

// OLD getFilteredCompanies REMOVED - Using integrated version above


// ===================================
// Data Reset Function
// ===================================
function resetData() {
    if (confirm("Diqqat! Barcha lokal ma'lumotlar o'chiriladi va standart holatga qaytariladi. Davom etasizmi?")) {
        localStorage.removeItem('mm_companies');
        location.reload();
    }
}
