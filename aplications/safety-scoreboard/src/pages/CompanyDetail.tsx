import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Building2,
  Users,
  Calendar,
  TrendingUp,
  AlertCircle,
  Edit,
  Trash2,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { supabase, Company } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { hasPermission } from '@/lib/auth/auth';
import { KPI_CONFIG } from '@/lib/constants/kpi-config';
import { cn } from '@/lib/utils';
import GaugeChart from 'react-gauge-chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadCompany(id);
    }
  }, [id]);

  const loadCompany = async (companyId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();

      if (error) throw error;
      setCompany(data);
    } catch (error) {
      console.error('Error loading company:', error);
      toast({
        title: "Xatolik",
        description: "Korxona ma'lumotlarini yuklashda xatolik",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!company || !confirm('Rostdan ham o\'chirmoqchimisiz?')) return;

    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', company.id);

      if (error) throw error;

      toast({
        title: "Muvaffaqiyatli",
        description: "Korxona o'chirildi"
      });

      navigate('/companies');
    } catch (error) {
      console.error('Error deleting company:', error);
      toast({
        title: "Xatolik",
        description: "O'chirishda xatolik yuz berdi",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-16">
          <div className="inline-block w-12 h-12 border-4 border-orange-200 dark:border-orange-800 border-t-orange-500 rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground font-medium">Yuklanmoqda...</p>
        </div>
      </Layout>
    );
  }

  if (!company) {
    return (
      <Layout>
        <div className="text-center py-16">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Korxona topilmadi</h2>
          <Button onClick={() => navigate('/companies')} className="mt-4">
            Orqaga qaytish
          </Button>
        </div>
      </Layout>
    );
  }

  const zoneConfig = {
    green: {
      bg: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-800 dark:text-green-400',
      badge: 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-400'
    },
    yellow: {
      bg: 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      text: 'text-yellow-800 dark:text-yellow-400',
      badge: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-400'
    },
    red: {
      bg: 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-800 dark:text-red-400',
      badge: 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-400'
    }
  };

  const zone = zoneConfig[company.zone] || zoneConfig.red;

  // Prepare data for charts
  const kpiChartData = company.kpis ? Object.entries(company.kpis).map(([key, result]: [string, any]) => ({
    name: KPI_CONFIG[key]?.name?.substring(0, 15) + '...', // Shorten names
    score: Number(result.score || 0)
  })).sort((a, b) => a.score - b.score) : []; // Sort by score ascending

  // Automatic Recommendations
  const getRecommendations = () => {
    if (!company.kpis) return [];

    const recommendations: string[] = [];
    const lowScores = Object.entries(company.kpis).filter(([_, result]: [string, any]) => Number(result.score) < 80);

    lowScores.forEach(([key, result]: [string, any]) => {
      const score = Number(result.score);
      const config = KPI_CONFIG[key];
      if (!config) return;

      if (key === 'ltifr' && score < 100) {
        recommendations.push(`⚠️ DIQQAT! Baxtsiz hodisalar soni ortgan. Xavfsizlik texnikasi bo'yicha nazoratni kuchaytirish shart.`);
      }
      if (key === 'training' && score < 70) {
        recommendations.push(`📚 Xodimlarni o'qitish darajasi past (${result.score || 0} ball). Navbatdan tashqari imtihonlar tashkil etilsin.`);
      }
      if (key === 'ppe' && score < 70) {
        recommendations.push(`🦺 Shaxsiy himoya vositalari bilan ta'minlashni darhol yaxshilash kerak.`);
      }
      if (key === 'violations' && score < 50) {
        recommendations.push(`🎫 Talonlar soni (qoidabuzarliklar) ko'paygan. Intizomiy choralarni ko'rib chiqish tavsiya etiladi.`);
      }
    });

    if (recommendations.length === 0) {
      recommendations.push("✅ Tabriklaymiz! Hozircha jiddiy kamchiliklar aniqlanmadi.");
    }
    return recommendations;
  };

  const recommendations = getRecommendations();

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/companies')}
            className="border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 text-muted-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Orqaga
          </Button>
          <div className="flex items-center gap-2">
            {hasPermission('editCompany') && (
              <Button
                variant="outline"
                onClick={() => navigate(`/companies/${company.id}/edit`)}
                className="border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 text-muted-foreground"
              >
                <Edit className="w-4 h-4 mr-2" />
                Tahrirlash
              </Button>
            )}
            {hasPermission('deleteCompany') && (
              <Button
                variant="destructive"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                O'chirish
              </Button>
            )}
          </div>
        </div>

        {/* Top Section: Info Card + Gauge + Recommendations (3 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* 1. Company Basic Info */}
          <Card className={cn("shadow-etsy-lg dark:shadow-none border h-full", zone.border, zone.bg)}>
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center shadow-sm border border-border">
                  <Building2 className="w-8 h-8 text-orange-500" />
                </div>
                <div>
                  <CardTitle className="text-2xl mb-1 text-foreground font-bold">{company.name}</CardTitle>
                  <CardDescription className="text-base text-muted-foreground font-medium">
                    {company.level} • {company.profile}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-orange-500" />
                    <span className="text-sm font-medium">Xodimlar</span>
                  </div>
                  <span className="font-bold">{company.employees.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-orange-500" />
                    <span className="text-sm font-medium">Sana</span>
                  </div>
                  <span className="font-bold">{new Date(company.date_added).toLocaleDateString('uz-UZ')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Overall Rating Gauge */}
          <Card className="shadow-etsy border border-orange-100 dark:border-orange-800 flex flex-col justify-center items-center p-6 bg-card">
            <h3 className="text-lg font-bold text-muted-foreground mb-4">Umumiy Reyting</h3>
            <div className="w-full max-w-[250px] relative">
              <GaugeChart
                id="gauge-chart-1"
                nrOfLevels={3}
                colors={["#EF4444", "#EAB308", "#22C55E"]}
                arcWidth={0.3}
                percent={company.overall_index / 100}
                textColor={company.overall_index >= 80 ? "#22C55E" : company.overall_index >= 50 ? "#EAB308" : "#EF4444"}
                formatTextValue={(value) => value + '%'}
              />
            </div>
            <Badge className={cn("mt-4 text-base px-6 py-1 font-bold shadow-sm", zone.badge)}>
              {company.zone === 'green' ? 'YAXSHI' :
                company.zone === 'yellow' ? 'QONIQARLI' :
                  'XAVFLI'}
            </Badge>
          </Card>

          {/* 3. AI Recommendations */}
          <Card className="shadow-etsy border border-orange-100 dark:border-orange-800 bg-card overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-blue-700 dark:text-blue-400">
                <FileText className="w-5 h-5" />
                Tizim Tavsiyalari
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 max-h-[300px] overflow-y-auto">
              <ul className="space-y-3">
                {recommendations.map((rec, index) => (
                  <li key={index} className="flex gap-3 text-sm p-3 bg-muted/50 rounded-lg border border-border">
                    {rec.includes('✅') ? null : <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />}
                    <span className="text-foreground leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* KPI Charts Section */}
        <Card className="shadow-etsy border-orange-100 dark:border-orange-800">
          <CardHeader>
            <CardTitle>KPI Ko'rsatkichlari Dinamikasi</CardTitle>
            <CardDescription>Barcha yo'nalishlar bo'yicha to'plangan ballar (Pastdan-yuqoriga)</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={kpiChartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Bar
                  dataKey="score"
                  name="Ball"
                  fill="#f97316"
                  radius={[0, 4, 4, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Detailed KPI Tabs */}
        <Tabs defaultValue="kpis" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-orange-50 dark:bg-orange-900/20 p-1 rounded-xl">
            <TabsTrigger
              value="kpis"
              className="data-[state=active]:bg-card data-[state=active]:text-orange-600 dark:data-[state=active]:text-orange-400 data-[state=active]:shadow-sm rounded-lg font-medium"
            >
              Batafsil KPI Ko'rsatkichlar
            </TabsTrigger>
            <TabsTrigger
              value="raw"
              className="data-[state=active]:bg-card data-[state=active]:text-orange-600 dark:data-[state=active]:text-orange-400 data-[state=active]:shadow-sm rounded-lg font-medium"
            >
              Xom Ma'lumotlar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="kpis" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {company.kpis && Object.entries(company.kpis).map(([key, result]: [string, any]) => {
              const config = KPI_CONFIG[key];
              if (!config) return null;

              const score = Number(result.score || 0);
              const value = Number(result.value || 0);

              return (
                <Card key={key} className="shadow-sm border border-orange-100 dark:border-orange-800 hover:shadow-md transition-shadow bg-card overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-orange-50/50 to-amber-50/50 dark:from-orange-950/20 dark:to-amber-950/20 border-b border-orange-50 dark:border-orange-800 p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{config.icon}</span>
                      <div>
                        <CardTitle className="text-base font-bold text-foreground leading-tight">{config.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Erishilgan ball</p>
                          <p className={cn("text-3xl font-extrabold", score >= 80 ? "text-green-600" : score >= 50 ? "text-amber-500" : "text-red-500")}>
                            {score.toFixed(1)}
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                          W: {(config.weight * 100).toFixed(0)}%
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Progress</span>
                          <span>{score.toFixed(0)}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn("h-full transition-all duration-1000", score >= 80 ? "bg-green-500" : score >= 50 ? "bg-amber-500" : "bg-red-500")}
                            style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                          />
                        </div>
                      </div>

                      <div className="pt-3 border-t border-dashed border-border mt-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Haqiqiy qiymat:</span>
                          <span className="font-mono font-bold bg-muted px-2 py-0.5 rounded text-foreground">
                            {value.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="raw">
            <Card className="shadow-sm border border-orange-100 dark:border-orange-800 bg-card">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-b border-orange-100 dark:border-orange-800">
                <CardTitle className="text-foreground">Xom Ma'lumotlar</CardTitle>
                <CardDescription className="text-muted-foreground">Kiritilgan barcha ma'lumotlar</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <pre className="bg-muted p-6 rounded-xl overflow-auto text-sm text-foreground font-mono border border-border">
                  {JSON.stringify(company.raw_data || company, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
