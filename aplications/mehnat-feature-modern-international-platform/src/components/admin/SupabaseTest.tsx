import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, Loader2, Database, Wifi } from 'lucide-react';
import { toast } from 'sonner';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  details?: any;
}

export function SupabaseTest() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [creatingBucket, setCreatingBucket] = useState(false);

  const runTests = async () => {
    setTesting(true);
    setResults([]);

    const tests: TestResult[] = [
      { name: 'Supabase Connection', status: 'pending', message: 'Testing...' },
      { name: 'Database Access', status: 'pending', message: 'Testing...' },
      { name: 'Storage Access', status: 'pending', message: 'Testing...' },
      { name: 'Banner Table', status: 'pending', message: 'Testing...' },
    ];

    setResults([...tests]);

    try {
      // Test 1: Basic connection
      try {
        const { data, error } = await supabase.auth.getSession();
        tests[0] = {
          name: 'Supabase Connection',
          status: 'success',
          message: 'Connection successful',
          details: { session: !!data.session }
        };
      } catch (error: any) {
        tests[0] = {
          name: 'Supabase Connection',
          status: 'error',
          message: error.message || 'Connection failed',
          details: error
        };
      }
      setResults([...tests]);

      // Test 2: Database access
      try {
        const { data, error } = await supabase
          .from('banner')
          .select('count', { count: 'exact', head: true });
        
        if (error) throw error;
        
        tests[1] = {
          name: 'Database Access',
          status: 'success',
          message: 'Database accessible',
          details: { count: data }
        };
      } catch (error: any) {
        tests[1] = {
          name: 'Database Access',
          status: 'error',
          message: error.message || 'Database access failed',
          details: error
        };
      }
      setResults([...tests]);

      // Test 3: Storage access
      try {
        // First check if bucket exists
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

        if (bucketsError) throw bucketsError;

        const materialsBucket = buckets?.find(bucket => bucket.name === 'materials');

        if (!materialsBucket) {
          tests[2] = {
            name: 'Storage Access',
            status: 'error',
            message: 'Materials bucket not found',
            details: { availableBuckets: buckets?.map(b => b.name) || [] }
          };
        } else {
          // Try to list files in the bucket
          const { data, error } = await supabase.storage
            .from('materials')
            .list('', { limit: 1 });

          if (error) throw error;

          tests[2] = {
            name: 'Storage Access',
            status: 'success',
            message: 'Storage accessible',
            details: {
              bucket: materialsBucket.name,
              public: materialsBucket.public,
              files: data?.length || 0
            }
          };
        }
      } catch (error: any) {
        tests[2] = {
          name: 'Storage Access',
          status: 'error',
          message: error.message || 'Storage access failed',
          details: error
        };
      }
      setResults([...tests]);

      // Test 4: Banner table structure
      try {
        const { data, error } = await supabase
          .from('banner')
          .select('*')
          .limit(1);
        
        if (error) throw error;
        
        tests[3] = {
          name: 'Banner Table',
          status: 'success',
          message: 'Table structure valid',
          details: { sample: data?.[0] || 'No data' }
        };
      } catch (error: any) {
        tests[3] = {
          name: 'Banner Table',
          status: 'error',
          message: error.message || 'Table access failed',
          details: error
        };
      }
      setResults([...tests]);

    } catch (error: any) {
      console.error('Test error:', error);
      toast.error('Test jarayonida xatolik yuz berdi');
    } finally {
      setTesting(false);
    }
  };

  const createMaterialsBucket = async () => {
    try {
      setCreatingBucket(true);

      const { data, error } = await supabase.storage.createBucket('materials', {
        public: true,
        allowedMimeTypes: ['image/*', 'video/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        fileSizeLimit: 52428800 // 50MB
      });

      if (error) {
        console.error('Bucket creation error:', error);
        toast.error(`Bucket yaratishda xatolik: ${error.message}`);
      } else {
        console.log('Bucket created:', data);
        toast.success('Materials bucket muvaffaqiyatli yaratildi');
        // Re-run tests after bucket creation
        runTests();
      }
    } catch (error: any) {
      console.error('Bucket creation failed:', error);
      toast.error('Bucket yaratishda xatolik yuz berdi');
    } finally {
      setCreatingBucket(false);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'pending':
        return <Badge variant="secondary">Testing...</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5" />
          <span>Supabase Connection Test</span>
        </CardTitle>
        <CardDescription>
          Supabase bog'lanishi va ma'lumotlar bazasi holatini tekshirish
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button
            onClick={runTests}
            disabled={testing}
            className="w-full"
          >
            {testing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Wifi className="mr-2 h-4 w-4" />
                Run Connection Test
              </>
            )}
          </Button>

          <Button
            onClick={createMaterialsBucket}
            disabled={creatingBucket || testing}
            variant="outline"
            className="w-full"
          >
            {creatingBucket ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Bucket...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Create Materials Bucket
              </>
            )}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Test Results:</h4>
            {results.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <p className="font-medium text-sm">{result.name}</p>
                    <p className="text-xs text-muted-foreground">{result.message}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(result.status)}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>URL:</strong> {import.meta.env.VITE_SUPABASE_URL || 'Not set'}</p>
          <p><strong>Key:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}</p>
        </div>
      </CardContent>
    </Card>
  );
}
