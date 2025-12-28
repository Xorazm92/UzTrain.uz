// ===================================
// Hierarchy Management Module
// ===================================

/**
 * Ierarxiya darajasi
 */
const HIERARCHY_LEVELS = {
    MANAGEMENT: 'management',
    SUPERVISOR: 'supervisor',
    SUBSIDIARY: 'subsidiary'
};

/**
 * Xavflilik guruhlari
 */
const RISK_GROUPS = {
    HIGH: {
        id: 'high',
        name: 'Yuqori xavfli',
        color: '#e74c3c',
        icon: '🔴',
        industries: ['Ishlab chiqarish', 'Qurilish', 'Kimyo sanoati', 'Tog\' kon'],
        minKPIThreshold: 85,
        description: 'Yuqori xavfli ishlab chiqarish korxonalari'
    },
    MEDIUM: {
        id: 'medium',
        name: 'O\'rtacha xavfli',
        color: '#ffb84d',
        icon: '🟡',
        industries: ['Logistika', 'Sanoat', 'Energetika', 'Transport'],
        minKPIThreshold: 75,
        description: 'O\'rtacha xavfli korxonalar'
    },
    LOW: {
        id: 'low',
        name: 'Past xavfli',
        color: '#2d9f5d',
        icon: '🟢',
        industries: ['Ofis', 'Xizmat ko\'rsatish', 'Savdo', 'IT'],
        minKPIThreshold: 65,
        description: 'Past xavfli xizmat korxonalari'
    }
};

/**
 * Ierarxiya daraxt qurish (Rekursiv)
 */
function buildHierarchyTree(companies) {
    // Ildiz (Management) topish
    const rootCompanies = companies.filter(c => c.level === HIERARCHY_LEVELS.MANAGEMENT);

    return rootCompanies.map(root => buildNode(root, companies));
}

/**
 * Bitta tugun uchun daraxt qurish
 */
function buildNode(company, allCompanies) {
    const children = allCompanies.filter(c => c.supervisorId === company.id);

    return {
        ...company,
        children: children.map(child => buildNode(child, allCompanies))
    };
}

/**
 * Xavflilik guruhi bo'yicha tahlil
 */
function analyzeRiskGroups(companies) {
    const analysis = {};

    Object.values(RISK_GROUPS).forEach(group => {
        const groupCompanies = companies.filter(c => c.riskGroup === group.id);

        analysis[group.id] = {
            ...group,
            count: groupCompanies.length,
            avgIndex: groupCompanies.length > 0
                ? groupCompanies.reduce((sum, c) => sum + c.overallIndex, 0) / groupCompanies.length
                : 0,
            zones: {
                green: groupCompanies.filter(c => c.zone === 'green').length,
                yellow: groupCompanies.filter(c => c.zone === 'yellow').length,
                red: groupCompanies.filter(c => c.zone === 'red').length
            },
            critical: groupCompanies.filter(c => c.zone === 'red'),
            belowThreshold: groupCompanies.filter(c => c.overallIndex < group.minKPIThreshold)
        };
    });

    return analysis;
}

/**
 * Rol bo'yicha korxonalarni filtrlash
 */
function filterCompaniesByRole(companies, userRole) {
    if (!userRole) return companies;

    switch (userRole.role) {
        case HIERARCHY_LEVELS.MANAGEMENT:
            // Boshqaruv - barcha korxonalarni ko'radi
            return companies;

        case HIERARCHY_LEVELS.SUPERVISOR:
            // Nazoratchi - faqat o'z filiallari va o'zini
            return companies.filter(c =>
                c.supervisorId === userRole.companyId ||
                c.id === userRole.companyId
            );

        case HIERARCHY_LEVELS.SUBSIDIARY:
            // Korxona - faqat o'zini
            return companies.filter(c => c.id === userRole.companyId);

        default:
            return companies;
    }
}

/**
 * Nazoratchi uchun konsolidatsiya hisoboti
 */
function generateConsolidatedReport(supervisorId, companies) {
    const subsidiaries = companies.filter(c => c.supervisorId === supervisorId);

    if (subsidiaries.length === 0) {
        return null;
    }

    // O'rtacha KPI ballari
    const avgKPIs = {};
    Object.keys(KPI_CONFIG).forEach(key => {
        const scores = subsidiaries.map(c => c.kpis[key].score);
        avgKPIs[key] = scores.reduce((a, b) => a + b, 0) / scores.length;
    });

    // Umumiy statistika
    const totalEmployees = subsidiaries.reduce((sum, c) => sum + c.employees, 0);
    const avgIndex = subsidiaries.reduce((sum, c) => sum + c.overallIndex, 0) / subsidiaries.length;

    return {
        supervisorId,
        totalSubsidiaries: subsidiaries.length,
        totalEmployees,
        avgIndex: Math.round(avgIndex * 100) / 100,
        avgKPIs,
        zones: {
            green: subsidiaries.filter(c => c.zone === 'green').length,
            yellow: subsidiaries.filter(c => c.zone === 'yellow').length,
            red: subsidiaries.filter(c => c.zone === 'red').length
        },
        topPerformers: subsidiaries
            .sort((a, b) => b.overallIndex - a.overallIndex)
            .slice(0, 3),
        needsAttention: subsidiaries
            .filter(c => c.zone === 'red')
            .sort((a, b) => a.overallIndex - b.overallIndex)
    };
}

/**
 * Ierarxiya darajasini aniqlash
 */
function getHierarchyLevel(company) {
    const levels = {
        [HIERARCHY_LEVELS.MANAGEMENT]: { name: 'Boshqaruv', icon: '🏢', color: '#3498db' },
        [HIERARCHY_LEVELS.SUPERVISOR]: { name: 'Nazoratchi', icon: '👔', color: '#9b59b6' },
        [HIERARCHY_LEVELS.SUBSIDIARY]: { name: 'Korxona', icon: '🏭', color: '#95a5a6' }
    };

    return levels[company.level] || levels[HIERARCHY_LEVELS.SUBSIDIARY];
}

/**
 * Xavflilik guruhini aniqlash
 */
function getRiskGroup(riskGroupId) {
    return Object.values(RISK_GROUPS).find(g => g.id === riskGroupId) || RISK_GROUPS.MEDIUM;
}

/**
 * Benchmark taqqoslash (xuddi shu xavflilik guruhida)
 */
function benchmarkAgainstPeers(company, companies) {
    const peers = companies.filter(c =>
        c.riskGroup === company.riskGroup &&
        c.id !== company.id
    );

    if (peers.length === 0) return null;

    const avgPeerIndex = peers.reduce((sum, c) => sum + c.overallIndex, 0) / peers.length;
    const betterThanPeers = peers.filter(c => company.overallIndex > c.overallIndex).length;
    const percentile = Math.round((betterThanPeers / peers.length) * 100);

    return {
        peerCount: peers.length,
        avgPeerIndex: Math.round(avgPeerIndex * 100) / 100,
        percentile,
        position: betterThanPeers + 1,
        aboveAverage: company.overallIndex > avgPeerIndex
    };
}

/**
 * Ierarxiya HTML yasash (Rekursiv)
 */
function renderHierarchyTree(tree) {
    // Tree bu yerda array (root nodes)
    if (!Array.isArray(tree)) {
        // Agar eski formatdagi obyekt kelsa, uni arrayga o'tkazamiz
        if (tree.management) {
            // Eski formatni qo'llab-quvvatlash uchun
            let html = '<div class="hierarchy-tree">';
            html += '<div class="hierarchy-level management-level"><h3>🏢 Boshqaruv</h3>';
            tree.management.forEach(c => html += renderCompanyNode(c, 'management'));
            html += '</div>';

            if (tree.supervisors && tree.supervisors.length > 0) {
                html += '<div class="hierarchy-level supervisor-level"><h3>👔 Nazoratchilar</h3>';
                tree.supervisors.forEach(s => {
                    html += '<div class="supervisor-group">';
                    html += renderCompanyNode(s, 'supervisor');
                    if (s.subsidiaries) {
                        html += '<div class="subsidiaries-list">';
                        s.subsidiaries.forEach(sub => html += renderCompanyNode(sub, 'subsidiary'));
                        html += '</div>';
                    }
                    html += '</div>';
                });
                html += '</div>';
            }
            html += '</div>';
            return html;
        }
        return '';
    }

    let html = '<div class="hierarchy-tree recursive-tree">';
    tree.forEach(node => {
        html += renderRecursiveNode(node);
    });
    html += '</div>';
    return html;
}

/**
 * Rekursiv tugun render qilish (Collapsible & Professional)
 */
function renderRecursiveNode(node) {
    const hasChildren = node.children && node.children.length > 0;
    const zone = getZone(node.overallIndex);
    const riskGroup = getRiskGroup(node.riskGroup);
    const levelInfo = getHierarchyLevel(node);

    // Unique ID for toggle
    const toggleId = `toggle-${node.id}`;
    const childrenId = `children-${node.id}`;

    let html = `
        <div class="hierarchy-node-wrapper">
            <div class="company-node ${node.level}-node" data-id="${node.id}">
                <div class="node-header">
                    ${hasChildren
            ? `<span class="toggle-btn" onclick="toggleNode('${node.id}')" id="${toggleId}">+</span>`
            : '<span class="toggle-btn" style="visibility: hidden"></span>'}
                    <span class="node-icon">${levelInfo.icon}</span>
                    <span class="node-name">${node.name}</span>
                    <span class="zone-badge ${zone.class}">${zone.label}</span>
                </div>
                <div class="node-details">
                    <span class="node-index">MMI: ${node.overallIndex.toFixed(1)}</span>
                    <span class="node-risk ${riskGroup.id}">${riskGroup.icon} ${riskGroup.name}</span>
                    <span class="node-employees">👥 ${node.employees}</span>
                </div>
            </div>
    `;

    if (hasChildren) {
        // Initially hidden (collapsed)
        html += `<div class="node-children collapsed" id="${childrenId}">`;
        node.children.forEach(child => {
            html += renderRecursiveNode(child);
        });
        html += '</div>';
    }

    html += '</div>';
    return html;
}

// Global function for toggling
window.toggleNode = function (id) {
    const childrenDiv = document.getElementById(`children-${id}`);
    const toggleBtn = document.getElementById(`toggle-${id}`);

    if (childrenDiv) {
        if (childrenDiv.classList.contains('collapsed')) {
            childrenDiv.classList.remove('collapsed');
            toggleBtn.textContent = '-';
            toggleBtn.style.background = '#F56400';
            toggleBtn.style.color = 'white';
            toggleBtn.style.borderColor = '#F56400';
        } else {
            childrenDiv.classList.add('collapsed');
            toggleBtn.textContent = '+';
            toggleBtn.style.background = '#f5f5f5';
            toggleBtn.style.color = '#666';
            toggleBtn.style.borderColor = '#ddd';
        }
    }
};

/**
 * Korxona node HTML
 */
function renderCompanyNode(company, level) {
    const zone = getZone(company.overallIndex);
    const riskGroup = getRiskGroup(company.riskGroup);

    return `
        <div class="company-node ${level}-node" data-id="${company.id}">
            <div class="node-header">
                <span class="node-icon">${getHierarchyLevel(company).icon}</span>
                <span class="node-name">${company.name}</span>
                <span class="zone-badge ${zone.class}">${zone.label}</span>
            </div>
            <div class="node-details">
                <span class="node-index">${company.overallIndex.toFixed(1)}</span>
                <span class="node-risk ${riskGroup.id}">${riskGroup.icon} ${riskGroup.name}</span>
                <span class="node-employees">${company.employees} xodim</span>
            </div>
        </div>
    `;
}
