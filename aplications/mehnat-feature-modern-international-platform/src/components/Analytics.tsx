import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  Video, 
  FileText, 
  Eye,
  Download,
  Clock,
  Award
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  totalMaterials: number;
  totalViews: number;
  totalDownloads: number;
  averageRating: number;
  categoryStats: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  safetyLevelStats: Array<{
    name: string;
    count: number;
    color: string;
  }>;
  monthlyActivity: Array<{
    month: string;
    views: number;
    downloads: number;
    uploads: number;
  }>;
  topMaterials: Array<{
    id: number;
    title: string;
    views: number;
    type: string;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export function Analytics() {
  const { t } = useTranslation();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch category counts
      const { data: categories } = await supabase
        .from('normativ_huquqiy_hujjatlar')
        .select('id');
      
      const { data: videos } = await supabase
        .from('video_materiallar')
        .select('id');
        
      const { data: slides } = await supabase
        .from('slaydlar')
        .select('id');

      // Mock data for demonstration
      const analyticsData: AnalyticsData = {
        totalMaterials: (categories?.length || 0) + (videos?.length || 0) + (slides?.length || 0),
        totalViews: Math.floor(Math.random() * 10000) + 5000,
        totalDownloads: Math.floor(Math.random() * 5000) + 2000,
        averageRating: 4.2,
        categoryStats: [
          { name: 'Laws', count: categories?.length || 0, percentage: 35 },
          { name: 'Videos', count: videos?.length || 0, percentage: 30 },
          { name: 'Slides', count: slides?.length || 0, percentage: 20 },
          { name: 'Manuals', count: 15, percentage: 10 },
          { name: 'Banners', count: 8, percentage: 5 },
        ],
        safetyLevelStats: [
          { name: 'Industrial Safety', count: 45, color: '#0088FE' },
          { name: 'Labor Protection', count: 38, color: '#00C49F' },
          { name: 'Health Protection', count: 25, color: '#FFBB28' },
          { name: 'Traffic Safety', count: 20, color: '#FF8042' },
          { name: 'Fire Safety', count: 18, color: '#8884D8' },
          { name: 'Electrical Safety', count: 12, color: '#82CA9D' },
        ],
        monthlyActivity: [
          { month: 'Jan', views: 1200, downloads: 400, uploads: 12 },
          { month: 'Feb', views: 1800, downloads: 600, uploads: 18 },
          { month: 'Mar', views: 2200, downloads: 800, uploads: 25 },
          { month: 'Apr', views: 1900, downloads: 650, uploads: 20 },
          { month: 'May', views: 2500, downloads: 900, uploads: 30 },
          { month: 'Jun', views: 2800, downloads: 1100, uploads: 35 },
        ],
        topMaterials: [
          { id: 1, title: 'Safety Regulations 2024', views: 1250, type: 'document' },
          { id: 2, title: 'Fire Safety Training', views: 980, type: 'video' },
          { id: 3, title: 'Industrial Safety Guidelines', views: 850, type: 'slide' },
          { id: 4, title: 'Emergency Procedures', views: 720, type: 'document' },
          { id: 5, title: 'PPE Usage Guide', views: 650, type: 'video' },
        ],
      };

      setData(analyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Materials</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalMaterials}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalDownloads.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.averageRating}/5</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +0.2 from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Material Categories</CardTitle>
            <CardDescription>Distribution of materials by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.categoryStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Activity</CardTitle>
            <CardDescription>Views, downloads, and uploads over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.monthlyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="views" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="downloads" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Materials */}
      <Card>
        <CardHeader>
          <CardTitle>Top Materials</CardTitle>
          <CardDescription>Most viewed materials this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.topMaterials.map((material, index) => (
              <div key={material.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="w-8 h-8 rounded-full flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  <div>
                    <p className="font-medium">{material.title}</p>
                    <p className="text-sm text-muted-foreground capitalize">{material.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{material.views.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">views</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
