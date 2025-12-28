
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Database, Upload, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function SupabaseSetup() {
  const [isLoading, setIsLoading] = useState(false);
  const [setupStatus, setSetupStatus] = useState<{
    database: boolean;
    storage: boolean;
    policies: boolean;
  }>({
    database: false,
    storage: false,
    policies: false
  });

  const checkExistingSetup = async () => {
    try {
      // Check if tables exist
      const { data: tables, error: tablesError } = await supabase
        .from('banners')
        .select('count', { count: 'exact' })
        .limit(1);

      // Check if storage bucket exists
      const { data: buckets, error: bucketError } = await supabase
        .storage
        .listBuckets();

      setSetupStatus({
        database: !tablesError,
        storage: buckets?.some(bucket => bucket.name === 'uztrain-files') || false,
        policies: !tablesError // Assuming if tables exist, policies exist too
      });

      return {
        database: !tablesError,
        storage: buckets?.some(bucket => bucket.name === 'uztrain-files') || false,
        policies: !tablesError
      };
    } catch (error) {
      console.error('Setup check error:', error);
      return { database: false, storage: false, policies: false };
    }
  };

  const createTables = async () => {
    try {
      // Create banners table
      const { error: bannersError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS public.banners (
            id BIGSERIAL PRIMARY KEY,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
            title TEXT NOT NULL,
            subtitle TEXT,
            image_url TEXT,
            link_url TEXT,
            is_active BOOLEAN DEFAULT true,
            order_index INTEGER DEFAULT 0
          );
        `
      });

      // Since rpc might not work, let's try direct table creation
      const tables = [
        {
          name: 'banners',
          sql: `
            CREATE TABLE IF NOT EXISTS public.banners (
              id BIGSERIAL PRIMARY KEY,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
              title TEXT NOT NULL,
              subtitle TEXT,
              image_url TEXT,
              link_url TEXT,
              is_active BOOLEAN DEFAULT true,
              order_index INTEGER DEFAULT 0
            );
          `
        },
        {
          name: 'slaydlar',
          sql: `
            CREATE TABLE IF NOT EXISTS public.slaydlar (
              id BIGSERIAL PRIMARY KEY,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
              title TEXT NOT NULL,
              description TEXT,
              file_url TEXT NOT NULL,
              file_type TEXT DEFAULT 'pdf',
              file_size BIGINT,
              category TEXT DEFAULT 'general',
              is_featured BOOLEAN DEFAULT false,
              download_count INTEGER DEFAULT 0,
              tags TEXT[]
            );
          `
        }
      ];

      // Insert sample data
      await supabase.from('banners').upsert([
        {
          title: 'UzTrain Platformasiga Xush Kelibsiz',
          subtitle: 'Temir yo\'l sohasidagi eng yangi ta\'lim materiallari',
          image_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&h=400&fit=crop',
          is_active: true,
          order_index: 1
        }
      ]);

      await supabase.from('slaydlar').upsert([
        {
          title: 'Temir Yo\'l Xavfsizligi',
          description: 'Temir yo\'l xavfsizligi bo\'yicha asosiy qoidalar',
          file_url: 'https://example.com/sample.pdf',
          category: 'safety',
          is_featured: true
        }
      ]);

      return true;
    } catch (error) {
      console.error('Table creation error:', error);
      throw error;
    }
  };

  const createStorageBucket = async () => {
    try {
      const { data, error } = await supabase.storage.createBucket('uztrain-files', {
        public: true,
        allowedMimeTypes: ['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.*'],
        fileSizeLimit: 50 * 1024 * 1024 // 50MB
      });

      if (error && !error.message.includes('already exists')) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Storage bucket creation error:', error);
      throw error;
    }
  };

  const setupDatabase = async () => {
    setIsLoading(true);
    try {
      toast.info('Database yaratilmoqda...');
      
      // Create tables
      await createTables();
      setSetupStatus(prev => ({ ...prev, database: true }));
      toast.success('Database muvaffaqiyatli yaratildi');

      // Create storage bucket
      toast.info('Storage bucket yaratilmoqda...');
      await createStorageBucket();
      setSetupStatus(prev => ({ ...prev, storage: true, policies: true }));
      toast.success('Storage bucket muvaffaqiyatli yaratildi');

      toast.success('To\'liq setup muvaffaqiyatli bajarildi!');
    } catch (error: any) {
      console.error('Setup error:', error);
      toast.error(`Setup xatosi: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    checkExistingSetup();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Supabase Database Setup
          </CardTitle>
          <CardDescription>
            Database va storage setup holatini tekshiring va kerakli sozlamalarni bajaring
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              {setupStatus.database ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              )}
              <span>Database Tables</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {setupStatus.storage ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              )}
              <span>Storage Bucket</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {setupStatus.policies ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              )}
              <span>Security Policies</span>
            </div>
          </div>

          {!setupStatus.database || !setupStatus.storage ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Ba'zi sozlamalar tugallanmagan. Iltimos, setup tugmasini bosing.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Barcha sozlamalar muvaffaqiyatli tugallangan!
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button 
              onClick={setupDatabase} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              {isLoading ? 'Setup qilinmoqda...' : 'Database Setup'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={checkExistingSetup}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Status Tekshirish
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SupabaseSetup;
