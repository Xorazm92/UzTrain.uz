// Local Database for development when Supabase is not accessible
interface LocalDBItem {
  id: number;
  created_at: string;
  updated_at: string | null;
  [key: string]: any;
}

class LocalDB {
  private getStorageKey(table: string): string {
    return `localdb_${table}`;
  }

  private getNextId(table: string): number {
    const items = this.select(table);
    return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
  }

  select(table: string): LocalDBItem[] {
    try {
      const data = localStorage.getItem(this.getStorageKey(table));
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  insert(table: string, data: Omit<LocalDBItem, 'id' | 'created_at'>): LocalDBItem {
    try {
      const items = this.select(table);
      const newItem: LocalDBItem = {
        ...data,
        id: this.getNextId(table),
        created_at: new Date().toISOString(),
        updated_at: null,
      };
      
      items.push(newItem);
      localStorage.setItem(this.getStorageKey(table), JSON.stringify(items));
      return newItem;
    } catch (error) {
      console.error('Error inserting to localStorage:', error);
      throw error;
    }
  }

  update(table: string, id: number, data: Partial<LocalDBItem>): LocalDBItem | null {
    try {
      const items = this.select(table);
      const index = items.findIndex(item => item.id === id);
      
      if (index === -1) {
        throw new Error('Item not found');
      }
      
      items[index] = {
        ...items[index],
        ...data,
        updated_at: new Date().toISOString(),
      };
      
      localStorage.setItem(this.getStorageKey(table), JSON.stringify(items));
      return items[index];
    } catch (error) {
      console.error('Error updating localStorage:', error);
      throw error;
    }
  }

  delete(table: string, id: number): boolean {
    try {
      const items = this.select(table);
      const filteredItems = items.filter(item => item.id !== id);
      
      if (filteredItems.length === items.length) {
        return false; // Item not found
      }
      
      localStorage.setItem(this.getStorageKey(table), JSON.stringify(filteredItems));
      return true;
    } catch (error) {
      console.error('Error deleting from localStorage:', error);
      throw error;
    }
  }

  count(table: string): number {
    return this.select(table).length;
  }

  clear(table: string): void {
    localStorage.removeItem(this.getStorageKey(table));
  }

  clearAll(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('localdb_')) {
        localStorage.removeItem(key);
      }
    });
  }
}

export const localDB = new LocalDB();

// Helper function to check if we should use local DB
export const shouldUseLocalDB = (): boolean => {
  // Check if we're in development and Supabase is not accessible
  return import.meta.env.DEV && localStorage.getItem('use_local_db') === 'true';
};

// Function to enable/disable local DB
export const setUseLocalDB = (use: boolean): void => {
  localStorage.setItem('use_local_db', use.toString());
};

// Mock Supabase-like interface for local DB
export const createLocalSupabaseClient = () => {
  return {
    from: (table: string) => ({
      select: (columns = '*') => {
        const data = localDB.select(table);
        return {
          data,
          error: null,
          count: data.length,
          order: (column: string, options?: { ascending?: boolean }) => {
            const sortedData = [...data].sort((a, b) => {
              const aVal = a[column];
              const bVal = b[column];
              const ascending = options?.ascending !== false;

              if (aVal < bVal) return ascending ? -1 : 1;
              if (aVal > bVal) return ascending ? 1 : -1;
              return 0;
            });

            return Promise.resolve({
              data: sortedData,
              error: null,
              count: sortedData.length,
            });
          },
        };
      },
      insert: (data: any[]) => {
        try {
          const insertedItems = data.map(item => localDB.insert(table, item));
          return {
            data: insertedItems,
            error: null,
            select: () => ({
              data: insertedItems,
              error: null,
            }),
          };
        } catch (error: any) {
          return {
            data: null,
            error: { message: error.message },
            select: () => ({
              data: null,
              error: { message: error.message },
            }),
          };
        }
      },
      update: (data: any) => ({
        eq: (column: string, value: any) => {
          try {
            const items = localDB.select(table);
            const item = items.find(item => item[column] === value);
            if (!item) {
              throw new Error('Item not found');
            }
            const updatedItem = localDB.update(table, item.id, data);
            return {
              data: [updatedItem],
              error: null,
              select: () => ({
                data: [updatedItem],
                error: null,
              }),
            };
          } catch (error: any) {
            return {
              data: null,
              error: { message: error.message },
              select: () => ({
                data: null,
                error: { message: error.message },
              }),
            };
          }
        },
      }),
      delete: () => ({
        eq: (column: string, value: any) => {
          try {
            const items = localDB.select(table);
            const item = items.find(item => item[column] === value);
            if (!item) {
              throw new Error('Item not found');
            }
            const success = localDB.delete(table, item.id);
            return {
              data: success ? [item] : null,
              error: success ? null : { message: 'Delete failed' },
            };
          } catch (error: any) {
            return {
              data: null,
              error: { message: error.message },
            };
          }
        },
      }),
    }),
  };
};
