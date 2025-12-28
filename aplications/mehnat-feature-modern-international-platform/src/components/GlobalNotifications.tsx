import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wifi, 
  WifiOff, 
  Database, 
  HardDrive, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  X
} from 'lucide-react';
import { smartDB } from '@/lib/smartDB';
import { shouldUseLocalDB, setUseLocalDB } from '@/lib/localDB';

export function GlobalNotifications() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [dbStatus, setDbStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [showDbStatus, setShowDbStatus] = useState(false);

  useEffect(() => {
    // Network status monitoring
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Internet aloqasi qayta tiklandi', {
        icon: <Wifi className="h-4 w-4" />
      });
      checkDatabaseStatus();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('Internet aloqasi uzildi. Local rejimda ishlaydi.', {
        icon: <WifiOff className="h-4 w-4" />,
        duration: 5000
      });
      setDbStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial database status check
    checkDatabaseStatus();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkDatabaseStatus = async () => {
    if (!isOnline) {
      setDbStatus('offline');
      return;
    }

    try {
      const isConnected = await smartDB.testConnection();
      setDbStatus(isConnected ? 'online' : 'offline');
      
      if (!isConnected && !shouldUseLocalDB()) {
        setShowDbStatus(true);
      }
    } catch (error) {
      setDbStatus('offline');
    }
  };

  const handleSwitchToLocal = () => {
    setUseLocalDB(true);
    setShowDbStatus(false);
    toast.success('Local database yoqildi', {
      icon: <HardDrive className="h-4 w-4" />
    });
    window.location.reload();
  };

  const handleRetryConnection = () => {
    setDbStatus('checking');
    checkDatabaseStatus();
  };

  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        icon: <WifiOff className="h-4 w-4 text-orange-500" />,
        text: 'Offline',
        description: 'Internet aloqasi yo\'q',
        variant: 'secondary' as const
      };
    }

    if (shouldUseLocalDB()) {
      return {
        icon: <HardDrive className="h-4 w-4 text-blue-500" />,
        text: 'Local DB',
        description: 'Local ma\'lumotlar bazasi',
        variant: 'outline' as const
      };
    }

    switch (dbStatus) {
      case 'checking':
        return {
          icon: <Database className="h-4 w-4 text-yellow-500 animate-pulse" />,
          text: 'Tekshirilmoqda...',
          description: 'Database holati tekshirilmoqda',
          variant: 'secondary' as const
        };
      case 'online':
        return {
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
          text: 'Online',
          description: 'Supabase database',
          variant: 'default' as const
        };
      case 'offline':
        return {
          icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
          text: 'Database xatolik',
          description: 'Supabase ulanmadi',
          variant: 'destructive' as const
        };
      default:
        return {
          icon: <Info className="h-4 w-4" />,
          text: 'Noma\'lum',
          description: 'Status noma\'lum',
          variant: 'secondary' as const
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <>
      {/* Status indicator in bottom right */}
      <div className="fixed bottom-4 right-4 z-50">
        <Badge 
          variant={statusInfo.variant}
          className="cursor-pointer transition-all hover:scale-105"
          onClick={() => setShowDbStatus(!showDbStatus)}
        >
          {statusInfo.icon}
          <span className="ml-1">{statusInfo.text}</span>
        </Badge>
      </div>

      {/* Database status card */}
      {showDbStatus && (
        <div className="fixed bottom-16 right-4 z-50 w-80">
          <Card className="shadow-lg border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  {statusInfo.icon}
                  Database Status
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDbStatus(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <CardDescription className="text-xs">
                {statusInfo.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {dbStatus === 'offline' && isOnline && !shouldUseLocalDB() && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Supabase database bilan bog'lanib bo'lmadi. Quyidagi variantlardan birini tanlang:
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRetryConnection}
                      disabled={dbStatus === 'checking'}
                    >
                      <Database className="h-3 w-3 mr-1" />
                      Qayta urinish
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleSwitchToLocal}
                    >
                      <HardDrive className="h-3 w-3 mr-1" />
                      Local DB
                    </Button>
                  </div>
                </div>
              )}

              {shouldUseLocalDB() && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Local database ishlatilmoqda. Ma'lumotlar brauzer xotirasida saqlanadi.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setUseLocalDB(false);
                      window.location.reload();
                    }}
                  >
                    <Database className="h-3 w-3 mr-1" />
                    Supabase'ga qaytish
                  </Button>
                </div>
              )}

              {dbStatus === 'online' && (
                <div className="space-y-2">
                  <p className="text-sm text-green-600">
                    ✅ Supabase database muvaffaqiyatli ulandi
                  </p>
                </div>
              )}

              {!isOnline && (
                <div className="space-y-2">
                  <p className="text-sm text-orange-600">
                    ⚠️ Internet aloqasi yo'q. Local rejimda ishlaydi.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

// Hook for components to show loading states
export function useGlobalLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const showLoading = (message: string = 'Yuklanmoqda...') => {
    setLoadingMessage(message);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
    setLoadingMessage('');
  };

  return {
    isLoading,
    loadingMessage,
    showLoading,
    hideLoading
  };
}
