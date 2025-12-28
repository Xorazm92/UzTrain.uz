import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  Database, 
  Wifi,
  WifiOff,
  RefreshCw
} from 'lucide-react';
import { shouldUseLocalDB, setUseLocalDB } from '@/lib/localDB';
import { toast } from 'sonner';

export function QuickFix() {
  const [fixing, setFixing] = useState(false);
  const isLocalDB = shouldUseLocalDB();

  const enableLocalDB = async () => {
    setFixing(true);
    try {
      setUseLocalDB(true);
      toast.success('Local Database yoqildi!');
      
      // Refresh page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error('Xatolik yuz berdi');
    } finally {
      setFixing(false);
    }
  };

  const disableLocalDB = async () => {
    setFixing(true);
    try {
      setUseLocalDB(false);
      toast.success('Supabase rejimi yoqildi!');
      
      // Refresh page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error('Xatolik yuz berdi');
    } finally {
      setFixing(false);
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-primary" />
          <span>Tezkor Yechim</span>
        </CardTitle>
        <CardDescription>
          CORS muammosini bir tugma bilan hal qiling
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center space-x-3">
            {isLocalDB ? (
              <>
                <WifiOff className="h-4 w-4 text-orange-600" />
                <span className="font-medium">Local Database</span>
              </>
            ) : (
              <>
                <Wifi className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Supabase Database</span>
              </>
            )}
          </div>
          <Badge variant={isLocalDB ? "secondary" : "default"}>
            {isLocalDB ? "Offline" : "Online"}
          </Badge>
        </div>

        {/* Quick Fix Buttons */}
        {!isLocalDB ? (
          <div className="space-y-3">
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-700">
                <strong>CORS xatoligi aniqlandi!</strong> Local Database rejimiga o'ting.
              </AlertDescription>
            </Alert>
            
            <Button 
              onClick={enableLocalDB}
              disabled={fixing}
              className="w-full bg-orange-600 hover:bg-orange-700"
              size="lg"
            >
              {fixing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Yoqilmoqda...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Local Database Yoqish (Tavsiya)
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                <strong>Local Database yoqilgan!</strong> Endi barcha funksiyalar ishlaydi.
              </AlertDescription>
            </Alert>
            
            <Button 
              onClick={disableLocalDB}
              disabled={fixing}
              variant="outline"
              className="w-full"
            >
              {fixing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  O'zgartirilmoqda...
                </>
              ) : (
                <>
                  <Wifi className="mr-2 h-4 w-4" />
                  Supabase ga Qaytish
                </>
              )}
            </Button>
          </div>
        )}

        {/* Info */}
        <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted/50 rounded-lg">
          <p><strong>Local Database:</strong></p>
          <ul className="list-disc list-inside space-y-0.5 ml-2">
            <li>✅ CORS muammolari yo'q</li>
            <li>✅ Tez ishlash</li>
            <li>✅ Offline rejim</li>
            <li>⚠️ Faqat shu brauzerda ko'rinadi</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
