import { smartDB } from '@/lib/smartDB';
import { uploadFileWithValidation, deleteFile } from '@/lib/fileUpload';
import { toast } from 'sonner';

// Generic CRUD operations for admin pages
export class AdminCRUD<T extends { id: number; file_path?: string }> {
  constructor(private tableName: string) {}

  // Fetch all records
  async fetchAll(orderBy: string = 'created_at', ascending: boolean = false): Promise<T[]> {
    try {
      const result = await smartDB.select<T>(this.tableName, {
        order: { column: orderBy, ascending }
      });

      if (result.error) {
        console.error(`Error fetching ${this.tableName}:`, result.error);
        toast.error('Ma\'lumotlarni yuklashda xatolik yuz berdi');
        return [];
      }

      return result.data || [];
    } catch (error) {
      console.error(`Error fetching ${this.tableName}:`, error);
      toast.error('Ma\'lumotlarni yuklashda xatolik yuz berdi');
      return [];
    }
  }

  // Create new record
  async create(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T | null> {
    try {
      const result = await smartDB.insert(this.tableName, {
        ...data,
        created_at: new Date().toISOString(),
        updated_at: null
      });

      if (result.error) {
        console.error(`Error creating ${this.tableName}:`, result.error);
        toast.error('Yaratishda xatolik yuz berdi');
        return null;
      }

      toast.success('Muvaffaqiyatli yaratildi');
      return result.data;
    } catch (error) {
      console.error(`Error creating ${this.tableName}:`, error);
      toast.error('Yaratishda xatolik yuz berdi');
      return null;
    }
  }

  // Update existing record
  async update(id: number, data: Partial<T>): Promise<T | null> {
    try {
      const result = await smartDB.update(this.tableName, id, {
        ...data,
        updated_at: new Date().toISOString()
      });

      if (result.error) {
        console.error(`Error updating ${this.tableName}:`, result.error);
        toast.error('Yangilashda xatolik yuz berdi');
        return null;
      }

      toast.success('Muvaffaqiyatli yangilandi');
      return result.data;
    } catch (error) {
      console.error(`Error updating ${this.tableName}:`, error);
      toast.error('Yangilashda xatolik yuz berdi');
      return null;
    }
  }

  // Delete record
  async delete(item: T): Promise<boolean> {
    try {
      // Delete associated file if exists
      if (item.file_path) {
        await deleteFile(item.file_path);
      }

      const result = await smartDB.delete(this.tableName, item.id);

      if (result.error) {
        console.error(`Error deleting ${this.tableName}:`, result.error);
        toast.error('O\'chirishda xatolik yuz berdi');
        return false;
      }

      toast.success('Muvaffaqiyatli o\'chirildi');
      return true;
    } catch (error) {
      console.error(`Error deleting ${this.tableName}:`, error);
      toast.error('O\'chirishda xatolik yuz berdi');
      return false;
    }
  }

  // Handle file upload for create/update operations
  async handleFileUpload(
    file: File | null,
    folder: string,
    options: {
      allowedTypes?: string[];
      maxSizeMB?: number;
      compress?: boolean;
      maxWidth?: number;
      quality?: number;
    } = {}
  ): Promise<string | null> {
    if (!file) return null;

    try {
      const filePath = await uploadFileWithValidation(file, folder, {
        allowedTypes: options.allowedTypes || ['image/*', 'video/*', 'application/pdf'],
        maxSizeMB: options.maxSizeMB || 10,
        compress: options.compress || false,
        maxWidth: options.maxWidth || 800,
        quality: options.quality || 0.7
      });

      console.log(`✅ File uploaded successfully for ${this.tableName}`);
      return filePath;
    } catch (error: any) {
      console.error(`❌ File upload failed for ${this.tableName}:`, error);
      toast.error(error.message || 'Fayl yuklashda xatolik');
      throw error;
    }
  }

  // Create with file upload
  async createWithFile(
    data: Omit<T, 'id' | 'created_at' | 'updated_at' | 'file_path'>,
    file: File | null,
    folder: string,
    fileOptions: any = {}
  ): Promise<T | null> {
    try {
      let file_path = null;
      
      if (file) {
        file_path = await this.handleFileUpload(file, folder, fileOptions);
      }

      return await this.create({
        ...data,
        file_path
      } as any);
    } catch (error) {
      return null;
    }
  }

  // Update with file upload
  async updateWithFile(
    id: number,
    data: Partial<T>,
    file: File | null,
    folder: string,
    currentFilePath?: string,
    fileOptions: any = {}
  ): Promise<T | null> {
    try {
      let file_path = currentFilePath;
      
      if (file) {
        // Delete old file if exists
        if (currentFilePath) {
          await deleteFile(currentFilePath);
        }
        
        file_path = await this.handleFileUpload(file, folder, fileOptions);
      }

      return await this.update(id, {
        ...data,
        file_path
      } as any);
    } catch (error) {
      return null;
    }
  }
}

// Common safety levels
export const safetyLevels = [
  { value: 'past', label: 'Past' },
  { value: 'orta', label: 'O\'rta' },
  { value: 'yuqori', label: 'Yuqori' },
  { value: 'juda_yuqori', label: 'Juda yuqori' },
];

// Common categories
export const categories = [
  { value: 'umumiy', label: 'Umumiy' },
  { value: 'texnik', label: 'Texnik' },
  { value: 'xavfsizlik', label: 'Xavfsizlik' },
  { value: 'qoidalar', label: 'Qoidalar' },
  { value: 'talim', label: 'Ta\'lim' },
];

// Format date for display
export const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

// Get safety level badge variant
export const getSafetyLevelVariant = (level: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (level) {
    case 'past': return 'secondary';
    case 'orta': return 'outline';
    case 'yuqori': return 'default';
    case 'juda_yuqori': return 'destructive';
    default: return 'secondary';
  }
};

// Truncate text for display
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// File type validation helpers
export const getFileTypeIcon = (filePath: string): string => {
  if (!filePath) return '📄';
  
  const extension = filePath.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf': return '📄';
    case 'doc':
    case 'docx': return '📝';
    case 'xls':
    case 'xlsx': return '📊';
    case 'ppt':
    case 'pptx': return '📊';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif': return '🖼️';
    case 'mp4':
    case 'avi':
    case 'mov': return '🎥';
    case 'mp3':
    case 'wav': return '🎵';
    default: return '📄';
  }
};

// Check if file is image
export const isImageFile = (filePath: string): boolean => {
  if (!filePath) return false;
  return filePath.startsWith('data:image/') || 
         /\.(jpg|jpeg|png|gif|webp)$/i.test(filePath);
};

// Check if file is video
export const isVideoFile = (filePath: string): boolean => {
  if (!filePath) return false;
  return filePath.startsWith('data:video/') || 
         /\.(mp4|avi|mov|wmv|flv|webm)$/i.test(filePath);
};
