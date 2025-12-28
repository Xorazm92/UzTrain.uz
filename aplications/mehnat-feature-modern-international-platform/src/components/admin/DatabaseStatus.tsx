import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Database, 
  Cloud, 
  HardDrive, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw,
  ArrowRightLeft
} from 'lucide-react';
import { smartDB } from '@/lib/smartDB';
import { shouldUseLocalDB } from '@/lib/localDB';
import { toast } from 'sonner';

export function DatabaseStatus() {
  const [currentDB, setCurrentDB] = useState<'supabase' | 'local'>(smartDB.getCurrentDatabase());
  const [switching, setSwitching] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    setCurrentDB(smartDB.getCurrentDatabase());
  }, []);

  const testSupabase = async () => {
    setTesting(true);
    try {
      const canSwitch = await smartDB.switchToSupabase();
      if (canSwitch) {
        setCurrentDB('supabase');
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      console.error('Supabase test failed:', error);
    } finally {
      setTesting(false);
    }
  };

  const switchToLocal = () => {
    setSwitching(true);
    smartDB.switchToLocal();
    setCurrentDB('local');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const getStatusInfo = () => {
    if (currentDB === 'supabase') {
      return {
        icon: <Cloud className="h-5 w-5 text-blue-600" />,
        title: 'Supabase Database',
        description: 'Cloud ma\'lumotlar bazasi ishlatilmoqda',
        badge: { text: 'Online', variant: 'default' as const },
        color: 'border-blue-200 bg-blue-50'
      };
    } else {
      return {
        icon: <HardDrive className="h-5 w-5 text-orange-600" />,
        title: 'Local Database',
        description: 'Brauzer xotirasida ma\'lumotlar saqlanmoqda',
        badge: { text: 'Offline', variant: 'secondary' as const },
        color: 'border-orange-200 bg-orange-50'
      };
    }
  };

  const status = getStatusInfo();

  return (
    <Card className={status.color}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {status.icon}
          <span>{status.title}</span>
        </CardTitle>
        <CardDescription>
          {status.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span className="text-sm font-medium">Joriy rejim:</span>
          </div>
          <Badge variant={status.badge.variant}>
            {status.badge.text}
          </Badge>
        </div>

        {currentDB === 'supabase' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              <strong>Supabase ishlayapti!</strong> Barcha ma'lumotlar cloud da saqlanadi.
            </AlertDescription>
          </Alert>
        )}

        {currentDB === 'local' && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-700">
              <strong>Local rejim:</strong> Ma'lumotlar faqat shu brauzerda saqlanadi.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          {currentDB === 'local' && (
            <Button 
              onClick={testSupabase}
              disabled={testing}
              variant="outline"
              className="w-full"
            >
              {testing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Supabase Tekshirilmoqda...
                </>
              ) : (
                <>
                  <Cloud className="mr-2 h-4 w-4" />
                  Supabase ga Qaytishga Urinish
                </>
              )}
            </Button>
          )}

          {currentDB === 'supabase' && (
            <Button 
              onClick={switchToLocal}
              disabled={switching}
              variant="outline"
              className="w-full"
            >
              {switching ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  O'zgartirilmoqda...
                </>
              ) : (
                <>
                  <HardDrive className="mr-2 h-4 w-4" />
                  Local Database ga O'tish
                </>
              )}
            </Button>
          )}
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex items-center space-x-1">
            <ArrowRightLeft className="h-3 w-3" />
            <span>Smart switching: Avtomatik fallback qo'llab-quvvatlanadi</span>
          </div>
          
          {currentDB === 'supabase' && (
            <div className="space-y-1">
              <p>• Ma'lumotlar cloud da saqlanadi</p>
              <p>• Har yerdan kirish mumkin</p>
              <p>• Avtomatik backup</p>
            </div>
          )}
          
          {currentDB === 'local' && (
            <div className="space-y-1">
              <p>• Tez ishlash</p>
              <p>• Offline rejim</p>
              <p>• CORS muammolari yo'q</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
