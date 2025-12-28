import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Database table schemas
const tableSchemas = {
  banner: {
    columns: [
      'id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY',
      'title TEXT NOT NULL',
      'description TEXT',
      'file_path TEXT', // Changed to TEXT for large base64 images
      'kategoriya TEXT NOT NULL',
      'xavfsizlik_darajasi TEXT NOT NULL',
      'created_at TIMESTAMPTZ DEFAULT NOW()',
      'updated_at TIMESTAMPTZ'
    ]
  },
  normativ_huquqiy_hujjatlar: {
    columns: [
      'id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY',
      'title TEXT NOT NULL',
      'content TEXT',
      'file_path TEXT',
      'kategoriya TEXT NOT NULL',
      'xavfsizlik_darajasi TEXT NOT NULL',
      'created_at TIMESTAMPTZ DEFAULT NOW()',
      'updated_at TIMESTAMPTZ'
    ]
  },
  video_materiallar: {
    columns: [
      'id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY',
      'title TEXT NOT NULL',
      'description TEXT',
      'video_url TEXT',
      'file_path TEXT',
      'xavfsizlik_darajasi TEXT NOT NULL',
      'created_at TIMESTAMPTZ DEFAULT NOW()',
      'updated_at TIMESTAMPTZ'
    ]
  },
  slaydlar: {
    columns: [
      'id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY',
      'title TEXT NOT NULL',
      'description TEXT',
      'file_path TEXT',
      'marzu_turi TEXT',
      'xavfsizlik_darajasi TEXT NOT NULL',
      'created_at TIMESTAMPTZ DEFAULT NOW()',
      'updated_at TIMESTAMPTZ'
    ]
  },
  kasb_yoriqnomalari: {
    columns: [
      'id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY',
      'kasb_nomi TEXT NOT NULL',
      'content TEXT',
      'file_path TEXT',
      'xavfsizlik_darajasi TEXT NOT NULL',
      'created_at TIMESTAMPTZ DEFAULT NOW()',
      'updated_at TIMESTAMPTZ'
    ]
  },
  temir_yol_hujjatlari: {
    columns: [
      'id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY',
      'title TEXT NOT NULL',
      'content TEXT',
      'file_path TEXT',
      'xavfsizlik_darajasi TEXT NOT NULL',
      'created_at TIMESTAMPTZ DEFAULT NOW()',
      'updated_at TIMESTAMPTZ'
    ]
  },
  qonunlar: {
    columns: [
      'id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY',
      'titleblob TEXT NOT NULL',
      'content TEXT',
      'file_path TEXT',
      'normativ_hujjat_id BIGINT',
      'xavfsizlik_darajasi TEXT NOT NULL',
      'created_at TIMESTAMPTZ DEFAULT NOW()',
      'updated_at TIMESTAMPTZ'
    ]
  },
  qarorlar: {
    columns: [
      'id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY',
      'titleblob TEXT NOT NULL',
      'content TEXT',
      'file_path TEXT',
      'normativ_hujjat_id BIGINT',
      'xavfsizlik_darajasi TEXT NOT NULL',
      'created_at TIMESTAMPTZ DEFAULT NOW()',
      'updated_at TIMESTAMPTZ'
    ]
  },
  qoidalar: {
    columns: [
      'id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY',
      'titleblob TEXT NOT NULL',
      'content TEXT',
      'file_path TEXT',
      'normativ_hujjat_id BIGINT',
      'xavfsizlik_darajasi TEXT NOT NULL',
      'created_at TIMESTAMPTZ DEFAULT NOW()',
      'updated_at TIMESTAMPTZ'
    ]
  }
};

export class SupabaseSetup {
  
  // Check if Supabase is accessible
  static async checkConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.getSession();
      return !error;
    } catch (error) {
      console.error('Supabase connection failed:', error);
      return false;
    }
  }

  // Check if tables exist
  static async checkTables(): Promise<{[key: string]: boolean}> {
    const results: {[key: string]: boolean} = {};
    
    for (const tableName of Object.keys(tableSchemas)) {
      try {
        const { error } = await supabase
          .from(tableName)
          .select('id')
          .limit(1);
        
        results[tableName] = !error;
      } catch (error) {
        results[tableName] = false;
      }
    }
    
    return results;
  }

  // Create missing tables (this requires admin access)
  static async createTables(): Promise<void> {
    const tableStatus = await this.checkTables();
    
    for (const [tableName, exists] of Object.entries(tableStatus)) {
      if (!exists) {
        console.log(`Table ${tableName} does not exist. Please create it manually in Supabase Dashboard.`);
        toast.error(`Jadval ${tableName} mavjud emas. Supabase Dashboard da yarating.`);
      }
    }
  }

  // Setup RLS policies
  static async setupPolicies(): Promise<void> {
    // This requires admin access, so we'll just log instructions
    console.log('Please run these SQL commands in Supabase SQL Editor:');
    
    Object.keys(tableSchemas).forEach(tableName => {
      console.log(`
-- Disable RLS for ${tableName}
ALTER TABLE ${tableName} DISABLE ROW LEVEL SECURITY;

-- Or create public policy
CREATE POLICY "Enable all operations for all users" ON ${tableName}
FOR ALL USING (true) WITH CHECK (true);
      `);
    });
    
    toast.info('RLS sozlamalari uchun console ni ko\'ring');
  }

  // Create storage bucket
  static async createStorageBucket(): Promise<boolean> {
    try {
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

      if (error && !error.message.includes('already exists')) {
        throw error;
      }

      return true;
    } catch (error: any) {
      console.error('Storage bucket creation failed:', error);
      return false;
    }
  }

  // Full setup process
  static async fullSetup(): Promise<{
    connection: boolean;
    tables: {[key: string]: boolean};
    storage: boolean;
  }> {
    const connection = await this.checkConnection();
    const tables = await this.checkTables();
    const storage = await this.createStorageBucket();

    if (!connection) {
      toast.error('Supabase ga ulanib bo\'lmadi');
    }

    const missingTables = Object.entries(tables).filter(([_, exists]) => !exists);
    if (missingTables.length > 0) {
      toast.warning(`${missingTables.length} ta jadval mavjud emas`);
    }

    if (!storage) {
      toast.warning('Storage bucket yaratilmadi');
    }

    if (connection && missingTables.length === 0 && storage) {
      toast.success('Supabase to\'liq sozlandi!');
    }

    return { connection, tables, storage };
  }

  // Generate SQL for manual setup
  static generateSetupSQL(): string {
    let sql = '-- Supabase Setup SQL\n\n';

    // Create tables
    Object.entries(tableSchemas).forEach(([tableName, schema]) => {
      sql += `-- Create ${tableName} table\n`;
      sql += `CREATE TABLE IF NOT EXISTS ${tableName} (\n  `;
      sql += schema.columns.join(',\n  ');
      sql += '\n);\n\n';

      // Disable RLS
      sql += `-- Disable RLS for ${tableName}\n`;
      sql += `ALTER TABLE ${tableName} DISABLE ROW LEVEL SECURITY;\n\n`;
    });

    // Add schema updates for existing tables
    sql += '-- Schema Updates for Existing Tables\n\n';
    sql += '-- Update file_path column to handle large base64 images\n';
    sql += 'ALTER TABLE banner ALTER COLUMN file_path TYPE TEXT;\n';
    sql += 'ALTER TABLE normativ_huquqiy_hujjatlar ALTER COLUMN file_path TYPE TEXT;\n';
    sql += 'ALTER TABLE video_materiallar ALTER COLUMN file_path TYPE TEXT;\n';
    sql += 'ALTER TABLE slaydlar ALTER COLUMN file_path TYPE TEXT;\n';
    sql += 'ALTER TABLE kasb_yoriqnomalari ALTER COLUMN file_path TYPE TEXT;\n';
    sql += 'ALTER TABLE temir_yol_hujjatlari ALTER COLUMN file_path TYPE TEXT;\n';
    sql += 'ALTER TABLE qonunlar ALTER COLUMN file_path TYPE TEXT;\n';
    sql += 'ALTER TABLE qarorlar ALTER COLUMN file_path TYPE TEXT;\n';
    sql += 'ALTER TABLE qoidalar ALTER COLUMN file_path TYPE TEXT;\n\n';

    return sql;
  }
}

// Export setup functions
export const {
  checkConnection,
  checkTables,
  createTables,
  setupPolicies,
  createStorageBucket,
  fullSetup,
  generateSetupSQL
} = SupabaseSetup;
