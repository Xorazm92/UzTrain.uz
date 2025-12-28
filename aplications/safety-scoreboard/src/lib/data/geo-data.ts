
// Coordinates for major railway hubs in Uzbekistan
export const RAILWAY_COORDINATES: Record<string, [number, number]> = {
    // MTU Locations (Hubs)
    "14": [41.2995, 69.2401], // Toshkent MTU
    "15": [40.5409, 70.9364], // Qo'qon MTU
    "16": [39.7681, 64.4556], // Buxoro MTU
    "17": [42.9833, 59.8333], // Qo'ng'irot MTU (approx Nukus/Kungrad)
    "18": [38.8667, 65.8000], // Qarshi MTU
    "19": [37.2285, 67.2753], // Termiz MTU

    // Specific Stations/Depots based on City Names
    "toshkent": [41.2995, 69.2401],
    "samarqand": [39.6733, 66.9550],
    "buxoro": [39.7747, 64.4286],
    "navoiy": [40.0844, 65.3792],
    "andijon": [40.7853, 72.3489],
    "namangan": [41.0016, 71.6662],
    "farg'ona": [40.3864, 71.7864],
    "qarshi": [38.8612, 65.7847],
    "termiz": [37.2285, 67.2753],
    "urganch": [41.5500, 60.6315],
    "nukus": [42.4619, 59.6166],
    "jizzax": [40.1250, 67.8808],
    "guliston": [40.4897, 68.7842],
    "qo'qon": [40.5286, 70.9425],
    "miskin": [41.6961, 61.3508], // Approx
    "xovos": [40.2333, 68.7500], // Xovos town
    "uchquduq": [42.1567, 63.5553],
    "zarafshon": [41.5736, 64.2003],
    "denov": [38.2750, 67.8972]
};

// Helper to get consistent coordinates for a company
// Tries to match ID, then Name content (e.g. if name contains "Samarqand")
export function getCoordinates(id: string, name: string): [number, number] | null {
    // 1. Check exact ID match
    if (RAILWAY_COORDINATES[id]) return RAILWAY_COORDINATES[id];

    // 2. Check name partial match
    const lowerName = name.toLowerCase();
    for (const [key, coords] of Object.entries(RAILWAY_COORDINATES)) {
        if (lowerName.includes(key)) {
            // Add a small random jitter so markers don't overlap perfectly if multiple match "Toshkent"
            return [
                coords[0] + (Math.random() - 0.5) * 0.05,
                coords[1] + (Math.random() - 0.5) * 0.05
            ];
        }
    }

    // Default fallback (center of Uzbekistan approx) or null
    return null; // [41.3, 64.6] 
}
