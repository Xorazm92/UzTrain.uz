// Data Loader for companies.json
// Handles fetching, parsing, and transforming the external JSON data

async function loadExternalData() {
    try {
        const response = await fetch('companies.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        return processData(jsonData);
    } catch (error) {
        console.error("Could not load companies.json:", error);
        // Fallback to existing data or empty array
        return [];
    }
}

function processData(jsonData) {
    const processedCompanies = [];

    // The root object is "O'zbekiston temir yo'llari" AJ
    // We treat the top-level object as the root management entity
    if (jsonData.data) {
        processNode(jsonData.data, null, processedCompanies, 'management');
    }

    return processedCompanies;
}

function processNode(node, parentId, list, forcedLevel = null) {
    // Determine ID
    const id = node.xId || `gen_${Math.random().toString(36).substr(2, 9)}`;

    // Determine Level
    let level = 'subsidiary';
    if (forcedLevel) {
        level = forcedLevel;
    } else if (node.type === 'management' || node.type === 'ao') {
        level = 'supervisor';
    } else if (node.children && node.children.length > 0) {
        // If it has children but isn't explicitly management/ao, treat as supervisor if deep in tree
        // For simplicity, let's stick to the type mapping or depth
        level = 'supervisor';
    }

    // Special case: If parent is root, these are likely supervisors (MTUs, AJs)
    if (parentId && list.find(c => c.id === parentId)?.level === 'management') {
        level = 'supervisor';
    }

    // If it's a leaf node (no children), it's a subsidiary
    if (!node.children || node.children.length === 0) {
        level = 'subsidiary';
    }

    // Generate Random Data for missing fields
    const employees = Math.floor(Math.random() * (5000 - 50 + 1)) + 50;
    const riskGroups = ['high', 'medium', 'low'];
    const riskGroup = riskGroups[Math.floor(Math.random() * riskGroups.length)];

    // Calculate a random score based on risk group to make it realistic
    let baseScore = 85;
    if (riskGroup === 'high') baseScore = 80;
    if (riskGroup === 'low') baseScore = 90;
    const overallIndex = Math.min(100, Math.max(0, baseScore + (Math.random() * 20 - 10)));

    const company = {
        id: id,
        name: node.name,
        level: level,
        supervisorId: parentId,
        riskGroup: riskGroup,
        employees: employees,
        overallIndex: overallIndex,
        kpis: generateRandomKPIs(overallIndex), // Reusing the helper from data.js logic
        originalType: node.type,
        shortName: node.shortName
    };

    list.push(company);

    // Process Children
    if (node.children && Array.isArray(node.children)) {
        node.children.forEach(child => {
            processNode(child, id, list);
        });
    }
}

// Helper to generate consistent random KPIs (copied from data.js logic for consistency)
function generateRandomKPIs(targetScore) {
    const kpis = {};
    const keys = [
        'ltifr', 'trir', 'noincident', 'training', 'raCoverage',
        'nearMiss', 'responseTime', 'prevention', 'ppe', 'equipment',
        'inspection', 'occupational', 'compliance', 'emergency', 'violations'
    ];

    keys.forEach(key => {
        const variance = (Math.random() * 20) - 10;
        let score = Math.min(100, Math.max(0, targetScore + variance));

        kpis[key] = {
            value: Math.round(Math.random() * 100),
            score: score
        };
    });

    return kpis;
}
