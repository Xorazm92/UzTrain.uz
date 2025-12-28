
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  FileText, 
  Video, 
  TrendingUp, 
  Activity,
  Target,
  Zap,
  ChartColumn,
  RefreshCw
} from 'lucide-react';
import { supabase, testConnection, initializeDatabase } from '@/integrations/supabase/client';
import { useRealStats } from '@/hooks/useRealStats';

const Dashboard = () => {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const [connectionMessage, setConnectionMessage] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { stats, loading, error, refreshStats } = useRealStats();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setConnectionStatus('checking');
    const result = await testConnection();
    setConnectionStatus(result.success ? 'success' : 'error');
    setConnectionMessage(result.message);
    
    if (result.success) {
      refreshStats();
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshStats();
    setIsRefreshing(false);
  };

  const statsCards = [
    {
      title: "Jami Foydalanuvchilar",
      value: stats?.totalUsers || 0,
      change: "+12%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Video Materiallar",
      value: stats?.videoMaterials || 0,
      change: "+5%",
      icon: Video,
      color: "text-green-600"
    },
    {
      title: "Hujjatlar",
      value: stats?.documents || 0,
      change: "+8%",
      icon: FileText,
      color: "text-purple-600"
    },
    {
      title: "Faollik",
      value: `${stats?.activity || 0}%`,
      change: "+15%",
      icon: Activity,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            UzTrain Platform boshqaruv paneli
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Yangilash
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      <Alert className={connectionStatus === 'success' ? 'border-green-500' : connectionStatus === 'error' ? 'border-red-500' : 'border-yellow-500'}>
        <div className={`h-4 w-4 rounded-full ${
          connectionStatus === 'success' ? 'bg-green-500' : 
          connectionStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'
        }`} />
        <AlertDescription>
          Database holati: {connectionMessage}
        </AlertDescription>
      </Alert>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
                ) : (
                  card.value
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                <Badge variant="secondary" className="text-xs">
                  {card.change}
                </Badge>
                {" "}o'tgan oydan
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Umumiy</TabsTrigger>
          <TabsTrigger value="content">Kontent</TabsTrigger>
          <TabsTrigger value="users">Foydalanuvchilar</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Haftalik O'sish
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  +23.5%
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Foydalanuvchilar faolligi oshmoqda
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Oylik Maqsad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  87%
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Maqsadga 13% qoldi
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Kontent Statistikasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Video Materiallar</span>
                  <Badge>{stats?.videoMaterials || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Hujjatlar</span>
                  <Badge>{stats?.documents || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Slaydlar</span>
                  <Badge>{stats?.slides || 0}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Foydalanuvchi Aktivligi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Foydalanuvchi ma'lumotlari yuklanmoqda...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                Sayt Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Sahifa yuklash tezligi</span>
                  <Badge variant="outline" className="text-green-600">
                    Excellent
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Core Web Vitals</span>
                  <Badge variant="outline" className="text-green-600">
                    Good
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>SEO Score</span>
                  <Badge variant="outline" className="text-blue-600">
                    95/100
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
