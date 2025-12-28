import { RISK_PROFILES, RISK_CLASSIFICATION, KPI_CONFIG, KPI_WEIGHTS, ACCIDENT_COEFFICIENTS } from '../constants/kpi-config';

export interface KPIResult {
    value: number;
    score: number;
}

export interface CompanyFormData {
    name: string;
    level: string;
    parent: string;
    profile: string;
    employees: number;
    totalHours?: number;
    month?: string;
    year?: number;

    // KPI Inputs
    fatal: number;
    severe: number;
    group: number;
    light: number;
    hseStaffActual: number;
    hseStaffRequired: number;
    noincident: number;
    trainingPassed: number;
    trainingRequired: number;

    // New Attestation Fields
    assessedWorkplaces: number;
    plannedWorkplaces: number;
    completedActions: number;
    plannedActions: number;

    // New Work Stoppage Fields
    stoppageInternal: number;
    stoppageExternal: number;

    // New Insurance Fields
    insurancePayment: number;
    payrollFund: number;

    mmBudgetActual: number;
    mmBudgetPlanned: number;
    ppeEquipped: number;
    ppeRequired: number;
    equipmentInspected: number;
    equipmentTotal: number;
    authorizedStaff: number;
    totalStaffEquipment: number;
    inspectionDone: number;
    inspectionPlanned: number;
    occupational: number;
    auditIssues: number;
    auditTotal: number;
    emergencyParticipated: number;
    emergencyPlanned: number;
    ticketRed: number;
    ticketYellow: number;
    ticketGreen: number;
}

export class KPICalculator {
    private employees: number;
    private totalHours: number;

    constructor(employees: number, totalHours?: number) {
        this.employees = employees;
        this.totalHours = totalHours || employees * 1820; // Standard: 1820 hours/year
    }

    calculateAccidentSeverity(fatal: number, severe: number, group: number, light: number): number {
        const penalty = (fatal * 100) + (severe * 50) + (group * 40) + (light * 10);
        return penalty;
    }

    calculateHSEStaffing(actual: number, required: number): number {
        return required > 0 ? (actual / required) * 100 : 0;
    }

    calculateNoincident(days: number): number {
        return (days / 365) * 100;
    }

    calculateTrainingEffectiveness(passed: number, required: number): number {
        return required > 0 ? (passed / required) * 100 : 0;
    }

    calculateWorkplaceAssessment(assessed: number, planned: number, actionsDone: number, actionsPlanned: number): number {
        const part1 = planned > 0 ? (assessed / planned) * 100 : 0;
        const part2 = actionsPlanned > 0 ? (actionsDone / actionsPlanned) * 100 : 0;
        return (part1 * 0.4) + (part2 * 0.6);
    }

    calculateWorkStoppage(internal: number, external: number): number {
        // Internal is positive (+2), External is negative (-20)
        // Base score 50? Or just raw points?
        // Let's return raw points difference for now, normalize later
        return (internal * 2) - (external * 20);
    }

    calculateInsurance(payment: number, payroll: number): number {
        // Penalty calculation
        return payroll > 0 ? (payment / payroll) * 1000 : 0;
    }

    calculatePrevention(actualBudget: number, plannedBudget: number): number {
        return plannedBudget > 0 ? (actualBudget / plannedBudget) * 100 : 0;
    }

    calculatePPECompliance(equipped: number, required: number): number {
        return required > 0 ? (equipped / required) * 100 : 0;
    }

    calculateHighRiskControl(inspected: number, totalRisk: number, authorized: number, totalStaff: number): number {
        const equipmentPart = totalRisk > 0 ? (inspected / totalRisk) * 100 : 0;
        const staffPart = totalStaff > 0 ? (authorized / totalStaff) * 100 : 0;
        return (equipmentPart * 0.6) + (staffPart * 0.4);
    }

    calculateInspectionExecution(done: number, planned: number): number {
        return planned > 0 ? (done / planned) * 100 : 0;
    }

    calculateOccupational(count: number): number {
        return count;
    }

    calculateAuditEffectiveness(issues: number, totalPoints: number): number {
        return totalPoints > 0 ? (1 - (issues / totalPoints)) * 100 : 0;
    }

    calculateEmergencyPreparedness(participated: number, planned: number): number {
        return planned > 0 ? (participated / planned) * 100 : 0;
    }

    calculateDisciplineIndex(red: number, yellow: number, green: number): number {
        const penaltyPoints = (red * 10) + (yellow * 3) + (green * 1);
        return this.employees > 0 ? (penaltyPoints / this.employees) * 100 : 0;
    }
}

// Penalty to Score Conversion
function penaltyToScore(penalty: number): number {
    if (penalty === 0) return 100;
    if (penalty === 1) return 85;
    if (penalty <= 5) return Math.round(85 - (penalty - 1) * (25 / 4));
    if (penalty <= 20) return Math.round(60 - (penalty - 5) * (30 / 15));
    if (penalty <= 50) return Math.round(30 - (penalty - 20) * (20 / 30));
    if (penalty <= 100) return Math.round(10 - (penalty - 50) * (10 / 50));
    return 0;
}

// Normalize KPI values to scores (0-100)
export function normalizeKPI(value: number, kpiKey: string): number {
    let score = 0;

    switch (kpiKey) {
        case 'ltifr':
            score = penaltyToScore(value);
            break;

        case 'hseStaffing':
            // Target is 100% or more.
            // If < 50% -> 0 score
            // If >= 100% -> 100 score
            // Linear interpolation between 50 and 100?
            if (value >= 100) {
                score = 100;
            } else if (value < 50) {
                score = 0;
            } else {
                // 50 -> 0, 100 -> 100
                // score = (value - 50) * 2
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
            // Base 50, +2 for internal, -20 for external
            score = 50 + value;
            break;

        case 'insurance':
            // Value is penalty points. Score = 100 - penalty
            score = 100 - value;
            break;

        case 'prevention':
            // Reja vs Fakt - oddiy foiz bajarilishi (0-100%+)
            score = Math.min(100, Math.max(0, value));
            break;

        case 'occupational':
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

        case 'violations':
            if (value === 0) {
                score = 100;
            } else if (value <= 2) {
                score = 95 - (value * 10);
            } else if (value <= 5) {
                score = 75 - ((value - 2) * 10);
            } else if (value <= 10) {
                score = 45 - ((value - 5) * 6);
            } else if (value <= 20) {
                score = 15 - ((value - 10) * 1.5);
            } else {
                score = 0;
            }
            break;
    }

    return Math.round(Math.max(0, Math.min(100, score)));
}

// Get risk profile for department
function getRiskProfile(department: string) {
    const riskClass = RISK_CLASSIFICATION[department] || 'MEDIUM';
    return RISK_PROFILES[riskClass];
}

// Check minimum requirements
interface Violation {
    metric: string;
    required: number;
    actual: number;
    penalty: number;
}

function checkMinimumRequirements(scores: Record<string, number>, department: string): Violation[] {
    const risk = getRiskProfile(department);
    const violations: Violation[] = [];

    if (scores.ltifr && scores.ltifr < risk.minLTIFR) {
        violations.push({
            metric: 'ltifr',
            required: risk.minLTIFR,
            actual: scores.ltifr,
            penalty: 25
        });
    }

    if (scores.hseStaffing && scores.hseStaffing < risk.minHSEStaffing) {
        violations.push({
            metric: 'hseStaffing',
            required: risk.minHSEStaffing,
            actual: scores.hseStaffing,
            penalty: 20
        });
    }

    if (scores.training && scores.training < risk.minTraining) {
        violations.push({
            metric: 'training',
            required: risk.minTraining,
            actual: scores.training,
            penalty: 15
        });
    }

    if (scores.equipment && scores.equipment < risk.minEquipment) {
        violations.push({
            metric: 'equipment',
            required: risk.minEquipment,
            actual: scores.equipment,
            penalty: 15
        });
    }

    if (scores.ppe && scores.ppe < risk.minPPE) {
        violations.push({
            metric: 'ppe',
            required: risk.minPPE,
            actual: scores.ppe,
            penalty: 20
        });
    }

    if (scores.workplaceAssessment && scores.workplaceAssessment < risk.minRACoverage) {
        violations.push({
            metric: 'workplaceAssessment',
            required: risk.minRACoverage,
            actual: scores.workplaceAssessment,
            penalty: 12
        });
    }

    return violations;
}

// Calculate overall index
export function calculateOverallIndex(kpiResults: Record<string, KPIResult>, profileId: string): number {
    let totalScore = 0;
    let totalWeight = 0;

    const profileWeights = KPI_WEIGHTS[profileId] || {};

    for (const [key, result] of Object.entries(kpiResults)) {
        const config = KPI_CONFIG[key];
        if (config && result.score !== undefined) {
            const weight = profileWeights[key] !== undefined ? profileWeights[key] : config.weight;
            totalScore += result.score * weight;
            totalWeight += weight;
        }
    }

    let weightedScore = totalWeight > 0 ? totalScore / totalWeight : 0;

    // Check minimum requirements
    const kpiValues: Record<string, number> = {};
    for (const [key, result] of Object.entries(kpiResults)) {
        kpiValues[key] = result.score || 0;
    }

    const violations = checkMinimumRequirements(kpiValues, profileId);
    if (violations.length > 0) {
        let minRequirementsPenalty = 0;
        for (const violation of violations) {
            minRequirementsPenalty += violation.penalty;
        }
        weightedScore = Math.max(0, weightedScore - minRequirementsPenalty);
    }

    return Math.round(weightedScore * 100) / 100;
}

// Calculate all KPIs for a company
export function calculateCompanyKPIs(formData: CompanyFormData): Record<string, KPIResult> {
    const calculator = new KPICalculator(formData.employees, formData.totalHours);
    const kpiResults: Record<string, KPIResult> = {};

    // LTIFR
    kpiResults.ltifr = {
        value: calculator.calculateAccidentSeverity(
            formData.fatal || 0,
            formData.severe || 0,
            formData.group || 0,
            formData.light || 0
        ),
        score: 0
    };
    kpiResults.ltifr.score = normalizeKPI(kpiResults.ltifr.value, 'ltifr');

    // HSE Staffing (Replaces TRIR)
    kpiResults.hseStaffing = {
        value: calculator.calculateHSEStaffing(formData.hseStaffActual || 0, formData.hseStaffRequired || 1),
        score: 0
    };
    kpiResults.hseStaffing.score = normalizeKPI(kpiResults.hseStaffing.value, 'hseStaffing');

    // No Incident Days
    kpiResults.noincident = {
        value: calculator.calculateNoincident(formData.noincident || 0),
        score: 0
    };
    kpiResults.noincident.score = normalizeKPI(kpiResults.noincident.value, 'noincident');

    // Training
    kpiResults.training = {
        value: calculator.calculateTrainingEffectiveness(
            formData.trainingPassed || 0,
            formData.trainingRequired || 1
        ),
        score: 0
    };
    kpiResults.training.score = normalizeKPI(kpiResults.training.value, 'training');

    // Workplace Assessment (Replaces RA Coverage)
    kpiResults.workplaceAssessment = {
        value: calculator.calculateWorkplaceAssessment(
            formData.assessedWorkplaces || 0,
            formData.plannedWorkplaces || 1,
            formData.completedActions || 0,
            formData.plannedActions || 1
        ),
        score: 0
    };
    kpiResults.workplaceAssessment.score = normalizeKPI(kpiResults.workplaceAssessment.value, 'workplaceAssessment');

    // Work Stoppage (Replaces Near Miss)
    kpiResults.workStoppage = {
        value: calculator.calculateWorkStoppage(
            formData.stoppageInternal || 0,
            formData.stoppageExternal || 0
        ),
        score: 0
    };
    kpiResults.workStoppage.score = normalizeKPI(kpiResults.workStoppage.value, 'workStoppage');

    // Insurance (Replaces Response Time)
    kpiResults.insurance = {
        value: calculator.calculateInsurance(
            formData.insurancePayment || 0,
            formData.payrollFund || 1
        ),
        score: 0
    };
    kpiResults.insurance.score = normalizeKPI(kpiResults.insurance.value, 'insurance');

    // Prevention Budget (Reja vs Fakt)
    kpiResults.prevention = {
        value: calculator.calculatePrevention(
            formData.mmBudgetActual || 0,
            formData.mmBudgetPlanned || 1
        ),
        score: 0
    };
    kpiResults.prevention.score = normalizeKPI(kpiResults.prevention.value, 'prevention');

    // PPE
    kpiResults.ppe = {
        value: calculator.calculatePPECompliance(
            formData.ppeEquipped || 0,
            formData.ppeRequired || 1
        ),
        score: 0
    };
    kpiResults.ppe.score = normalizeKPI(kpiResults.ppe.value, 'ppe');

    // Equipment
    kpiResults.equipment = {
        value: calculator.calculateHighRiskControl(
            formData.equipmentInspected || 0,
            formData.equipmentTotal || 1,
            formData.authorizedStaff || 0,
            formData.totalStaffEquipment || 1
        ),
        score: 0
    };
    kpiResults.equipment.score = normalizeKPI(kpiResults.equipment.value, 'equipment');

    // Inspection
    kpiResults.inspection = {
        value: calculator.calculateInspectionExecution(
            formData.inspectionDone || 0,
            formData.inspectionPlanned || 1
        ),
        score: 0
    };
    kpiResults.inspection.score = normalizeKPI(kpiResults.inspection.value, 'inspection');

    // Occupational Diseases
    kpiResults.occupational = {
        value: calculator.calculateOccupational(formData.occupational || 0),
        score: 0
    };
    kpiResults.occupational.score = normalizeKPI(kpiResults.occupational.value, 'occupational');

    // Compliance
    kpiResults.compliance = {
        value: calculator.calculateAuditEffectiveness(
            formData.auditIssues || 0,
            formData.auditTotal || 1
        ),
        score: 0
    };
    kpiResults.compliance.score = normalizeKPI(kpiResults.compliance.value, 'compliance');

    // Emergency
    kpiResults.emergency = {
        value: calculator.calculateEmergencyPreparedness(
            formData.emergencyParticipated || 0,
            formData.emergencyPlanned || 1
        ),
        score: 0
    };
    kpiResults.emergency.score = normalizeKPI(kpiResults.emergency.value, 'emergency');

    // Violations
    kpiResults.violations = {
        value: calculator.calculateDisciplineIndex(
            formData.ticketRed || 0,
            formData.ticketYellow || 0,
            formData.ticketGreen || 0
        ),
        score: 0
    };
    kpiResults.violations.score = normalizeKPI(kpiResults.violations.value, 'violations');

    return kpiResults;
}

// Get zone classification
export interface Zone {
    name: 'green' | 'yellow' | 'red';
    label: string;
    class: string;
}

export function getZone(score: number): Zone {
    if (score >= 80) return { name: 'green', label: '🟢 Yaxshi', class: 'green' };
    if (score >= 50) return { name: 'yellow', label: '🟡 Qoniqarli', class: 'yellow' };
    return { name: 'red', label: '🔴 Xavfli', class: 'red' };
}
