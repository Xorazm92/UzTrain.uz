// O'zbekiston Temir Yo'llari AJ - Tashkiliy Tuzilma Ma'lumotlari
// Data source: User provided hierarchy (Step 287)

export interface OrganizationNode {
    id: string;
    name: string;
    level: 'management' | 'supervisor' | 'subsidiary';
    supervisorId: string | null;
    riskGroup: 'low' | 'medium' | 'high';
    employees: number;
    profile?: string;
    type?: string; // Original type from data (e.g., 'pch', 'station')
}

interface RawNode {
    xId: string;
    name: string;
    type: string;
    children?: RawNode[];
    shortName?: string;
}

// Helper to determine risk group based on type
function getRiskGroup(type: string): 'low' | 'medium' | 'high' {
    const highRisk = ['pch', 'tch', 'vchd', 'ech', 'pmc', 'shch', 'vchn'];
    const mediumRisk = ['station', 'mtu', 'factory', 'depot'];
    if (highRisk.includes(type.toLowerCase())) return 'high';
    if (mediumRisk.includes(type.toLowerCase())) return 'medium';
    return 'low';
}

// Helper to determine profile based on type/name
function getProfile(type: string, name: string): string {
    const t = type.toLowerCase();
    const n = name.toLowerCase();
    if (t === 'tch' || n.includes('lokomotiv')) return 'locomotive';
    if (t === 'vchd' || n.includes('vagon')) return 'wagon';
    if (t === 'pch' || n.includes('yo\'l masofasi')) return 'road';
    if (t === 'ech' || n.includes('elektr')) return 'electric';
    if (t === 'shch' || n.includes('aloqa')) return 'traffic'; // Signaling is close to traffic/electric
    if (t === 'station') return 'traffic';
    if (n.includes('zavod')) return 'factory';
    return 'traffic'; // Default
}

// Helper to map level
function getLevel(type: string, hasChildren: boolean): 'management' | 'supervisor' | 'subsidiary' {
    if (type === 'ao' || type === 'management') return 'management';
    if (type === 'mtu' || (hasChildren && type !== 'station')) return 'supervisor';
    return 'subsidiary';
}

const RAW_DATA: RawNode = {
    xId: "1574",
    type: "ao",
    name: "O'zbekiston temir yo'llari AJ",
    shortName: "UTY",
    children: [
        { xId: "1532", type: "management", name: "Temiryo'lyonilg'ita'min boshqarmasi" },
        { xId: "1511", type: "management", name: "Toshkent yo'lovchi vagonlarini qurish va ta'mirlash zavodi AJ" },
        { xId: "1540", type: "management", name: "1-son qurilish montaj poezdi MChJ" },
        { xId: "1515", type: "management", name: "Andijon mekhanika zavodi AJ" },
        { xId: "2314", type: "ao", name: "Temiryo‘lekspress AJ" },
        { xId: "2313", type: "ao", name: "Uztemiryo‘lmashta’mir AJ" },
        {
            xId: "2311", type: "ao", name: "O'zvagonta'mir AJ",
            children: [
                { xId: "2319", type: "vchd", name: "Andijon vagon deposi" },
                { xId: "1324", type: "vchd", name: "Xovos vagon deposi" },
                { xId: "474", type: "vchd", name: "Termiz vagon deposi" },
                { xId: "473", type: "vchd", name: "Qo‘ng‘irot vagon deposi" },
                { xId: "467", type: "vchd", name: "Samarqand vagon deposi" }
            ]
        },
        { xId: "1541", type: "management", name: "1-son energomontaj poezdi MChJ" },
        { xId: "2312", type: "ao", name: "Quyuv mexanika zavodi AJ" },
        {
            xId: "1555", type: "management", name: "Texnik va texnologik nazorat departamenti",
            children: [{ xId: "2309", type: "management", name: "Nbt" }]
        },
        {
            xId: "2229", type: "management", name: "Markaziy apparat",
            children: [
                { xId: "2231", type: "management", name: "Personalni boshqarish va kadrlarni tayyorlash departamenti" },
                { xId: "2232", type: "management", name: "Iqtisodiy tahlil va prognozlash departamenti" },
                { xId: "2233", type: "management", name: "Yuridik deparatmenti" },
                { xId: "2237", type: "management", name: "Korrupsiyaga qarshi kurashish boshqarmasi" },
                { xId: "2241", type: "management", name: "Kiberxavfsizlik boshqarmasi" }
            ]
        },
        {
            xId: "2197", type: "ao", name: "Toshkent mexanika zavodi AJ",
            children: [
                { xId: "2198", type: "mchj", name: "Andijon mexanika korxonasi MCHJ" },
                { xId: "2199", type: "mchj", name: "Farg'ona mexanika korxonasi MCHJ" }
            ]
        },
        {
            xId: "2200", type: "default", name: "Temir yo‘l ijtimoiy xizmatlar muassasasi",
            children: [
                { xId: "2201", type: "default", name: "Markaziy klinik kasalxonasi" },
                { xId: "2202", type: "default", name: "Markaziy poliklinika" },
                { xId: "2203", type: "default", name: "Yo'l bolalar kasalxonasi" },
                { xId: "2205", type: "default", name: "Qo'qon temir yo'l shifoxonasi" },
                { xId: "2206", type: "default", name: "Andijon temir yo'l shifoxonasi" },
                { xId: "2207", type: "default", name: "Samarqand temir yo'l shifoxonasi" },
                { xId: "2208", type: "default", name: "Buxoro temir yo'l shifoxonasi" },
                { xId: "2209", type: "default", name: "Qarshi temir yo'l shifoxonasi" },
                { xId: "2210", type: "default", name: "Termiz temir yo'l shifoxonasi" },
                { xId: "2211", type: "default", name: "Urganch temir yo'l shifoxonasi" },
                { xId: "2212", type: "default", name: "Xo'jayli temir yo'l shifoxonasi" },
                { xId: "2213", type: "default", name: "Qo'ng'irot temir yo'l shifoxonasi" },
                { xId: "2215", type: "default", name: "Markaziy sanitariya epidemiologiya stansiyasi" }
            ]
        },
        {
            xId: "2188", type: "ao", name: "O‘ztemiryo‘lyo‘lovchi AJ",
            children: [
                { xId: "2189", type: "default", name: "Xalqaro yo‘nalishlarda yo‘lovchilarga xizmat ko‘rsatish filiali" },
                { xId: "2190", type: "default", name: "Yo'lovchi vagonlarni texnik va texnologik tayyorlash, ta'mirlash filiali" },
                { xId: "2191", type: "default", name: "Tezyurar yo‘nalishlarda yo‘lovchilarga xizmat ko‘rsatish filiali" },
                { xId: "2193", type: "default", name: "Mahalliy yo‘nalishlarda yo‘lovchilarga xizmat ko‘rsatish filiali" },
                { xId: "2194", type: "default", name: "Andijon filiali" },
                { xId: "2195", type: "default", name: "Shahar atrofida yo‘lovchi tashish MCHJ" },
                { xId: "2196", type: "default", name: "Temiyo‘lvokzallari MCHJ" }
            ]
        },
        {
            xId: "1774", type: "ao", name: "Temiryo'lkargo AJ",
            children: [
                { xId: "471", type: "vchd", name: "Buxoro vagon deposi" },
                { xId: "472", type: "vchd", name: "Qo‘qon vagon deposi" },
                { xId: "470", type: "vchd", name: "Qarshi vagon deposi" },
                { xId: "475", type: "vchd", name: "Toshkent vagon deposi" }
            ]
        },
        {
            xId: "1575", type: "ao", name: "Temiryo'linfratuzilma AJ",
            children: [
                { xId: "1387", type: "smd", name: "Temir yo‘l monitoringi va diagnostika markazi" },
                { xId: "2261", type: "mchj", name: "DAS UTY MCHJ" },
                {
                    xId: "16", type: "mtu", name: "Buxoro mintaqaviy temir yo'l uzeli",
                    children: [
                        { xId: "1409", type: "pch", name: "Ziyovuddin temir yo‘l masofasi" },
                        { xId: "1780", type: "pch", name: "Qorlitog' temir yo'l masofasi" },
                        { xId: "1410", type: "shch", name: "Navoiy signalizatsiya va aloqa distansiyasi" },
                        { xId: "1404", type: "ech", name: "Samarqand elektr taʼminot distansiyasi" },
                        { xId: "1408", type: "pch", name: "Uchquduq temir yo‘l masofasi" },
                        { xId: "1406", type: "pch", name: "Samarqand temir yo‘l masofasi" },
                        { xId: "1405", type: "shch", name: "Samarqand signalizatsiya va aloqa distansiyasi" },
                        { xId: "1401", type: "shch", name: "Buxoro signalizatsiya va aloqa distansiyasi" },
                        { xId: "1400", type: "pch", name: "Buxoro temir yo‘l masofasi" },
                        { xId: "1399", type: "tch", name: "Buxoro lokomotiv deposi" },
                        { xId: "1402", type: "ech", name: "Buxoro elektr taʼminot distansiyasi" },
                        { xId: "440", type: "pmc", name: "17-son Buxoro temir yo‘l mashina bekati" },
                        // Stations (Sample)
                        { xId: "1200", type: "station", name: "Navoiy" },
                        { xId: "1189", type: "station", name: "Buxoro-1" },
                        { xId: "1169", type: "station", name: "Samarqand" }
                    ]
                },
                {
                    xId: "17", type: "mtu", name: "Qo'ng'irot mintaqaviy temir yo'l uzeli",
                    children: [
                        { xId: "1422", type: "pmc", name: "279-son Qo‘ng‘irot temir yo‘l mashina bekati" },
                        { xId: "1416", type: "ech", name: "Qo‘ng‘irot elektr taʼminot distansiyasi" },
                        { xId: "1414", type: "pch", name: "Qo‘ng‘irot temir yo‘l masofasi" },
                        { xId: "1417", type: "pch", name: "Qoraqalpog‘iston temir yo‘l masofasi" },
                        { xId: "1413", type: "tch", name: "Qo‘ng‘irot lokomotiv deposi" },
                        { xId: "1418", type: "tch", name: "Urgench lokomotiv deposi" },
                        { xId: "1419", type: "pch", name: "Urganch temir yo‘l masofasi" },
                        { xId: "1420", type: "shch", name: "Urgench signalizatsiya va aloqa distansiyasi" },
                        { xId: "1421", type: "ech", name: "Miskin elektr taʼminot distansiyasi" },
                        { xId: "1415", type: "shch", name: "Qo‘ng‘irot signalizatsiya va aloqa distansiyasi" },
                        // Stations (Sample)
                        { xId: "1258", type: "station", name: "Nukus" },
                        { xId: "1252", type: "station", name: "Urganch" }
                    ]
                },
                {
                    xId: "19", type: "mtu", name: "Termiz mintaqaviy temir yo'l uzeli",
                    children: [
                        { xId: "1431", type: "shch", name: "Termiz signalizatsiya va aloqa distansiyasi" },
                        { xId: "1434", type: "pch", name: "Darband temir yo‘l masofasi" },
                        { xId: "1432", type: "tch", name: "Termiz lokomotiv deposi" },
                        { xId: "1433", type: "pch", name: "Termiz temir yo‘l masofasi" },
                        { xId: "462", type: "pmc", name: "Xayrobod temir yo‘l mashina bekati" },
                        { xId: "461", type: "ech", name: "Termiz elektr taʼminot distansiyasi" },
                        // Stations
                        { xId: "1229", type: "station", name: "Termiz" }
                    ]
                },
                {
                    xId: "18", type: "mtu", name: "Qarshi mintaqaviy temir yo'l uzeli",
                    children: [
                        { xId: "1425", type: "pch", name: "Qarshi temir yo‘l masofasi" },
                        { xId: "1428", type: "pch", name: "Qashqadaryo temir yo‘l masofasi" },
                        { xId: "1424", type: "tch", name: "Qarshi lokomotiv deposi" },
                        { xId: "1427", type: "ech", name: "Qarshi elektr taʼminot distansiyasi" },
                        { xId: "453", type: "shch", name: "Qarshi signalizatsiya va aloqa distansiyasi" },
                        // Stations
                        { xId: "1215", type: "station", name: "Qarshi" }
                    ]
                },
                {
                    xId: "15", type: "mtu", name: "Qo'qon mintaqaviy temir yo'l uzeli",
                    children: [
                        { xId: "421", type: "tch", name: "Qo‘qon lokomotiv deposi" },
                        { xId: "425", type: "pch", name: "Andijon temir yo‘l masofasi" },
                        { xId: "1389", type: "pch", name: "Qo‘qon temir yo‘l masofasi" },
                        { xId: "1391", type: "shch", name: "Qo‘qon signalizatsiya va aloqa distansiyasi" },
                        { xId: "1392", type: "ech", name: "Qo‘qon elektr taʼminot distansiyasi" },
                        { xId: "1393", type: "vchn", name: "Oltiariq vagonlarni bug‘lab yuvish korxonasi" },
                        { xId: "1396", type: "pch", name: "Qamchiq temir yo‘l masofasi" },
                        { xId: "1397", type: "pmc", name: "164-son Qo‘qon temir yo‘l mashina bekati" },
                        // Stations
                        { xId: "1267", type: "station", name: "Qo’qon" },
                        { xId: "1296", type: "station", name: "Andijon-1" },
                        { xId: "1275", type: "station", name: "Namangan" }
                    ]
                },
                {
                    xId: "14", type: "mtu", name: "Toshkent mintaqaviy temir yo'l uzeli",
                    children: [
                        { xId: "1779", type: "pch", name: "Xovos temir yo'l masofasi" },
                        { xId: "1386", type: "pmc", name: "203-son Chuqursoy temir yo‘l mashina bekati" },
                        { xId: "1380", type: "shch", name: "Toshkent signalizasiyasi va aloqa distansiyasi" },
                        { xId: "1385", type: "pch", name: "Jizzax temir yo‘l masofasi" },
                        { xId: "1439", type: "ech", name: "Toshkent elektr ta'minot distansiyasi" },
                        { xId: "1377", type: "pch", name: "Salar temir yo'l masofasi" },
                        { xId: "1438", type: "pch", name: "Toshkent temir yo'l masofasi" },
                        { xId: "1382", type: "ech", name: "Xovos elektr ta'minot distansiyasi" },
                        // Stations
                        { xId: "1126", type: "station", name: "Toshkent" },
                        { xId: "1035", type: "station", name: "Toshkent markaziy vokzali" },
                        { xId: "1039", type: "station", name: "Janubiy vokzal" },
                        { xId: "1147", type: "station", name: "Guliston" },
                        { xId: "1162", type: "station", name: "Jizzax" }
                    ]
                }
            ]
        }
    ]
};

function flattenHierarchy(node: RawNode, supervisorId: string | null = null): OrganizationNode[] {
    const hasChildren = !!(node.children && node.children.length > 0);
    const level = getLevel(node.type, hasChildren);

    const orgNode: OrganizationNode = {
        id: node.xId,
        name: node.name,
        level: level,
        supervisorId: supervisorId,
        riskGroup: getRiskGroup(node.type),
        employees: Math.floor(Math.random() * 500) + 50, // Simulated employee count
        profile: getProfile(node.type, node.name),
        type: node.type
    };

    let result: OrganizationNode[] = [orgNode];

    if (node.children) {
        node.children.forEach(child => {
            result = result.concat(flattenHierarchy(child, node.xId));
        });
    }

    return result;
}

export const UZ_RAILWAY_DATA: OrganizationNode[] = flattenHierarchy(RAW_DATA);

// Helper functions
export function getOrganizationById(id: string): OrganizationNode | undefined {
    return UZ_RAILWAY_DATA.find(org => org.id === id);
}

export function getChildOrganizations(parentId: string): OrganizationNode[] {
    return UZ_RAILWAY_DATA.filter(org => org.supervisorId === parentId);
}

export function getAllDescendants(parentId: string): OrganizationNode[] {
    const descendants: OrganizationNode[] = [];
    const children = getChildOrganizations(parentId);

    for (const child of children) {
        descendants.push(child);
        descendants.push(...getAllDescendants(child.id));
    }

    return descendants;
}

export function getOrganizationPath(id: string): OrganizationNode[] {
    const path: OrganizationNode[] = [];
    let current = getOrganizationById(id);

    while (current) {
        path.unshift(current);
        current = current.supervisorId ? getOrganizationById(current.supervisorId) : undefined;
    }

    return path;
}
