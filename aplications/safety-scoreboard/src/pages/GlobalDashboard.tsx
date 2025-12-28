
import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Activity,
    ShieldAlert,
    Users,
    Wrench,
    Snowflake,
    Globe,
    AlertTriangle,
    ArrowRight,
    MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GaugeChart from 'react-gauge-chart';
import { useToast } from '@/hooks/use-toast';
import { UzbekistanMap } from '@/components/Map/UzbekistanMap';
import { getOrganizationById } from '@/lib/data/organization-data';


const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) || '';


export default function GlobalDashboard() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGlobalData();
    }, []);

    const fetchGlobalData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/global-dashboard`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Global Dashboard Data:', result); // Debug log
            setData(result);

        } catch (error) {
            console.error("Failed to fetch global data:", error);
            toast({
                title: "Xatolik",
                description: "Server bilan bog'lanib bo'lmadi. Backend serverni ishga tushiring: cd server && npm start",
                variant: "destructive"
            });
            // Don't set mock data - show error state instead
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
                </div>
            </Layout>
        );
    }

    if (!data) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <AlertTriangle className="h-16 w-16 text-yellow-500" />
                    <h2 className="text-2xl font-bold">Ma'lumotlar yuklanmadi</h2>
                    <p className="text-muted-foreground text-center max-w-md">
                        Backend server ishlamayapti yoki tarmoq orqali ulanib bo‘lmadi. Serverni ishga tushiring va qayta urinib ko‘ring.
                    </p>
                    <Button onClick={fetchGlobalData} className="mt-4">
                        Qayta urinish
                    </Button>
                </div>
            </Layout>
        );
    }

    // Helper to resolve MTU Name
    const getRegionName = (id: string) => {
        const org = getOrganizationById(id);
        if (org) return org.name;
        // Fallback or simplistic mapping
        if (id === '14') return "Toshkent MTU";
        if (id === '15') return "Qo'qon MTU";
        if (id === '16') return "Buxoro MTU";
        if (id === '17') return "Qo'ng'irot MTU";
        if (id === '18') return "Qarshi MTU";
        if (id === '19') return "Termiz MTU";
        return id === 'other' || !id ? "Boshqa Korxonalar" : id;
    };

    // Helper for Status Card
    const StatusCard = ({ title, icon: Icon, data }: { title: string, icon: any, data: any }) => (
        <Card className={`border-l-4 ${data.status === 'green' ? 'border-l-green-500' : data.status === 'yellow' ? 'border-l-yellow-500' : 'border-l-red-500'} shadow-sm hover:shadow-md transition-shadow`}>
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div className={`p-2 rounded-lg ${data.status === 'green' ? 'bg-green-100 text-green-600' : data.status === 'yellow' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant="outline" className={`${data.status === 'green' ? 'text-green-600' : data.status === 'yellow' ? 'text-yellow-600' : 'text-red-600'} border-current`}>
                        {data.status === 'green' ? 'Yaxshi' : data.status === 'yellow' ? 'Diqqat' : 'Kritik'}
                    </Badge>
                </div>
                <h3 className="font-bold text-lg mb-1">{typeof data.value === 'number' && data.value < 1 ? data.value * 100 : typeof data.value === 'number' ? data.value.toFixed(1) : data.value} {title === 'Xodimlar' || title.includes('tayyorgarlik') ? '%' : ''}</h3>
                <p className="text-xs text-muted-foreground font-medium leading-tight">
                    {data.text}
                </p>
            </CardContent>
        </Card>
    );

    return (
        <Layout>
            <div className="space-y-8 animate-in fade-in duration-700">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -ml-16 -mb-16"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <Activity className="w-6 h-6 text-blue-400" />
                            <h1 className="text-2xl font-bold tracking-tight">GLOBAL DASHBOARD</h1>
                        </div>
                        <p className="text-slate-400 text-sm max-w-xl">
                            "Command Center" - Butun tizimning strategik xavfsizlik monitoringi.
                        </p>
                    </div>
                    <div className="relative z-10 flex gap-3">
                        <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-colors" onClick={fetchGlobalData}>
                            Yangilash
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-500 text-white border-none shadow-lg shadow-blue-500/20" onClick={() => navigate('/dashboard')}>
                            Operativ Panel <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>

                {/* 1. Global Safety Index */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-1 shadow-lg border-t-4 border-t-blue-500 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
                        <CardHeader className="text-center pb-2">
                            <CardTitle className="text-xl text-slate-700 dark:text-slate-200">Xavfsizlik Sferasi</CardTitle>
                            <CardDescription>Yagona Salomatlik Indeksi</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center p-6">
                            <div className="w-full max-w-[280px] relative">
                                <GaugeChart
                                    id="global-safety-gauge"
                                    nrOfLevels={20}
                                    colors={["#EF4444", "#F59E0B", "#10B981"]}
                                    arcWidth={0.2}
                                    percent={data.safetyIndex.value / 100}
                                    textColor="#64748B"
                                    needleColor="#64748B"
                                    formatTextValue={(value) => value + '%'}
                                />
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-8 text-center">
                                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${data.safetyIndex.value >= 80 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {data.safetyIndex.value >= 80 ? 'BARQAROR' : 'XAVFLI'}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full mt-8">
                                <div className="text-center p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
                                    <div className="text-xs text-muted-foreground mb-1">Bilim</div>
                                    <div className="font-bold text-blue-600">{data.safetyIndex.components.competency.toFixed(0)}%</div>
                                </div>
                                <div className="text-center p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
                                    <div className="text-xs text-muted-foreground mb-1">Texnik</div>
                                    <div className="font-bold text-indigo-600">{data.safetyIndex.components.technical.toFixed(0)}%</div>
                                </div>
                                <div className="text-center p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
                                    <div className="text-xs text-muted-foreground mb-1">Ta'minot</div>
                                    <div className="font-bold text-emerald-600">{data.safetyIndex.components.supply.toFixed(0)}%</div>
                                </div>
                                <div className="text-center p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
                                    <div className="text-xs text-muted-foreground mb-1">Hodisasiz</div>
                                    <div className="font-bold text-orange-600">{data.safetyIndex.components.incidentFree.toFixed(0)}%</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 2. Status Matrix */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 content-start">
                        <StatusCard title="Muammoli Korxonalar" icon={AlertTriangle} data={data.statusMatrix.companies} />
                        <StatusCard title="Xodimlar Bilimi" icon={Users} data={data.statusMatrix.employees} />
                        <StatusCard title="Uskunalar Holati" icon={Wrench} data={data.statusMatrix.equipment} />
                        <StatusCard title="Qishki Mavsum" icon={Snowflake} data={data.statusMatrix.appeSeason} />
                        <StatusCard title="Yaroqsiz SHHV" icon={ShieldAlert} data={data.statusMatrix.appeExpired} />
                    </div>
                </div>

                {/* 3. Regional Breakdown (New Section) */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-orange-500" />
                        Hududiy Bo'limlar Natijalari (MTU kesimida)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {data.regionalData.map((region: any) => (
                            <Card key={region.id} className="hover:shadow-md transition-shadow dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-bold flex justify-between items-start">
                                        <span className="truncate pr-2" title={getRegionName(region.id)}>{getRegionName(region.id)}</span>
                                        <Badge className={`${region.avgRating >= 80 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'} whitespace-nowrap`}>
                                            {region.avgRating.toFixed(1)}
                                        </Badge>
                                    </CardTitle>
                                    <CardDescription className="text-xs flex items-center gap-1">
                                        <Users className="w-3 h-3" /> {region.count} ta korxona biriktirilgan
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-xs">
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Kompetensiya:</span>
                                            <span className="font-semibold">{region.components.competency.toFixed(0)}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${region.components.competency}%` }}></div>
                                        </div>

                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-muted-foreground">Texnik holat:</span>
                                            <span className="font-semibold">{region.components.technical.toFixed(0)}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${region.components.technical}%` }}></div>
                                        </div>

                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-muted-foreground">Baxtsiz hodisa:</span>
                                            <span className="font-semibold">{region.components.incidentFree < 100 ? 'BOR' : "YO'Q"}</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${region.components.incidentFree < 80 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${region.components.incidentFree}%` }}></div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* 4. Geo Map & Top Problematic */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Map Section */}
                    <Card className="lg:col-span-2 border-slate-200 dark:border-slate-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="w-5 h-5 text-blue-500" />
                                Hududiy Xavfsizlik Xaritasi
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 overflow-hidden rounded-b-xl">
                            {(() => {
                                const mapData = data.regionalData.map((geo: any) => ({
                                    id: geo.id,
                                    name: getRegionName(geo.id),
                                    overall_index: geo.avgRating,
                                    count: geo.count,
                                    profile: 'hudud',
                                }));
                                console.log('Map Data:', mapData);
                                return <UzbekistanMap companies={mapData} />;
                            })()}
                        </CardContent>
                    </Card>

                    {/* Top 5 Problematic Table */}
                    <Card className="border-red-100 dark:border-red-900 bg-red-50/10 dark:bg-red-900/5">
                        <CardHeader>
                            <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" />
                                E'tibor Talab ("Top-5")
                            </CardTitle>
                            <CardDescription>Reytingi eng past korxonalar</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data.topProblematic.map((item: any, index: number) => (
                                    <div key={item.id} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600 font-bold text-xs">
                                                {index + 1}
                                            </span>
                                            <span className="font-medium text-sm">{item.name}</span>
                                        </div>
                                        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 font-bold">
                                            {item.rating.toFixed(1)}
                                        </Badge>
                                    </div>
                                ))}
                                {data.topProblematic.length === 0 && (
                                    <div className="text-center text-muted-foreground text-sm py-4">
                                        Muammoli korxonalar yo'q 🎉
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
