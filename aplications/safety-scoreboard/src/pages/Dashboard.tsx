import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Building2, TrendingUp, Download, RefreshCw, Plus, Sparkles, Award, Target } from 'lucide-react';
import { isAuthenticated, getCurrentUser, hasPermission } from '@/lib/auth/auth';
import { supabase, Company } from '@/lib/supabase';
import { getZone } from '@/lib/utils/kpi-calculator';
import { UZ_RAILWAY_DATA, getAllDescendants } from '@/lib/data/organization-data';
import { useToast } from '@/hooks/use-toast';
import { CompanyRankingCard } from '@/components/CompanyRankingCard';
import { StatCard } from '@/components/StatCard';

export default function Dashboard() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrg, setSelectedOrg] = useState('all');
    const currentUser = getCurrentUser();

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }
        loadCompanies();
    }, [navigate]);

    const loadCompanies = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('companies')
                .select('*')
                .order('overall_index', { ascending: false });

            if (error) throw error;
            setCompanies(data || []);
        } catch (error) {
            console.error('Error loading companies:', error);
            toast({
                title: "Xatolik",
                description: "Ma'lumotlarni yuklashda xatolik yuz berdi",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const filteredCompanies = selectedOrg === 'all'
        ? companies
        : companies.filter(c => {
            if (c.id === selectedOrg) return true;

            // Get all descendant organizations from the static hierarchy
            const descendants = getAllDescendants(selectedOrg);
            const descendantIds = descendants.map(d => d.id);

            // 1. Show if company is in the descendant list (static data)
            if (descendantIds.includes(c.id)) return true;

            // 2. Show if company's parent is the selected org or one of its descendants (dynamic data)
            if (c.parent && (c.parent === selectedOrg || descendantIds.includes(c.parent))) return true;

            return false;
        });

    const stats = {
        total: filteredCompanies.length,
        green: filteredCompanies.filter(c => c.zone === 'green').length,
        yellow: filteredCompanies.filter(c => c.zone === 'yellow').length,
        red: filteredCompanies.filter(c => c.zone === 'red').length,
        avgScore: filteredCompanies.length > 0
            ? filteredCompanies.reduce((sum, c) => sum + c.overall_index, 0) / filteredCompanies.length
            : 0
    };

    const topCompanies = filteredCompanies.slice(0, 3);

    const handleExport = () => {
        const dataStr = JSON.stringify(companies, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `mm-reyting-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);

        toast({
            title: "Eksport muvaffaqiyatli",
            description: "Ma'lumotlar yuklab olindi"
        });
    };

    return (
        <Layout>
            <div className="space-y-8">
                {/* Header - Etsy Style */}
                <div className="relative">
                    <div className="absolute inset-0 gradient-warm dark:from-orange-950/30 dark:to-amber-950/30 opacity-50 rounded-3xl blur-3xl"></div>
                    <div className="relative bg-card rounded-2xl shadow-etsy-lg dark:shadow-none p-8 border border-orange-100 dark:border-orange-800">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-etsy flex-shrink-0">
                                    <Trophy className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
                                        Korxonalar Reytingi
                                    </h1>
                                    <p className="text-muted-foreground">
                                        Mehnat muhofazasi samaradorligini baholash platformasi
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Sparkles className="w-4 h-4 text-orange-500" />
                                        <span className="text-sm text-muted-foreground">
                                            {stats.total} ta korxona baholandi
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                {hasPermission('addCompany') && (
                                    <Button
                                        onClick={() => navigate('/companies/new')}
                                        className="gradient-primary hover:opacity-90 transition-opacity shadow-etsy"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Korxona Qo'shish
                                    </Button>
                                )}
                                {hasPermission('exportData') && (
                                    <Button variant="outline" onClick={handleExport} className="border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                                        <Download className="w-4 h-4 mr-2" />
                                        Eksport
                                    </Button>
                                )}
                                <Button variant="outline" onClick={loadCompanies} className="border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Yangilash
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Organization Filter */}
                <Card className="shadow-etsy dark:shadow-none border-orange-100 dark:border-orange-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <Target className="w-5 h-5 text-orange-500" />
                            <label className="text-sm font-semibold text-foreground">Tashkilot:</label>
                            <Select value={selectedOrg} onValueChange={setSelectedOrg}>
                                <SelectTrigger className="w-[300px] border-orange-200 dark:border-orange-800 focus:ring-orange-500">
                                    <SelectValue placeholder="Tashkilotni tanlang" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Barcha korxonalar</SelectItem>
                                    {UZ_RAILWAY_DATA.filter(org => org.level !== 'subsidiary').map(org => (
                                        <SelectItem key={org.id} value={org.id}>
                                            {org.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics - Etsy Style */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <StatCard
                        title="Jami korxonalar"
                        value={stats.total}
                        icon={Building2}
                        trend={null}
                        variant="default"
                        delay={0}
                    />
                    <StatCard
                        title="Yashil zona"
                        value={stats.green}
                        icon="🟢"
                        trend={null}
                        variant="green"
                        delay={100}
                    />
                    <StatCard
                        title="Sariq zona"
                        value={stats.yellow}
                        icon="🟡"
                        trend={null}
                        variant="yellow"
                        delay={200}
                    />
                    <StatCard
                        title="Qizil zona"
                        value={stats.red}
                        icon="🔴"
                        trend={null}
                        variant="red"
                        delay={300}
                    />
                    <StatCard
                        title="O'rtacha ball"
                        value={stats.avgScore.toFixed(1)}
                        icon={TrendingUp}
                        trend={null}
                        variant="primary"
                        delay={400}
                    />
                </div>

                {/* Top 3 Podium - Etsy Style */}
                {topCompanies.length >= 3 && (
                    <Card className="shadow-etsy-lg dark:shadow-none border-orange-100 dark:border-orange-800 overflow-hidden">
                        <div className="gradient-warm dark:from-orange-950/30 dark:to-amber-950/30 p-1">
                            <CardHeader className="bg-card rounded-t-xl">
                                <CardTitle className="flex items-center gap-2 text-2xl bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                                    <Award className="w-6 h-6 text-orange-500" />
                                    Top 3 Eng Yaxshi Korxonalar
                                </CardTitle>
                            </CardHeader>
                        </div>
                        <CardContent className="pt-8 pb-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* 2nd Place */}
                                {topCompanies[1] && (
                                    <div className="order-2 md:order-1 animate-slide-up" style={{ animationDelay: '100ms' }}>
                                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 text-center shadow-etsy dark:shadow-none hover-lift">
                                            <div className="text-5xl mb-3">🥈</div>
                                            <div className="text-lg font-bold text-foreground mb-2">{topCompanies[1].name}</div>
                                            <div className="text-4xl font-bold text-muted-foreground mb-2">{topCompanies[1].overall_index.toFixed(1)}</div>
                                            <div className="inline-block px-4 py-1 bg-white/60 dark:bg-black/40 rounded-full text-sm font-semibold text-muted-foreground">
                                                {getZone(topCompanies[1].overall_index).label}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* 1st Place */}
                                {topCompanies[0] && (
                                    <div className="order-1 md:order-2 animate-slide-up">
                                        <div className="bg-gradient-to-br from-yellow-100 via-amber-100 to-orange-100 dark:from-yellow-900/40 dark:via-amber-900/40 dark:to-orange-900/40 rounded-2xl p-8 text-center transform md:scale-110 shadow-etsy-xl dark:shadow-none hover-lift border border-orange-200 dark:border-orange-800">
                                            <div className="text-6xl mb-3">🥇</div>
                                            <div className="text-xl font-bold text-foreground mb-2">{topCompanies[0].name}</div>
                                            <div className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-3">
                                                {topCompanies[0].overall_index.toFixed(1)}
                                            </div>
                                            <div className="inline-block px-5 py-2 bg-white/80 dark:bg-black/40 rounded-full text-sm font-bold text-orange-700 dark:text-orange-400 shadow-etsy dark:shadow-none">
                                                {getZone(topCompanies[0].overall_index).label}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* 3rd Place */}
                                {topCompanies[2] && (
                                    <div className="order-3 animate-slide-up" style={{ animationDelay: '200ms' }}>
                                        <div className="bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-2xl p-6 text-center shadow-etsy dark:shadow-none hover-lift">
                                            <div className="text-5xl mb-3">🥉</div>
                                            <div className="text-lg font-bold text-foreground mb-2">{topCompanies[2].name}</div>
                                            <div className="text-4xl font-bold text-orange-700 dark:text-orange-400 mb-2">{topCompanies[2].overall_index.toFixed(1)}</div>
                                            <div className="inline-block px-4 py-1 bg-white/60 dark:bg-black/40 rounded-full text-sm font-semibold text-orange-700 dark:text-orange-400">
                                                {getZone(topCompanies[2].overall_index).label}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Companies Ranking Table */}
                <Card className="shadow-etsy-lg dark:shadow-none border-orange-100 dark:border-orange-800">
                    <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10 border-b border-orange-100 dark:border-orange-800">
                        <CardTitle className="text-2xl bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                            Barcha Korxonalar Reytingi
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {loading ? (
                            <div className="text-center py-16">
                                <div className="inline-block w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
                                <p className="text-muted-foreground font-medium">Yuklanmoqda...</p>
                            </div>
                        ) : filteredCompanies.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-etsy">
                                    <Building2 className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2">Hali korxonalar qo'shilmagan</h3>
                                <p className="text-muted-foreground mb-6">Yangi korxona qo'shish uchun yuqoridagi tugmani bosing</p>
                                {hasPermission('addCompany') && (
                                    <Button onClick={() => navigate('/companies/new')} className="gradient-primary hover:opacity-90 shadow-etsy">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Korxona Qo'shish
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredCompanies.map((company, index) => (
                                    <CompanyRankingCard
                                        key={company.id}
                                        company={company}
                                        rank={index + 1}
                                        onClick={() => navigate(`/companies/${company.id}`)}
                                        delay={index * 50}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
