// Supabase bucket yaratish uchun script
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://hbzmwbkcogzbgeykxnoc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhiem13Ymtjb2d6YmdleWt4bm9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMzkwNjEsImV4cCI6MjA2NzcxNTA2MX0.t1z6SR4J5PmI2lhWTf9lEJzTd3s6bLCXQSe6zxNKYT8";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createMaterialsBucket() {
  try {
    console.log('Creating materials bucket...');
    
    const { data, error } = await supabase.storage.createBucket('materials', {
      public: true,
      allowedMimeTypes: [
        'image/*',
        'video/*', 
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ],
      fileSizeLimit: 52428800 // 50MB
    });

    if (error) {
      if (error.message.includes('already exists')) {
        console.log('✅ Materials bucket already exists!');
      } else {
        console.error('❌ Error creating bucket:', error);
      }
    } else {
      console.log('✅ Materials bucket created successfully!', data);
    }
  } catch (error) {
    console.error('❌ Failed to create bucket:', error);
  }
}

createMaterialsBucket();
