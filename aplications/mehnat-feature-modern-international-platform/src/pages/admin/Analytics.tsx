import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  Video, 
  Presentation,
  Download,
  Calendar,
  Activity,
  PieChart,
  Target
} from 'lucide-react';

interface AnalyticsData {
  totalItems: number;
  categoryCounts: {[key: string]: number};
  safetyLevelCounts: {[key: string]: number};
  recentActivity: any[];
  monthlyGrowth: {[key: string]: number};
}

const categoryLabels = {
  normativ_huquqiy_hujjatlar: 'Normativ Hujjatlar',
  video_materiallar: 'Video Materiallar',
  slaydlar: 'Slaydlar',
  kasb_yoriqnomalari: 'Kasb Yo\'riqnomalari',
  temir_yol_hujjatlari: 'Temir Yo\'l Hujjatlari',
  banner: 'Bannerlar',
  qonunlar: 'Qonunlar',
  qarorlar: 'Qarorlar',
  qoidalar: 'Qoidalar',
};

const safetyLevelLabels = {
  sanoat_xavfsizligi: 'Sanoat Xavfsizligi',
  mehnat_muhofazasi: 'Mehnat Muhofazasi',
  sogliqni_saqlash: 'Sog\'liqni Saqlash',
  yol_harakati: 'Yo\'l Harakati',
  yongin_xavfsizligi: 'Yong\'in Xavfsizligi',
  elektr_xavfsizligi: 'Elektr Xavfsizligi',
};

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData>({
    totalItems: 0,
    categoryCounts: {},
    safetyLevelCounts: {},
    recentActivity: [],
    monthlyGrowth: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      const categoryCounts: {[key: string]: number} = {};
      const safetyLevelCounts: {[key: string]: number} = {};
      let totalItems = 0;

      // Fetch data from all tables
      const tables = Object.keys(categoryLabels);
      
      for (const table of tables) {
        const { data: items, count } = await supabase
          .from(table)
          .select('xavfsizlik_darajasi, created_at', { count: 'exact' });

        categoryCounts[table] = count || 0;
        totalItems += count || 0;

        // Count safety levels
        if (items) {
          items.forEach(item => {
            const level = item.xavfsizlik_darajasi;
            safetyLevelCounts[level] = (safetyLevelCounts[level] || 0) + 1;
          });
        }
      }

      // Fetch recent activity (last 10 items across all tables)
      const recentActivity: any[] = [];
      for (const table of tables.slice(0, 3)) { // Limit to first 3 tables for performance
        const { data: items } = await supabase
          .from(table)
          .select('id, title, titleblob, kasb_nomi, created_at')
          .order('created_at', { ascending: false })
          .limit(3);

        if (items) {
          items.forEach(item => {
            recentActivity.push({
              ...item,
              table,
              title: item.title || item.titleblob || item.kasb_nomi || 'Noma\'lum',
            });
          });
        }
      }

      // Sort recent activity by date
      recentActivity.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setData({
        totalItems,
        categoryCounts,
        safetyLevelCounts,
        recentActivity: recentActivity.slice(0, 10),
        monthlyGrowth: {}, // This would require more complex date calculations
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    const csvContent = Object.entries(data.categoryCounts)
      .map(([category, count]) => `${categoryLabels[category as keyof typeof categoryLabels]},${count}`)
      .join('\n');
    
    const blob = new Blob([`Kategoriya,Soni\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'statistika.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Statistika</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Statistika</h1>
          <p className="text-muted-foreground">
            Platform bo'yicha batafsil hisobotlar va tahlillar
          </p>
        </div>
        <Button onClick={exportData} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          CSV Export
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami Ma'lumotlar</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalItems}</div>
            <p className="text-xs text-muted-foreground">
              Barcha kategoriyalar bo'yicha
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kategoriyalar</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(data.categoryCounts).length}</div>
            <p className="text-xs text-muted-foreground">
              Turli xil ma'lumot turlari
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eng Ko'p</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.max(...Object.values(data.categoryCounts))}
            </div>
            <p className="text-xs text-muted-foreground">
              Bitta kategoriyada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Xavfsizlik Darajalari</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(data.safetyLevelCounts).length}</div>
            <p className="text-xs text-muted-foreground">
              Turli xil xavfsizlik darajalari
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categories">Kategoriyalar</TabsTrigger>
          <TabsTrigger value="safety">Xavfsizlik Darajalari</TabsTrigger>
          <TabsTrigger value="activity">So'nggi Faoliyat</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Kategoriyalar bo'yicha Taqsimot</CardTitle>
              <CardDescription>
                Har bir kategoriyada mavjud ma'lumotlar soni
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(data.categoryCounts).map(([category, count]) => {
                const percentage = data.totalItems > 0 ? (count / data.totalItems) * 100 : 0;
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {categoryLabels[category as keyof typeof categoryLabels]}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{count}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="safety" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Xavfsizlik Darajalari bo'yicha Taqsimot</CardTitle>
              <CardDescription>
                Har bir xavfsizlik darajasida mavjud ma'lumotlar soni
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(data.safetyLevelCounts).map(([level, count]) => {
                const percentage = data.totalItems > 0 ? (count / data.totalItems) * 100 : 0;
                return (
                  <div key={level} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {safetyLevelLabels[level as keyof typeof safetyLevelLabels]}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{count}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>So'nggi Faoliyat</CardTitle>
              <CardDescription>
                Oxirgi qo'shilgan ma'lumotlar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentActivity.map((item, index) => (
                  <div key={`${item.table}-${item.id}`} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                          {index + 1}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {categoryLabels[item.table as keyof typeof categoryLabels]}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <Badge variant="secondary" className="text-xs">
                        {new Date(item.created_at).toLocaleDateString('uz-UZ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
