import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Database, HardDrive, Wifi, WifiOff } from 'lucide-react';
import { shouldUseLocalDB, setUseLocalDB, localDB } from '@/lib/localDB';
import { toast } from 'sonner';

export function LocalDBToggle() {
  const [useLocal, setUseLocal] = useState(shouldUseLocalDB());
  const [stats, setStats] = useState<{[key: string]: number}>({});

  useEffect(() => {
    updateStats();
  }, [useLocal]);

  const updateStats = () => {
    const tables = [
      'banner',
      'normativ_huquqiy_hujjatlar',
      'video_materiallar',
      'slaydlar',
      'kasb_yoriqnomalari',
      'temir_yol_hujjatlari',
      'qonunlar',
      'qarorlar',
      'qoidalar'
    ];

    const newStats: {[key: string]: number} = {};
    tables.forEach(table => {
      newStats[table] = localDB.count(table);
    });
    setStats(newStats);
  };

  const handleToggle = (checked: boolean) => {
    setUseLocal(checked);
    setUseLocalDB(checked);
    
    if (checked) {
      toast.success('Local ma\'lumotlar bazasi yoqildi');
    } else {
      toast.success('Supabase ma\'lumotlar bazasi yoqildi');
    }
    
    // Refresh the page to apply changes
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const clearLocalData = () => {
    if (confirm('Barcha local ma\'lumotlarni o\'chirishni tasdiqlaysizmi?')) {
      localDB.clearAll();
      updateStats();
      toast.success('Local ma\'lumotlar tozalandi');
    }
  };

  const totalItems = Object.values(stats).reduce((sum, count) => sum + count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {useLocal ? (
            <HardDrive className="h-5 w-5 text-orange-600" />
          ) : (
            <Database className="h-5 w-5 text-blue-600" />
          )}
          <span>Ma'lumotlar Bazasi</span>
        </CardTitle>
        <CardDescription>
          Ma'lumotlar bazasi rejimini tanlang
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="db-toggle">Local Ma'lumotlar Bazasi</Label>
            <p className="text-sm text-muted-foreground">
              {useLocal 
                ? 'Local storage ishlatilmoqda (offline rejim)'
                : 'Supabase ishlatilmoqda (online rejim)'
              }
            </p>
          </div>
          <Switch
            id="db-toggle"
            checked={useLocal}
            onCheckedChange={handleToggle}
          />
        </div>

        <div className="flex items-center space-x-2">
          {useLocal ? (
            <>
              <WifiOff className="h-4 w-4 text-orange-600" />
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Local Mode
              </Badge>
            </>
          ) : (
            <>
              <Wifi className="h-4 w-4 text-blue-600" />
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Online Mode
              </Badge>
            </>
          )}
        </div>

        {useLocal && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Local Ma'lumotlar:</span>
              <Badge variant="outline">{totalItems} ta element</Badge>
            </div>
            
            {totalItems > 0 && (
              <div className="space-y-1">
                {Object.entries(stats).map(([table, count]) => (
                  count > 0 && (
                    <div key={table} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{table}:</span>
                      <span>{count}</span>
                    </div>
                  )
                ))}
              </div>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearLocalData}
              disabled={totalItems === 0}
              className="w-full"
            >
              Local Ma'lumotlarni Tozalash
            </Button>
          </div>
        )}

        {!useLocal && (
          <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <p className="text-yellow-800 font-medium">Supabase CORS Xatoligi</p>
              <p className="text-yellow-700 text-xs mt-1">
                Agar Supabase bilan bog'lanishda muammo bo'lsa, Local rejimga o'ting
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
