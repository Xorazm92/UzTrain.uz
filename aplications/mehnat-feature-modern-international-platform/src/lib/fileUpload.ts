import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Image compression utility
export const compressImage = (file: File, maxWidth = 800, quality = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Convert to base64
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };

    img.onerror = () => reject(new Error('Image loading failed'));
    img.src = URL.createObjectURL(file);
  });
};

// Convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Universal file upload with fallback
export const uploadFile = async (
  file: File, 
  folder: string = 'uploads',
  options: {
    compress?: boolean;
    maxWidth?: number;
    quality?: number;
  } = {}
): Promise<string> => {
  const { compress = false, maxWidth = 800, quality = 0.7 } = options;
  
  try {
    // Method 1: Try Supabase storage upload
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('materials')
      .upload(filePath, file);

    if (!uploadError) {
      // Success with Supabase storage
      const { data: { publicUrl } } = supabase.storage
        .from('materials')
        .getPublicUrl(filePath);
      
      console.log('✅ File uploaded to Supabase storage:', publicUrl);
      return publicUrl;
    }

    // If Supabase storage fails, log the error
    console.warn('⚠️ Supabase storage failed, using fallback:', uploadError.message);
    
  } catch (error: any) {
    console.warn('⚠️ Supabase storage error, using fallback:', error.message);
  }

  // Method 2: Fallback to base64 storage
  try {
    let base64Data: string;
    
    if (compress && file.type.startsWith('image/')) {
      // Compress images
      base64Data = await compressImage(file, maxWidth, quality);
      console.log('📦 Image compressed and converted to base64');
    } else {
      // Convert to base64 without compression
      base64Data = await fileToBase64(file);
      console.log('📄 File converted to base64');
    }
    
    toast.success('Fayl base64 formatda saqlandi');
    return base64Data;
    
  } catch (error: any) {
    console.error('❌ Base64 conversion failed:', error);
    toast.error('Fayl yuklashda xatolik yuz berdi');
    throw new Error('Fayl yuklash muvaffaqiyatsiz');
  }
};

// Check if URL is base64
export const isBase64Url = (url: string): boolean => {
  return url.startsWith('data:');
};

// Get file size from base64
export const getBase64Size = (base64: string): number => {
  const base64Length = base64.length - (base64.indexOf(',') + 1);
  return Math.round((base64Length * 3) / 4);
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Validate file type
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      return file.type.startsWith(type.slice(0, -1));
    }
    return file.type === type;
  });
};

// Validate file size
export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

// File upload with validation
export const uploadFileWithValidation = async (
  file: File,
  folder: string = 'uploads',
  options: {
    allowedTypes?: string[];
    maxSizeMB?: number;
    compress?: boolean;
    maxWidth?: number;
    quality?: number;
  } = {}
): Promise<string> => {
  const {
    allowedTypes = ['image/*', 'video/*', 'application/pdf'],
    maxSizeMB = 10,
    compress = false,
    maxWidth = 800,
    quality = 0.7
  } = options;

  // Validate file type
  if (!validateFileType(file, allowedTypes)) {
    const allowedTypesStr = allowedTypes.join(', ');
    throw new Error(`Fayl turi ruxsat etilmagan. Ruxsat etilgan turlar: ${allowedTypesStr}`);
  }

  // Validate file size
  if (!validateFileSize(file, maxSizeMB)) {
    throw new Error(`Fayl hajmi ${maxSizeMB}MB dan oshmasligi kerak. Joriy hajm: ${formatFileSize(file.size)}`);
  }

  // Upload file
  return uploadFile(file, folder, { compress, maxWidth, quality });
};

// Delete file from storage
export const deleteFile = async (filePath: string): Promise<boolean> => {
  try {
    // Skip deletion for base64 files
    if (isBase64Url(filePath)) {
      console.log('📄 Base64 file, skipping deletion');
      return true;
    }

    // Extract file path from URL
    const url = new URL(filePath);
    const pathParts = url.pathname.split('/');
    const fileName = pathParts[pathParts.length - 1];
    const folder = pathParts[pathParts.length - 2];
    const fullPath = `${folder}/${fileName}`;

    const { error } = await supabase.storage
      .from('materials')
      .remove([fullPath]);

    if (error) {
      console.warn('⚠️ File deletion failed:', error.message);
      return false;
    }

    console.log('🗑️ File deleted from storage:', fullPath);
    return true;
  } catch (error: any) {
    console.warn('⚠️ File deletion error:', error.message);
    return false;
  }
};
