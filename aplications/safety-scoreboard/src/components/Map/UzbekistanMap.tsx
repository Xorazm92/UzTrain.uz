
import { useEffect, useState } from 'react';

// MTU to Region mapping
const MTU_CONFIG = {
    '17': {
        regions: ['UZQR', 'UZXO'],
        name: 'Qo\'ng\'irot MTU',
        center: [42, 60]
    },
    '16': {
        regions: ['UZBU', 'UZSA', 'UZNW'],
        name: 'Buxoro MTU',
        center: [41, 64]
    },
    '14': {
        regions: ['UZTK', 'UZTO', 'UZSI', 'UZJI'],
        name: 'Toshkent MTU',
        center: [41, 69]
    },
    '15': {
        regions: ['UZNG', 'UZFA', 'UZAN'],
        name: 'Qo\'qon MTU',
        center: [41, 72]
    },
    '18': {
        regions: ['UZQA'],
        name: 'Qarshi MTU',
        center: [39, 66]
    },
    '19': {
        regions: ['UZSU'],
        name: 'Termiz MTU',
        center: [38, 67]
    }
};

const getColor = (rating: number) => {
    if (rating >= 80) return { fill: '#22c55e', name: 'Yaxshi' };
    if (rating >= 50) return { fill: '#eab308', name: 'O\'rtacha' };
    return { fill: '#ef4444', name: 'Qoniqarsiz' };
};

interface UzbekistanMapProps {
    companies: any[];
}

export function UzbekistanMap({ companies }: UzbekistanMapProps) {
    const [hoveredMTU, setHoveredMTU] = useState<string | null>(null);
    const [svgContent, setSvgContent] = useState<string>('');

    const isGlobalMode = companies.some(c => MTU_CONFIG[c.id as keyof typeof MTU_CONFIG]);

    useEffect(() => {
        // Load SVG file
        fetch('/uz.svg')
            .then(res => res.text())
            .then(text => setSvgContent(text))
            .catch(err => console.error('SVG load error:', err));
    }, []);

    useEffect(() => {
        if (!svgContent || !isGlobalMode) return;

        // Apply colors to regions
        companies.forEach(mtu => {
            const config = MTU_CONFIG[mtu.id as keyof typeof MTU_CONFIG];
            if (!config) return;

            const color = getColor(mtu.overall_index);

            config.regions.forEach(regionId => {
                const element = document.getElementById(regionId);
                if (element) {
                    element.style.fill = color.fill;
                    element.style.fillOpacity = '0.85';
                    element.style.stroke = '#ffffff';
                    element.style.strokeWidth = '4';
                    element.style.cursor = 'pointer';
                    element.style.transition = 'all 0.2s ease';

                    element.onmouseenter = () => {
                        element.style.fillOpacity = '0.95';
                        element.style.strokeWidth = '6';
                        setHoveredMTU(mtu.id);
                    };

                    element.onmouseleave = () => {
                        element.style.fillOpacity = '0.85';
                        element.style.strokeWidth = '4';
                        setHoveredMTU(null);
                    };
                }
            });
        });
    }, [svgContent, companies, isGlobalMode]);

    if (!isGlobalMode) {
        return (
            <div className="h-[600px] w-full rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <p className="text-slate-500">Xarita faqat Global Dashboard uchun</p>
            </div>
        );
    }

    const hoveredData = hoveredMTU ? companies.find(c => c.id === hoveredMTU) : null;

    return (
        <div className="relative h-[600px] w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            {/* SVG Container */}
            <div
                className="w-full h-full flex items-center justify-center p-8"
                dangerouslySetInnerHTML={{ __html: svgContent }}
            />

            {/* Hover Info */}
            {hoveredData && (
                <div className="absolute top-6 left-6 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border-2 border-slate-300 dark:border-slate-600 p-4 min-w-[250px] animate-in fade-in slide-in-from-left-2 duration-200">
                    <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-white">
                        {MTU_CONFIG[hoveredData.id as keyof typeof MTU_CONFIG]?.name}
                    </h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Reyting:</span>
                            <span className={`font-bold px-3 py-1 rounded-lg text-white ${hoveredData.overall_index >= 80 ? 'bg-green-500' :
                                    hoveredData.overall_index >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}>
                                {hoveredData.overall_index.toFixed(1)}
                            </span>
                        </div>
                        {hoveredData.count && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
                                📍 {hoveredData.count} ta korxona
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Legend */}
            <div className="absolute bottom-6 right-6 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border-2 border-slate-200 dark:border-slate-700 p-4">
                <h4 className="font-bold text-sm mb-3 text-slate-800 dark:text-white">
                    📊 Reyting Shkalasi
                </h4>
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded bg-green-500"></div>
                        <span className="text-slate-700 dark:text-slate-300">80+ Yaxshi</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded bg-yellow-500"></div>
                        <span className="text-slate-700 dark:text-slate-300">50-79 O'rtacha</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded bg-red-500"></div>
                        <span className="text-slate-700 dark:text-slate-300">&lt;50 Qoniqarsiz</span>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {!svgContent && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-900/80">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
                        <p className="text-slate-600 dark:text-slate-400">Xarita yuklanmoqda...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
