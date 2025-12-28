import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Database, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  AlertTriangle,
  Folder
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function BucketSetup() {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [bucketExists, setBucketExists] = useState<boolean | null>(null);
  const [buckets, setBuckets] = useState<any[]>([]);

  const checkBuckets = async () => {
    try {
      setChecking(true);
      const { data, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error('Error listing buckets:', error);
        toast.error(`Bucket tekshirishda xatolik: ${error.message}`);
        return;
      }

      setBuckets(data || []);
      const materialsBucket = data?.find(bucket => bucket.name === 'materials');
      setBucketExists(!!materialsBucket);
      
      if (materialsBucket) {
        toast.success('Materials bucket mavjud!');
      } else {
        toast.warning('Materials bucket topilmadi');
      }
    } catch (error: any) {
      console.error('Error checking buckets:', error);
      toast.error('Bucket tekshirishda xatolik');
    } finally {
      setChecking(false);
    }
  };

  const createMaterialsBucket = async () => {
    try {
      setLoading(true);

      // Try different approaches to create bucket
      let bucketCreated = false;
      let lastError = null;

      // Method 1: Standard bucket creation
      try {
        const { data, error } = await supabase.storage.createBucket('materials', {
          public: true,
          allowedMimeTypes: [
            'image/*',
            'video/*',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation'
          ],
          fileSizeLimit: 52428800 // 50MB
        });

        if (error) {
          if (error.message.includes('already exists')) {
            toast.success('Materials bucket allaqachon mavjud!');
            setBucketExists(true);
            bucketCreated = true;
          } else {
            lastError = error;
            console.error('Method 1 failed:', error);
          }
        } else {
          console.log('Bucket created with Method 1:', data);
          toast.success('Materials bucket muvaffaqiyatli yaratildi!');
          setBucketExists(true);
          bucketCreated = true;
        }
      } catch (error: any) {
        lastError = error;
        console.error('Method 1 error:', error);
      }

      // Method 2: Simple bucket creation (if Method 1 failed)
      if (!bucketCreated) {
        try {
          const { data, error } = await supabase.storage.createBucket('materials', {
            public: true
          });

          if (error) {
            if (error.message.includes('already exists')) {
              toast.success('Materials bucket allaqachon mavjud!');
              setBucketExists(true);
              bucketCreated = true;
            } else {
              lastError = error;
              console.error('Method 2 failed:', error);
            }
          } else {
            console.log('Bucket created with Method 2:', data);
            toast.success('Materials bucket muvaffaqiyatli yaratildi!');
            setBucketExists(true);
            bucketCreated = true;
          }
        } catch (error: any) {
          lastError = error;
          console.error('Method 2 error:', error);
        }
      }

      if (!bucketCreated && lastError) {
        console.error('All methods failed. Last error:', lastError);
        if (lastError.message.includes('row-level security')) {
          toast.error('RLS xatoligi: Supabase Dashboard\'da qo\'lda bucket yarating');
        } else {
          toast.error(`Bucket yaratishda xatolik: ${lastError.message}`);
        }
      }

      if (bucketCreated) {
        // Refresh bucket list
        checkBuckets();
      }
    } catch (error: any) {
      console.error('Error creating bucket:', error);
      toast.error('Bucket yaratishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const deleteBucket = async (bucketName: string) => {
    if (!confirm(`${bucketName} bucket'ini o'chirishni xohlaysizmi?`)) {
      return;
    }

    try {
      const { error } = await supabase.storage.deleteBucket(bucketName);
      
      if (error) {
        toast.error(`Bucket o'chirishda xatolik: ${error.message}`);
      } else {
        toast.success(`${bucketName} bucket o'chirildi`);
        checkBuckets();
      }
    } catch (error: any) {
      toast.error('Bucket o\'chirishda xatolik');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Storage Bucket Setup</h1>
        <p className="text-muted-foreground">
          Supabase storage bucket'larini boshqarish
        </p>
      </div>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Materials Bucket Status
          </CardTitle>
          <CardDescription>
            Fayllar saqlash uchun zarur bo'lgan bucket holati
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {bucketExists === null ? (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              ) : bucketExists ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="font-medium">Materials Bucket</span>
              <Badge variant={bucketExists ? "default" : "destructive"}>
                {bucketExists === null ? "Noma'lum" : bucketExists ? "Mavjud" : "Mavjud emas"}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={checkBuckets}
                disabled={checking}
              >
                {checking ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Database className="mr-2 h-4 w-4" />
                )}
                Tekshirish
              </Button>
              {!bucketExists && (
                <Button 
                  onClick={createMaterialsBucket}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Folder className="mr-2 h-4 w-4" />
                  )}
                  Bucket Yaratish
                </Button>
              )}
            </div>
          </div>

          {bucketExists === false && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Materials bucket mavjud emas. Fayllarni yuklash uchun bucket yaratish kerak.
                <br />
                <strong>RLS xatoligi bo'lsa:</strong> Supabase Dashboard'da qo'lda bucket yarating.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* All Buckets */}
      <Card>
        <CardHeader>
          <CardTitle>Barcha Bucket'lar</CardTitle>
          <CardDescription>
            Supabase loyihangizdagi barcha storage bucket'lar
          </CardDescription>
        </CardHeader>
        <CardContent>
          {buckets.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Hech qanday bucket topilmadi. Avval "Tekshirish" tugmasini bosing.
            </p>
          ) : (
            <div className="space-y-2">
              {buckets.map((bucket) => (
                <div key={bucket.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Folder className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="font-medium">{bucket.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {bucket.public ? "Public" : "Private"} • 
                        Created: {new Date(bucket.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={bucket.name === 'materials' ? "default" : "secondary"}>
                      {bucket.name === 'materials' ? "Asosiy" : "Boshqa"}
                    </Badge>
                    {bucket.name !== 'materials' && (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteBucket(bucket.name)}
                      >
                        O'chirish
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* RLS Help */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            RLS (Row Level Security) Muammosi
          </CardTitle>
          <CardDescription>
            Agar bucket yaratishda RLS xatoligi chiqsa, quyidagi yo'riqnomani bajaring
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">🔧 Supabase Dashboard orqali hal qilish:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li><strong>Supabase Dashboard'ga kiring:</strong> https://supabase.com/dashboard</li>
              <li><strong>Loyihangizni tanlang:</strong> hbzmwbkcogzbgeykxnoc</li>
              <li><strong>Storage</strong> bo'limiga o'ting (chap menuda)</li>
              <li><strong>"Create bucket"</strong> tugmasini bosing</li>
              <li><strong>Bucket ma'lumotlari:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Name: <code className="bg-gray-100 px-1 rounded">materials</code></li>
                  <li>Public bucket: ✅ (belgilang)</li>
                  <li>File size limit: 50 MB</li>
                </ul>
              </li>
              <li><strong>"Create bucket"</strong> tugmasini bosing</li>
            </ol>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">💡 SQL Editor orqali hal qilish:</h4>
            <p className="text-sm mb-2">Supabase Dashboard'da SQL Editor'ga o'ting va quyidagi kodni bajaring:</p>
            <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`-- Storage bucket'lar uchun RLS'ni o'chirish
ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;

-- Yoki public policy yaratish
CREATE POLICY "Enable all operations for all users" ON storage.buckets
FOR ALL USING (true) WITH CHECK (true);`}
            </pre>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Muhim:</strong> RLS xatoligi Supabase loyihasining xavfsizlik sozlamalari bilan bog'liq.
              Bucket yaratish uchun admin huquqlari kerak bo'lishi mumkin.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
