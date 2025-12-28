import { supabase } from '@/integrations/supabase/client';
import { localDB, shouldUseLocalDB, setUseLocalDB } from '@/lib/localDB';
import { toast } from 'sonner';

interface SmartDBResult<T = any> {
  data: T[] | null;
  error: any;
  count?: number;
}

interface SmartDBSingleResult<T = any> {
  data: T | null;
  error: any;
}

class SmartDatabase {
  private async trySupabase<T>(operation: () => Promise<any>): Promise<{ success: boolean; result?: any; error?: any }> {
    try {
      const result = await operation();
      
      // Check for specific database errors
      if (result.error) {
        const errorMsg = result.error.message || '';
        
        // Database size/type errors
        if (errorMsg.includes('value too long') || 
            errorMsg.includes('character varying') ||
            errorMsg.includes('22001')) {
          console.warn('Supabase column size limit detected');
          return { success: false, error: result.error };
        }
        
        // Network/CORS errors
        if (errorMsg.includes('NetworkError') || 
            errorMsg.includes('CORS') ||
            errorMsg.includes('fetch')) {
          console.warn('Supabase network error detected');
          return { success: false, error: result.error };
        }
        
        // Other errors
        return { success: false, error: result.error };
      }
      
      return { success: true, result };
    } catch (error: any) {
      console.warn('Supabase operation failed:', error);
      return { success: false, error };
    }
  }

  private async fallbackToLocal<T>(
    table: string, 
    operation: 'select' | 'insert' | 'update' | 'delete',
    data?: any,
    filters?: any
  ): Promise<any> {
    console.log(`Falling back to Local DB for ${operation} on ${table}`);
    
    switch (operation) {
      case 'select':
        const items = localDB.select(table);
        return {
          data: items,
          error: null,
          count: items.length
        };
        
      case 'insert':
        const insertedItems = data.map((item: any) => localDB.insert(table, item));
        return {
          data: insertedItems,
          error: null
        };
        
      case 'update':
        const updatedItem = localDB.update(table, filters.id, data);
        return {
          data: updatedItem ? [updatedItem] : null,
          error: updatedItem ? null : { message: 'Item not found' }
        };
        
      case 'delete':
        const success = localDB.delete(table, filters.id);
        return {
          data: success ? [{ id: filters.id }] : null,
          error: success ? null : { message: 'Item not found' }
        };
        
      default:
        return { data: null, error: { message: 'Unsupported operation' } };
    }
  }

  async select(table: string, columns = '*'): Promise<SmartDBResult> {
    // If user explicitly chose local DB, use it
    if (shouldUseLocalDB()) {
      return this.fallbackToLocal(table, 'select');
    }

    // Try Supabase first
    const supabaseResult = await this.trySupabase(async () => {
      return await supabase.from(table).select(columns);
    });

    if (supabaseResult.success) {
      return supabaseResult.result;
    }

    // Auto-fallback to local DB
    console.log('Auto-falling back to Local DB due to Supabase error');
    toast.warning('Supabase xatoligi, Local Database ishlatilmoqda');
    
    return this.fallbackToLocal(table, 'select');
  }

  async insert(table: string, data: any[]): Promise<SmartDBResult> {
    // If user explicitly chose local DB, use it
    if (shouldUseLocalDB()) {
      return this.fallbackToLocal(table, 'insert', data);
    }

    // Try Supabase first
    const supabaseResult = await this.trySupabase(async () => {
      return await supabase.from(table).insert(data).select();
    });

    if (supabaseResult.success) {
      return supabaseResult.result;
    }

    // Check if it's a size limit error
    const errorMsg = supabaseResult.error?.message || '';
    if (errorMsg.includes('value too long') || errorMsg.includes('character varying')) {
      toast.error('Supabase da maydon hajmi cheklangan. Local Database ishlatilmoqda.');
      
      // Auto-suggest database fix
      setTimeout(() => {
        toast.info('Dashboard da "Database Fix" ni ko\'ring', { duration: 5000 });
      }, 2000);
    }

    // Auto-fallback to local DB
    return this.fallbackToLocal(table, 'insert', data);
  }

  async update(table: string, data: any, id: number): Promise<SmartDBResult> {
    // If user explicitly chose local DB, use it
    if (shouldUseLocalDB()) {
      return this.fallbackToLocal(table, 'update', data, { id });
    }

    // Try Supabase first
    const supabaseResult = await this.trySupabase(async () => {
      return await supabase.from(table).update(data).eq('id', id).select();
    });

    if (supabaseResult.success) {
      return supabaseResult.result;
    }

    // Check if it's a size limit error
    const errorMsg = supabaseResult.error?.message || '';
    if (errorMsg.includes('value too long') || errorMsg.includes('character varying')) {
      toast.error('Supabase da maydon hajmi cheklangan. Local Database ishlatilmoqda.');
    }

    // Auto-fallback to local DB
    return this.fallbackToLocal(table, 'update', data, { id });
  }

  async delete(table: string, id: number): Promise<SmartDBResult> {
    // If user explicitly chose local DB, use it
    if (shouldUseLocalDB()) {
      return this.fallbackToLocal(table, 'delete', null, { id });
    }

    // Try Supabase first
    const supabaseResult = await this.trySupabase(async () => {
      return await supabase.from(table).delete().eq('id', id);
    });

    if (supabaseResult.success) {
      return supabaseResult.result;
    }

    // Auto-fallback to local DB
    return this.fallbackToLocal(table, 'delete', null, { id });
  }

  // Method to check which database is being used
  getCurrentDatabase(): 'supabase' | 'local' {
    return shouldUseLocalDB() ? 'local' : 'supabase';
  }

  // Method to force switch to local DB
  switchToLocal(): void {
    setUseLocalDB(true);
    toast.success('Local Database rejimiga o\'tildi');
  }

  // Method to try switching back to Supabase
  async switchToSupabase(): Promise<boolean> {
    const testResult = await this.trySupabase(async () => {
      return await supabase.from('banner').select('id').limit(1);
    });

    if (testResult.success) {
      setUseLocalDB(false);
      toast.success('Supabase rejimiga o\'tildi');
      return true;
    } else {
      toast.error('Supabase hali ham ishlamayapti');
      return false;
    }
  }
}

export const smartDB = new SmartDatabase();
