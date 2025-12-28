
// Simplified coordinates for Uzbekistan Regions (Viloyats)
// These are low-resolution approximations intended for dashboard visualization.
// Format: [Lat, Lng][]

export const UZ_REGIONS_GEO: Record<string, [number, number][]> = {
    // 1. Qoraqalpog'iston (North West - Large)
    'qr': [
        [45.6, 58.3], [45.6, 61.3], [44.0, 62.0], [42.1, 62.1], [41.2, 61.0],
        [40.8, 60.5], [41.2, 59.8], [42.0, 56.0], [43.5, 56.0], [45.0, 57.0]
    ],
    // 2. Xorazm (South of QR, small)
    'xo': [
        [41.8, 60.0], [41.8, 61.4], [41.2, 61.4], [40.8, 61.0], [41.0, 60.0]
    ],
    // 3. Navoiy (Central North - Large)
    'nw': [
        [44.0, 62.0], [44.0, 64.5], [42.5, 66.0], [40.0, 66.0],
        [39.8, 65.0], [40.5, 64.0], [41.5, 64.0], [42.1, 62.1]
    ],
    // 4. Buxoro (Central South)
    'bu': [
        [41.2, 61.0], [41.5, 64.0], [40.5, 64.0], [39.0, 64.0],
        [38.8, 62.0], [39.3, 62.0], [40.8, 60.5]
    ],
    // 5. Samarqand (Central)
    'sa': [
        [40.0, 66.0], [40.0, 67.5], [39.2, 67.5], [38.8, 66.5], [39.8, 65.0]
    ],
    // 6. Qashqadaryo (South)
    'qa': [
        [39.3, 64.5], [39.3, 67.0], [38.5, 67.0],
        [38.0, 66.5], [38.0, 64.5], [39.0, 64.0]
    ],
    // 7. Surxondaryo (South East tip)
    'su': [
        [38.5, 66.8], [38.5, 68.3], [37.2, 68.0], [37.2, 66.5], [38.0, 66.5]
    ],
    // 8. Jizzax (Central East)
    'ji': [
        [41.0, 67.5], [41.2, 68.5], [39.8, 68.5], [39.2, 67.5], [40.0, 67.5]
    ],
    // 9. Sirdaryo (Small, between Jizzax and Tashkent)
    'si': [
        [41.0, 68.5], [41.0, 69.2], [40.2, 69.0], [40.2, 68.5]
    ],
    // 10. Toshkent (North East leg)
    'to': [
        [42.2, 69.2], [42.2, 71.0], [40.8, 71.0], [40.8, 69.2], [41.0, 69.2]
    ],
    // 11. Namangan (Valley North)
    'na': [
        [41.5, 70.5], [41.5, 72.0], [40.8, 72.0], [40.8, 70.5]
    ],
    // 12. Farg'ona (Valley South)
    'fa': [
        [40.8, 70.8], [40.8, 72.8], [40.0, 72.0], [40.0, 70.8]
    ],
    // 13. Andijon (Valley East tip)
    'an': [
        [41.0, 72.0], [41.0, 73.2], [40.4, 73.2], [40.4, 72.0]
    ]
};

// Mapping MTU IDs to Region Codes
// 17: Qo'ng'irot (QR, XO)
// 16: Buxoro (BU, SA, NW)
// 14: Toshkent (TO, SI, JI)
// 15: Qo'qon (NA, FA, AN)
// 18: Qarshi (QA)
// 19: Termiz (SU)
export const MTU_TO_REGIONS: Record<string, string[]> = {
    '17': ['qr', 'xo'],
    '16': ['bu', 'sa', 'nw'],
    '14': ['to', 'si', 'ji'],
    '15': ['na', 'fa', 'an'],
    '18': ['qa'],
    '19': ['su']
};
