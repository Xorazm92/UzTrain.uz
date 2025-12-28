import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { shouldUseLocalDB, setUseLocalDB } from '@/lib/localDB';
import { supabase } from '@/integrations/supabase/client';

export function CorsAlert() {
  const [showAlert, setShowAlert] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    checkSupabaseConnection();
  }, []);

  const checkSupabaseConnection = async () => {
    if (shouldUseLocalDB()) {
      setShowAlert(false);
      return;
    }

    try {
      setChecking(true);
      const { error } = await supabase.from('banner').select('id').limit(1);
      
      if (error && (
        error.message.includes('NetworkError') || 
        error.message.includes('CORS') ||
        error.message.includes('fetch')
      )) {
        setIsOnline(false);
        setShowAlert(true);
      } else {
        setIsOnline(true);
        setShowAlert(false);
      }
    } catch (error: any) {
      console.error('Supabase connection check failed:', error);
      setIsOnline(false);
      setShowAlert(true);
    } finally {
      setChecking(false);
    }
  };

  const enableLocalDB = () => {
    setUseLocalDB(true);
    setShowAlert(false);
    window.location.reload();
  };

  const retryConnection = () => {
    checkSupabaseConnection();
  };

  if (!showAlert) return null;

  return (
    <Alert className="border-orange-200 bg-orange-50">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertTitle className="text-orange-800">
        Supabase Ulanish Muammosi
      </AlertTitle>
      <AlertDescription className="text-orange-700">
        <div className="space-y-3">
          <p>
            Supabase ma'lumotlar bazasiga ulanishda CORS xatoligi yuz berdi. 
            Bu development rejimida tez-tez uchraydi.
          </p>
          
          <div className="flex items-center space-x-2">
            <WifiOff className="h-4 w-4" />
            <span className="text-sm font-medium">
              Hozirgi holat: Offline rejim tavsiya etiladi
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={enableLocalDB}
              size="sm"
              className="bg-orange-600 hover:bg-orange-700"
            >
              <WifiOff className="mr-2 h-4 w-4" />
              Local Database Yoqish
            </Button>
            
            <Button 
              onClick={retryConnection}
              variant="outline"
              size="sm"
              disabled={checking}
            >
              {checking ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wifi className="mr-2 h-4 w-4" />
              )}
              Qayta Urinish
            </Button>
          </div>

          <div className="text-xs space-y-1">
            <p><strong>Local Database:</strong> Ma'lumotlar brauzer xotirasida saqlanadi</p>
            <p><strong>Afzalliklari:</strong> Tez ishlash, CORS muammolari yo'q, offline rejim</p>
            <p><strong>Kamchiliklari:</strong> Faqat local ma'lumotlar, boshqa qurilmalarda ko'rinmaydi</p>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}
