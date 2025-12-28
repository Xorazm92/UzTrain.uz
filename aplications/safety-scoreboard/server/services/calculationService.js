import { RISK_PROFILES, RISK_CLASSIFICATION, KPI_CONFIG, KPI_WEIGHTS } from '../config/kpiConfig.js';

// Helper: Calculate accident severity based on input counts
function calculateAccidentSeverity(fatal, severe, group, light) {
    return (fatal * 100) + (severe * 50) + (group * 40) + (light * 10);
}

// Helper: Get Risk Profile
function getRiskProfile(departmentId) {
    const riskClass = RISK_CLASSIFICATION[departmentId] || 'MEDIUM';
    return RISK_PROFILES[riskClass];
}

// Helper: Penalty to Score Conversion
function penaltyToScore(penalty) {
    if (penalty === 0) return 100;
    if (penalty === 1) return 85;
    if (penalty <= 5) return Math.round(85 - (penalty - 1) * (25 / 4));
    if (penalty <= 20) return Math.round(60 - (penalty - 5) * (30 / 15));
    if (penalty <= 50) return Math.round(30 - (penalty - 20) * (20 / 30));
    if (penalty <= 100) return Math.round(10 - (penalty - 50) * (10 / 50));
    return 0;
}

// Normalize KPI values to scores (0-100)
function normalizeKPI(value, kpiKey) {
    let score = 0;

    switch (kpiKey) {
        case 'ltifr':
            score = penaltyToScore(value);
            break;

        case 'hseStaffing':
            // If < 50% -> 0 score, >= 100% -> 100 score
            if (value >= 100) {
                score = 100;
            } else if (value < 50) {
                score = 0;
            } else {
                score = (value - 50) * 2;
            }
            break;

        case 'noincident':
            score = Math.min(100, (value / 365) * 100);
            break;

        case 'training':
        case 'workplaceAssessment':
        case 'ppe':
        case 'equipment':
        case 'inspection':
        case 'compliance':
        case 'emergency':
            score = Math.min(100, Math.max(0, value));
            break;

        case 'workStoppage':
            // Base 50, value can be negative or positive offset
            score = 50 + value;
            break;

        case 'insurance':
            score = 100 - value;
            break;

        case 'prevention':
            if (value >= 2 && value <= 5) score = 100;
            else if (value >= 1.5 && value < 2) score = 80 + ((value - 1.5) * 40);
            else if (value >= 1 && value < 1.5) score = 60 + ((value - 1) * 40);
            else if (value > 5 && value <= 7) score = 100 - ((value - 5) * 15);
            else if (value < 1) score = value * 60;
            else score = Math.max(0, 70 - ((value - 7) * 10));
            break;

        case 'occupational':
            if (value === 0) score = 100;
            else if (value === 1) score = 55;
            else if (value === 2) score = 30;
            else if (value === 3) score = 15;
            else score = Math.max(0, 10 - (value - 3) * 3);
            break;

        case 'violations':
            if (value === 0) score = 100;
            else if (value <= 2) score = 95 - (value * 10);
            else if (value <= 5) score = 75 - ((value - 2) * 10);
            else if (value <= 10) score = 45 - ((value - 5) * 6);
            else if (value <= 20) score = 15 - ((value - 10) * 1.5);
            else score = 0;
            break;

        default:
            score = Math.min(100, Math.max(0, value));
    }

    return Math.round(Math.max(0, Math.min(100, score)));
}

// Check Minimum Requirements (Critical violations)
function checkMinimumRequirements(scores, departmentId) {
    const risk = getRiskProfile(departmentId);
    const violations = [];

    // Map metric names to risk profile properties
    const checks = [
        { metric: 'ltifr', min: risk.minLTIFR, penalty: 25 },
        { metric: 'hseStaffing', min: risk.minHSEStaffing, penalty: 20 },
        { metric: 'training', min: risk.minTraining, penalty: 15 },
        { metric: 'equipment', min: risk.minEquipment, penalty: 15 },
        { metric: 'ppe', min: risk.minPPE, penalty: 20 },
        { metric: 'workplaceAssessment', min: risk.minRACoverage, penalty: 12 }
    ];

    for (const check of checks) {
        if (scores[check.metric] !== undefined && scores[check.metric] < check.min) {
            violations.push({
                metric: check.metric,
                required: check.min,
                actual: scores[check.metric],
                penalty: check.penalty
            });
        }
    }

    return violations;
}

/**
 * Calculates all KPI Scores and the Final Rating for a company logic.
 * @param {Object} formData Raw input data (accidents, counts, budgets etc.)
 * @param {String} departmentId 'locomotive', 'wagon', etc.
 */
export function calculateCompanyRating(formData, departmentId) {
    const kpiResults = {};
    const employees = formData.employees || 0;

    // 1. Calculate Raw Values (Complex Calcs)

    // LTIFR (Accident Severity)
    const severityVal = calculateAccidentSeverity(
        formData.fatal || 0,
        formData.severe || 0,
        formData.group || 0,
        formData.light || 0
    );
    kpiResults.ltifr = { value: severityVal, score: normalizeKPI(severityVal, 'ltifr') };

    // HSE Staffing
    const hseVal = (formData.hseStaffRequired > 0) ? (formData.hseStaffActual / formData.hseStaffRequired) * 100 : 0;
    kpiResults.hseStaffing = { value: hseVal, score: normalizeKPI(hseVal, 'hseStaffing') };

    // No Incident
    const noIncVal = ((formData.noincident || 0) / 365) * 100;
    kpiResults.noincident = { value: noIncVal, score: normalizeKPI(noIncVal, 'noincident') };

    // Training
    const trainVal = (formData.trainingRequired > 0) ? (formData.trainingPassed / formData.trainingRequired) * 100 : 0;
    kpiResults.training = { value: trainVal, score: normalizeKPI(trainVal, 'training') };

    // Workplace Assessment
    const plan = formData.plannedWorkplaces || 1;
    const actPlan = formData.plannedActions || 1;
    const wpVal1 = (formData.assessedWorkplaces || 0) / plan * 100;
    const wpVal2 = (formData.completedActions || 0) / actPlan * 100;
    const wpVal = (wpVal1 * 0.4) + (wpVal2 * 0.6);
    kpiResults.workplaceAssessment = { value: wpVal, score: normalizeKPI(wpVal, 'workplaceAssessment') };

    // Work Stoppage
    const stopVal = ((formData.stoppageInternal || 0) * 2) - ((formData.stoppageExternal || 0) * 20);
    kpiResults.workStoppage = { value: stopVal, score: normalizeKPI(stopVal, 'workStoppage') };

    // Insurance
    const insVal = (formData.payrollFund > 0) ? (formData.insurancePayment / formData.payrollFund) * 1000 : 0;
    kpiResults.insurance = { value: insVal, score: normalizeKPI(insVal, 'insurance') };

    // Prevention Budget
    const prevVal = (formData.totalBudget > 0) ? (formData.mmBudget / formData.totalBudget) * 100 : 0;
    kpiResults.prevention = { value: prevVal, score: normalizeKPI(prevVal, 'prevention') };

    // PPE
    const ppeVal = (formData.ppeRequired > 0) ? (formData.ppeEquipped / formData.ppeRequired) * 100 : 0;
    kpiResults.ppe = { value: ppeVal, score: normalizeKPI(ppeVal, 'ppe') };

    // Equipment
    const equipTotal = formData.equipmentTotal || 1;
    const equipRisk = formData.equipmentInspected || 0; // Assuming mapped
    // Note: logic in frontend was slightly complex involving totalRisk? 
    // "calculateHighRiskControl"
    // Using simple version here:
    const equipVal = (equipTotal > 0) ? (equipRisk / equipTotal) * 100 : 0;
    kpiResults.equipment = { value: equipVal, score: normalizeKPI(equipVal, 'equipment') };

    // Inspection
    const inspVal = (formData.inspectionPlanned > 0) ? (formData.inspectionDone / formData.inspectionPlanned) * 100 : 0;
    kpiResults.inspection = { value: inspVal, score: normalizeKPI(inspVal, 'inspection') };

    // Occupational
    const occVal = formData.occupational || 0;
    kpiResults.occupational = { value: occVal, score: normalizeKPI(occVal, 'occupational') };

    // Compliance
    const compVal = (formData.auditTotal > 0) ? (1 - (formData.auditIssues / formData.auditTotal)) * 100 : 0;
    kpiResults.compliance = { value: compVal, score: normalizeKPI(compVal, 'compliance') };

    // Emergency
    const emergVal = (formData.emergencyPlanned > 0) ? (formData.emergencyParticipated / formData.emergencyPlanned) * 100 : 0;
    kpiResults.emergency = { value: emergVal, score: normalizeKPI(emergVal, 'emergency') };

    // Violations
    const violPoints = ((formData.ticketRed || 0) * 10) + ((formData.ticketYellow || 0) * 3) + ((formData.ticketGreen || 0) * 1);
    const violVal = (employees > 0) ? (violPoints / employees) * 100 : 0;
    kpiResults.violations = { value: violVal, score: normalizeKPI(violVal, 'violations') };


    // 2. Calculate Weighted Average
    let totalScore = 0;
    let totalWeight = 0;
    const profileWeights = KPI_WEIGHTS[departmentId] || {};

    const scoresForCheck = {};

    for (const [key, result] of Object.entries(kpiResults)) {
        if (KPI_CONFIG[key]) {
            const weight = profileWeights[key] !== undefined ? profileWeights[key] : KPI_CONFIG[key].weight;
            totalScore += result.score * weight;
            totalWeight += weight;
            scoresForCheck[key] = result.score;
        }
    }

    let weightedScore = totalWeight > 0 ? totalScore / totalWeight : 0;

    // 3. Apply Penalties
    const violations = checkMinimumRequirements(scoresForCheck, departmentId);
    let penaltyTotal = 0;
    violations.forEach(v => penaltyTotal += v.penalty);

    weightedScore = Math.max(0, weightedScore - penaltyTotal);

    return {
        rating: Math.round(weightedScore * 100) / 100,
        kpiResults,
        violations
    };
}
