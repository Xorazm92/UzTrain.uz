
import pool from '../database/db.js';
import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL || 'https://your-project.supabase.co',
    process.env.SUPABASE_ANON_KEY || 'your-anon-key'
);


// Helper functions
const calcPercent = (numerator, denominator) => {
    if (!denominator || denominator === 0) return 0;
    const percent = (numerator / denominator) * 100;
    return Math.min(100, Math.max(0, percent)); // Cap between 0-100
};

const calcIncidentFree = (penaltyPoints, companyCount) => {
    if (!companyCount || companyCount === 0) return 100;
    const avgPenalty = penaltyPoints / companyCount;
    return Math.max(0, 100 - avgPenalty);
};

const MTU_IDS = ['14', '15', '16', '17', '18', '19'];
const MTU_NAMES = {
    '14': 'Toshkent MTU',
    '15': 'Qo\'qon MTU',
    '16': 'Buxoro MTU',
    '17': 'Qo\'ng\'irot MTU',
    '18': 'Qarshi MTU',
    '19': 'Termiz MTU'
};

export const getGlobalDashboardData = async (req, res) => {
    try {
        // Try to fetch from Supabase first
        const { data: companies, error } = await supabase
            .from('companies')
            .select('*')
            .order('overall_index', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        console.log(`Fetched ${companies?.length || 0} companies from Supabase`);

        // If no companies, return empty structure
        if (!companies || companies.length === 0) {
            return res.json({
                safetyIndex: {
                    value: 0,
                    components: { competency: 0, technical: 0, supply: 0, incidentFree: 100 }
                },
                statusMatrix: {
                    companies: { value: 0, status: 'green', text: 'Hali korxonalar qo\'shilmagan.' },
                    employees: { value: 0, status: 'green', text: 'Ma\'lumot yo\'q.' },
                    equipment: { value: 0, status: 'green', text: 'Ma\'lumot yo\'q.' },
                    appeSeason: { value: 0, status: 'green', text: 'Ma\'lumot yo\'q.' },
                    appeExpired: { value: 0, status: 'green', text: 'Ma\'lumot yo\'q.' }
                },
                regionalData: MTU_IDS.map(id => ({
                    id,
                    name: MTU_NAMES[id],
                    count: 0,
                    avgRating: 0,
                    safetyIndex: 0,
                    components: { competency: 0, technical: 0, supply: 0, incidentFree: 100 }
                })),
                topProblematic: [],
                mtuRanking: []
            });
        }

        // Initialize stats
        let globalStats = {
            trainingPassed: 0, trainingRequired: 0,
            equipmentInspected: 0, equipmentTotal: 0,
            ppeEquipped: 0, ppeRequired: 0,
            accidentPenalty: 0,
            count: 0
        };

        const regionalGroups = {};
        MTU_IDS.forEach(id => {
            regionalGroups[id] = {
                id, name: MTU_NAMES[id], sumScore: 0, count: 0,
                stats: {
                    trainingPassed: 0, trainingRequired: 0,
                    equipmentInspected: 0, equipmentTotal: 0,
                    ppeEquipped: 0, ppeRequired: 0,
                    accidentPenalty: 0
                }
            };
        });

        // Process companies
        companies.forEach(company => {
            const data = company.raw_data || {};
            const parentId = company.parent;

            globalStats.count++;
            globalStats.trainingPassed += Number(data.trainingPassed || 0);
            globalStats.trainingRequired += Number(data.trainingRequired || 0);
            globalStats.equipmentInspected += Number(data.equipmentInspected || 0);
            globalStats.equipmentTotal += Number(data.equipmentTotal || 0);
            globalStats.ppeEquipped += Number(data.ppeEquipped || 0);
            globalStats.ppeRequired += Number(data.ppeRequired || 0);

            const penalty = (Number(data.fatal || 0) * 100) +
                (Number(data.severe || 0) * 50) +
                (Number(data.group || 0) * 40) +
                (Number(data.light || 0) * 10);
            globalStats.accidentPenalty += penalty;

            if (regionalGroups[parentId]) {
                const group = regionalGroups[parentId];
                group.sumScore += company.overall_index || 0;
                group.count++;
                group.stats.trainingPassed += Number(data.trainingPassed || 0);
                group.stats.trainingRequired += Number(data.trainingRequired || 0);
                group.stats.equipmentInspected += Number(data.equipmentInspected || 0);
                group.stats.equipmentTotal += Number(data.equipmentTotal || 0);
                group.stats.ppeEquipped += Number(data.ppeEquipped || 0);
                group.stats.ppeRequired += Number(data.ppeRequired || 0);
                group.stats.accidentPenalty += penalty;
            }
        });

        // Calculate indices
        const globalCompetency = calcPercent(globalStats.trainingPassed, globalStats.trainingRequired);
        const globalTechnical = calcPercent(globalStats.equipmentInspected, globalStats.equipmentTotal);
        const globalSupply = calcPercent(globalStats.ppeEquipped, globalStats.ppeRequired);
        const globalIncidentFree = calcIncidentFree(globalStats.accidentPenalty, globalStats.count);
        const globalSafetyIndex = globalStats.count > 0
            ? (globalCompetency + globalTechnical + globalSupply + globalIncidentFree) / 4
            : 0;

        // Regional data
        const regionalData = Object.values(regionalGroups).map(group => {
            const competency = calcPercent(group.stats.trainingPassed, group.stats.trainingRequired);
            const technical = calcPercent(group.stats.equipmentInspected, group.stats.equipmentTotal);
            const supply = calcPercent(group.stats.ppeEquipped, group.stats.ppeRequired);
            const incidentFree = calcIncidentFree(group.stats.accidentPenalty, group.count);
            const safetyIndex = (competency + technical + supply + incidentFree) / 4;
            const avgRating = group.count > 0 ? group.sumScore / group.count : 0;

            return {
                id: group.id,
                name: group.name,
                count: group.count,
                avgRating,
                safetyIndex,
                components: { competency, technical, supply, incidentFree }
            };
        });

        // Status matrix
        const companiesBelow70 = companies.filter(c => (c.overall_index || 0) < 70).length;
        const equipmentIssues = companies.reduce((sum, c) => {
            const d = c.raw_data || {};
            return sum + (Number(d.equipmentTotal || 0) - Number(d.equipmentInspected || 0));
        }, 0);
        const seasonalPPERate = calcPercent(globalStats.ppeEquipped, globalStats.ppeRequired);
        const expiredPPE = Math.round(globalStats.ppeEquipped * 0.05);

        const statusMatrix = {
            companies: {
                value: companiesBelow70,
                status: companiesBelow70 === 0 ? 'green' : companiesBelow70 < 5 ? 'yellow' : 'red',
                text: companiesBelow70 === 0 ? "Barcha korxonalarda holat barqaror." : `${companiesBelow70} ta korxonada umumiy holat qoniqarsiz.`
            },
            employees: {
                value: globalCompetency,
                status: globalCompetency > 95 ? 'green' : globalCompetency > 90 ? 'yellow' : 'red',
                text: globalCompetency > 95 ? "Xodimlar kompetensiyasi yuqori darajada." :
                    globalCompetency > 90 ? `${(100 - globalCompetency).toFixed(1)}% xodim qayta sinovga tayyorlanmoqda.` :
                        "Umumiy o'tish ko'rsatkichi 90%dan past."
            },
            equipment: {
                value: equipmentIssues,
                status: equipmentIssues === 0 ? 'green' : equipmentIssues < 10 ? 'yellow' : 'red',
                text: equipmentIssues === 0 ? "Barcha uskunalar soz holatda." : `${equipmentIssues} ta uskuna texnik ko'rikdan o'tishi kerak.`
            },
            appeSeason: {
                value: seasonalPPERate,
                status: seasonalPPERate >= 90 ? 'green' : seasonalPPERate >= 70 ? 'yellow' : 'red',
                text: `Qishki mavsumga tayyorgarlik ${seasonalPPERate.toFixed(1)}%.`
            },
            appeExpired: {
                value: expiredPPE,
                status: expiredPPE === 0 ? 'green' : expiredPPE < 5 ? 'yellow' : 'red',
                text: expiredPPE === 0 ? "Yaroqsiz SHHV yo'q." : `${expiredPPE} ta SHHV yaroqlilik muddati o'tgan (taxminiy).`
            }
        };

        // Top 5 problematic
        const topProblematic = [...companies]
            .sort((a, b) => (a.overall_index || 0) - (b.overall_index || 0))
            .slice(0, 5)
            .map(c => ({
                id: c.id,
                name: c.name,
                rating: c.overall_index || 0
            }));

        // MTU ranking
        const mtuRanking = regionalData
            .filter(r => r.count > 0)
            .sort((a, b) => b.avgRating - a.avgRating);

        res.json({
            safetyIndex: {
                value: globalSafetyIndex,
                components: {
                    competency: globalCompetency,
                    technical: globalTechnical,
                    supply: globalSupply,
                    incidentFree: globalIncidentFree
                }
            },
            statusMatrix,
            regionalData,
            topProblematic,
            mtuRanking
        });

    } catch (error) {
        console.error('Error in global dashboard:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message,
            details: 'Supabase ma\'lumotlar bazasiga ulanib bo\'lmadi. .env faylni tekshiring.'
        });
    }
};
