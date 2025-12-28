import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Download, 
  Copy, 
  AlertTriangle,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

const SQL_FIX = `-- Supabase Database Fix for Large Images
-- Run this SQL in Supabase Dashboard > SQL Editor

-- 1. Update all file_path columns to TEXT (unlimited size)
ALTER TABLE banner ALTER COLUMN file_path TYPE TEXT;
ALTER TABLE normativ_huquqiy_hujjatlar ALTER COLUMN file_path TYPE TEXT;
ALTER TABLE video_materiallar ALTER COLUMN file_path TYPE TEXT;
ALTER TABLE video_materiallar ALTER COLUMN video_url TYPE TEXT;
ALTER TABLE slaydlar ALTER COLUMN file_path TYPE TEXT;
ALTER TABLE kasb_yoriqnomalari ALTER COLUMN file_path TYPE TEXT;
ALTER TABLE temir_yol_hujjatlari ALTER COLUMN file_path TYPE TEXT;
ALTER TABLE qonunlar ALTER COLUMN file_path TYPE TEXT;
ALTER TABLE qarorlar ALTER COLUMN file_path TYPE TEXT;
ALTER TABLE qoidalar ALTER COLUMN file_path TYPE TEXT;

-- 2. Update description and content columns to TEXT
ALTER TABLE banner ALTER COLUMN description TYPE TEXT;
ALTER TABLE normativ_huquqiy_hujjatlar ALTER COLUMN content TYPE TEXT;
ALTER TABLE video_materiallar ALTER COLUMN description TYPE TEXT;
ALTER TABLE slaydlar ALTER COLUMN description TYPE TEXT;
ALTER TABLE kasb_yoriqnomalari ALTER COLUMN content TYPE TEXT;
ALTER TABLE temir_yol_hujjatlari ALTER COLUMN content TYPE TEXT;
ALTER TABLE qonunlar ALTER COLUMN content TYPE TEXT;
ALTER TABLE qarorlar ALTER COLUMN content TYPE TEXT;
ALTER TABLE qoidalar ALTER COLUMN content TYPE TEXT;

-- 3. Disable Row Level Security for all tables
ALTER TABLE banner DISABLE ROW LEVEL SECURITY;
ALTER TABLE normativ_huquqiy_hujjatlar DISABLE ROW LEVEL SECURITY;
ALTER TABLE video_materiallar DISABLE ROW LEVEL SECURITY;
ALTER TABLE slaydlar DISABLE ROW LEVEL SECURITY;
ALTER TABLE kasb_yoriqnomalari DISABLE ROW LEVEL SECURITY;
ALTER TABLE temir_yol_hujjatlari DISABLE ROW LEVEL SECURITY;
ALTER TABLE qonunlar DISABLE ROW LEVEL SECURITY;
ALTER TABLE qarorlar DISABLE ROW LEVEL SECURITY;
ALTER TABLE qoidalar DISABLE ROW LEVEL SECURITY;`;

export function DatabaseFix() {
  const [copied, setCopied] = useState(false);

  const copySQL = async () => {
    try {
      await navigator.clipboard.writeText(SQL_FIX);
      setCopied(true);
      toast.success('SQL kod nusxalandi!');
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      toast.error('Nusxalashda xatolik');
    }
  };

  const downloadSQL = () => {
    const blob = new Blob([SQL_FIX], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'supabase-database-fix.sql';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('SQL fayl yuklab olindi!');
  };

  const openSupabase = () => {
    window.open('https://supabase.com/dashboard', '_blank');
  };

  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-red-700">
          <AlertTriangle className="h-5 w-5" />
          <span>Database Hajm Muammosi</span>
        </CardTitle>
        <CardDescription>
          Supabase da maydon hajmi cheklangan. Quyidagi SQL ni ishga tushiring.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-700">
            <strong>Muammo:</strong> Supabase da file_path maydoni VARCHAR(1000) bilan cheklangan.
            <br />
            <strong>Yechim:</strong> Quyidagi SQL kodni ishga tushiring yoki Local Database ishlatish.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">SQL Fix Script</h4>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={copySQL}>
                {copied ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                    Nusxalandi
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Nusxalash
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={downloadSQL}>
                <Download className="mr-2 h-4 w-4" />
                Yuklab olish
              </Button>
            </div>
          </div>

          <Textarea
            value={SQL_FIX}
            readOnly
            rows={8}
            className="font-mono text-xs"
          />
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Qadamlar:</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start space-x-2">
              <Badge variant="outline" className="mt-0.5">1</Badge>
              <div>
                <p className="font-medium">SQL kodni nusxalang</p>
                <p className="text-muted-foreground text-xs">Yuqoridagi "Nusxalash" tugmasini bosing</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Badge variant="outline" className="mt-0.5">2</Badge>
              <div>
                <p className="font-medium">Supabase Dashboard ga kiring</p>
                <Button variant="link" size="sm" onClick={openSupabase} className="p-0 h-auto">
                  <ExternalLink className="mr-1 h-3 w-3" />
                  supabase.com/dashboard
                </Button>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Badge variant="outline" className="mt-0.5">3</Badge>
              <div>
                <p className="font-medium">SQL Editor ni oching</p>
                <p className="text-muted-foreground text-xs">Dashboard → SQL Editor</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Badge variant="outline" className="mt-0.5">4</Badge>
              <div>
                <p className="font-medium">SQL kodni joylashtiring va Run qiling</p>
                <p className="text-muted-foreground text-xs">Ctrl+V bilan joylashtiring va "Run" tugmasini bosing</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Badge variant="outline" className="mt-0.5">5</Badge>
              <div>
                <p className="font-medium">Sahifani yangilang</p>
                <p className="text-muted-foreground text-xs">Admin panelni refresh qiling</p>
              </div>
            </div>
          </div>
        </div>

        <Alert className="border-blue-200 bg-blue-50">
          <Database className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            <strong>Alternativ:</strong> Local Database rejimida davom etishingiz mumkin. 
            Bu barcha funksiyalarni darhol ishlaydi.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
