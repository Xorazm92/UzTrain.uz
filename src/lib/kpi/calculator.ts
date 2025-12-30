import { KPI_METADATA, KPI_WEIGHTS, RISK_CLASSIFICATION, RISK_PROFILES, ACCIDENT_COEFFICIENTS, normalizeKpiKey } from './metadata';

export interface KPIResult {
    value: number;
    score: number;
}

export interface CompanyKpiInput {
    employees: number;
    totalHours?: number;
    profile?: string;
    fatal?: number;
    severe?: number;
    group?: number;
    light?: number;
    hseStaffActual?: number;
    hseStaffRequired?: number;
    noincident?: number;
    trainingPassed?: number;
    trainingRequired?: number;
    assessedWorkplaces?: number;
    plannedWorkplaces?: number;
    stoppageInternal?: number;
    stoppageExternal?: number;
    insurancePayment?: number;
    payrollFund?: number;
    mmBudgetActual?: number;
    mmBudgetPlanned?: number;
    ppeEquipped?: number;
    ppeRequired?: number;
    equipmentInspected?: number;
    equipmentTotal?: number;
    authorizedStaff?: number;
    totalStaffEquipment?: number;
    inspectionDone?: number;
    inspectionPlanned?: number;
    auditIssues?: number;
    auditTotal?: number;
    occupational?: number;
    emergencyParticipated?: number;
    emergencyPlanned?: number;
    internalViolations?: Partial<ViolationCounts>;
    externalViolations?: Partial<ViolationCounts>;
}

interface ViolationCounts {
    red: number;
    yellow: number;
    green: number;
}

class KPICalculatorImpl {
    private readonly employees: number;
    private readonly exposureHours: number;

    constructor(employees: number, totalHours?: number) {
        this.employees = employees;
        this.exposureHours = totalHours && totalHours > 0 ? totalHours : employees * 1820;
    }

    accidentPenalty(fatal = 0, severe = 0, group = 0, light = 0): number {
        const fatalPoints = fatal * ACCIDENT_COEFFICIENTS.fatal.value;
        const severePoints = severe * ACCIDENT_COEFFICIENTS.severe.value;
        const groupPoints = group * ACCIDENT_COEFFICIENTS.group.value;
        const lightPoints = light * ACCIDENT_COEFFICIENTS.light.value;
        const penalty = fatalPoints + severePoints + groupPoints + lightPoints;
        return this.exposureHours > 0 ? (penalty / this.exposureHours) * 1_000_000 : penalty;
    }

    hseStaffing(actual = 0, required = 1): number {
        return required > 0 ? (actual / required) * 100 : 0;
    }

    noIncidentDays(days = 0): number {
        return Math.min(100, Math.max(0, (days / 365) * 100));
    }

    trainingCoverage(passed = 0, required = 1): number {
        return required > 0 ? (passed / required) * 100 : 0;
    }

    workplaceAssessment(assessed = 0, planned = 1): number {
        return planned > 0 ? (assessed / planned) * 100 : 0;
    }

    correctiveActions(completed = 0, planned = 1): number {
        return planned > 0 ? (completed / planned) * 100 : 0;
    }

    workStoppage(internal = 0, external = 0): number {
        return (internal * 2) - (external * 20);
    }

    insurancePenalty(payment = 0, payroll = 1): number {
        return payroll > 0 ? (payment / payroll) * 1000 : 0;
    }

    preventionBudget(actual = 0, planned = 1): number {
        return planned > 0 ? (actual / planned) * 100 : 0;
    }

    ppeCompliance(equipped = 0, required = 1): number {
        return required > 0 ? (equipped / required) * 100 : 0;
    }

    highRiskEquipment(inspected = 0, total = 1, authorized = 0, staffTotal = 1): number {
        const equipmentScore = total > 0 ? (inspected / total) * 100 : 0;
        const staffScore = staffTotal > 0 ? (authorized / staffTotal) * 100 : 0;
        return equipmentScore * 0.6 + staffScore * 0.4;
    }

    inspectionExecution(done = 0, planned = 1): number {
        return planned > 0 ? (done / planned) * 100 : 0;
    }

    occupationalCases(count = 0): number {
        return count;
    }

    auditEffectiveness(issues = 0, totalPoints = 1): number {
        return totalPoints > 0 ? (1 - issues / totalPoints) * 100 : 0;
    }

    emergencyPreparedness(participated = 0, planned = 1): number {
        return planned > 0 ? (participated / planned) * 100 : 0;
    }

    disciplineIndex(
        internal: Partial<ViolationCounts> = {},
        external: Partial<ViolationCounts> = {},
    ): number {
        const safeInternal: ViolationCounts = {
            red: internal.red ?? 0,
            yellow: internal.yellow ?? 0,
            green: internal.green ?? 0,
        };
        const safeExternal: ViolationCounts = {
            red: external.red ?? 0,
            yellow: external.yellow ?? 0,
            green: external.green ?? 0,
        };

        const internalPoints = safeInternal.red * 2 + safeInternal.yellow * 1 + safeInternal.green * 0.5;
        const externalPenalty = safeExternal.red * 15 + safeExternal.yellow * 8 + safeExternal.green * 3;
        const net = internalPoints - externalPenalty;
        return this.employees > 0 ? Math.max(0, net) : 0;
    }
}

function penaltyToScore(penalty: number): number {
    if (penalty <= 0) return 100;
    if (penalty === 1) return 85;
    if (penalty <= 5) return Math.round(85 - (penalty - 1) * (25 / 4));
    if (penalty <= 20) return Math.round(60 - (penalty - 5) * (30 / 15));
    if (penalty <= 50) return Math.round(30 - (penalty - 20) * (20 / 30));
    if (penalty <= 100) return Math.round(10 - (penalty - 50) * (10 / 50));
    return 0;
}

export function normalizeKPIValue(value: number, key: string): number {
    let score = 0;
    switch (key) {
        case 'ltifr':
            score = penaltyToScore(value);
            break;
        case 'hseStaffing':
            if (value >= 100) score = 100;
            else if (value < 50) score = 0;
            else score = (value - 50) * 2;
            break;
        case 'noincident':
            score = Math.min(100, Math.max(0, value));
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
            score = Math.max(0, Math.min(100, 50 + value));
            break;
        case 'insurance':
            score = Math.max(0, Math.min(100, 100 - value));
            break;
        case 'prevention':
            score = Math.min(100, Math.max(0, value));
            break;
        case 'occupational':
            if (value === 0) score = 100;
            else if (value === 1) score = 55;
            else if (value === 2) score = 30;
            else if (value === 3) score = 15;
            else score = Math.max(0, 10 - (value - 3) * 3);
            break;
        case 'violations':
            if (value >= 0) score = Math.min(100, 50 + value);
            else score = Math.max(0, 50 + value);
            break;
        default:
            score = Math.min(100, Math.max(0, value));
    }
    return Math.round(score);
}

export function calculateCompanyKPIs(input: CompanyKpiInput): Record<string, KPIResult> {
    const calculator = new KPICalculatorImpl(input.employees, input.totalHours);
    const results: Record<string, KPIResult> = {};

    const assign = (key: string, value: number) => {
        const normalizedKey = normalizeKpiKey(key);
        const score = normalizeKPIValue(value, normalizedKey);
        results[normalizedKey] = { value, score };
    };

    assign('ltifr', calculator.accidentPenalty(input.fatal, input.severe, input.group, input.light));
    assign('hseStaffing', calculator.hseStaffing(input.hseStaffActual, input.hseStaffRequired));
    assign('noincident', calculator.noIncidentDays(input.noincident));
    assign('training', calculator.trainingCoverage(input.trainingPassed, input.trainingRequired));
    assign('workplaceAssessment', calculator.workplaceAssessment(input.assessedWorkplaces, input.plannedWorkplaces));
    assign('prevention', calculator.preventionBudget(input.mmBudgetActual, input.mmBudgetPlanned));
    assign('workStoppage', calculator.workStoppage(input.stoppageInternal, input.stoppageExternal));
    assign('insurance', calculator.insurancePenalty(input.insurancePayment, input.payrollFund));
    assign('ppe', calculator.ppeCompliance(input.ppeEquipped, input.ppeRequired));
    assign('equipment', calculator.highRiskEquipment(input.equipmentInspected, input.equipmentTotal, input.authorizedStaff, input.totalStaffEquipment));
    assign('inspection', calculator.inspectionExecution(input.inspectionDone, input.inspectionPlanned));
    assign('occupational', calculator.occupationalCases(input.occupational));
    assign('compliance', calculator.auditEffectiveness(input.auditIssues, input.auditTotal));
    assign('emergency', calculator.emergencyPreparedness(input.emergencyParticipated, input.emergencyPlanned));
    assign('violations', calculator.disciplineIndex(input.internalViolations, input.externalViolations));

    return results;
}

interface ViolationCheck {
    metric: string;
    required: number;
    actual: number;
    penalty: number;
}

function checkMinimumRequirements(scores: Record<string, number>, profileId: string | undefined): ViolationCheck[] {
    if (!profileId) return [];
    const riskLevelKey = RISK_CLASSIFICATION[profileId];
    if (!riskLevelKey) return [];
    const riskProfile = RISK_PROFILES[riskLevelKey];
    const violations: ViolationCheck[] = [];

    const comparator = [
        { key: 'ltifr', min: riskProfile.minLTIFR, penalty: 25 },
        { key: 'hseStaffing', min: riskProfile.minHSEStaffing, penalty: 20 },
        { key: 'training', min: riskProfile.minTraining, penalty: 15 },
        { key: 'equipment', min: riskProfile.minEquipment, penalty: 15 },
        { key: 'ppe', min: riskProfile.minPPE, penalty: 20 },
        { key: 'workplaceAssessment', min: riskProfile.minRACoverage, penalty: 12 },
    ];

    comparator.forEach(({ key, min, penalty }) => {
        const actual = scores[key];
        if (typeof actual === 'number' && actual < min) {
            violations.push({ metric: key, required: min, actual, penalty });
        }
    });

    return violations;
}

export function calculateOverallIndex(kpis: Record<string, KPIResult>, profileId?: string): number {
    const weights = profileId && KPI_WEIGHTS[profileId] ? KPI_WEIGHTS[profileId] : undefined;
    let totalScore = 0;
    let totalWeight = 0;

    KPI_METADATA.forEach(meta => {
        const weight = weights?.[meta.key] ?? meta.weight;
        if (weight <= 0) return;
        const score = kpis[meta.key]?.score ?? meta.target;
        totalScore += score * weight;
        totalWeight += weight;
    });

    let weightedScore = totalWeight > 0 ? totalScore / totalWeight : 0;

    const scoreMap: Record<string, number> = {};
    Object.entries(kpis).forEach(([key, result]) => {
        scoreMap[key] = result.score;
    });

    const violations = checkMinimumRequirements(scoreMap, profileId);
    if (violations.length > 0) {
        const totalPenalty = violations.reduce((acc, item) => acc + item.penalty, 0);
        weightedScore = Math.max(0, weightedScore - totalPenalty);
    }

    return Math.round(weightedScore * 10) / 10;
}

export function computeWeightedOverallIndex(scores: Record<string, number>, profileId?: string): number {
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
}

export function determineZone(score: number): 'green' | 'yellow' | 'red' {
    if (score >= 80) return 'green';
    if (score >= 50) return 'yellow';
    return 'red';
}
