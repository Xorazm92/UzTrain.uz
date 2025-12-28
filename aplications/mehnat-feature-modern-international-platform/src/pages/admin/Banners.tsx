import { useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/admin/DataTable';
import { FormDialog } from '@/components/admin/FormDialog';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { FileUpload } from '@/components/admin/FileUpload';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { smartDB } from '@/lib/smartDB';
import { uploadFileWithValidation, deleteFile } from '@/lib/fileUpload';
import { Edit, Trash2, ExternalLink } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface Banner {
  id: number;
  title: string;
  description: string | null;
  file_path: string | null;
  kategoriya: string;
  xavfsizlik_darajasi: string;
  created_at: string;
  updated_at: string | null;
}

interface BannerFormData {
  title: string;
  description: string;
  kategoriya: string;
  xavfsizlik_darajasi: string;
}

const categories = [
  { value: 'qonunlar', label: 'Qonunlar' },
  { value: 'qarorlar', label: 'Qarorlar' },
  { value: 'qoidalar', label: 'Qoidalar' },
  { value: 'slaydlar', label: 'Slaydlar' },
  { value: 'video_materiallar', label: 'Video Materiallar' },
  { value: 'temir_yol_hujjatlari', label: 'Temir Yo\'l Hujjatlari' },
  { value: 'bannerlar', label: 'Bannerlar' },
  { value: 'kasb_yoriqnomalari', label: 'Kasb Yo\'riqnomalari' },
];

const safetyLevels = [
  { value: 'sanoat_xavfsizligi', label: 'Sanoat Xavfsizligi' },
  { value: 'mehnat_muhofazasi', label: 'Mehnat Muhofazasi' },
  { value: 'sogliqni_saqlash', label: 'Sog\'liqni Saqlash' },
  { value: 'yol_harakati', label: 'Yo\'l Harakati' },
  { value: 'yongin_xavfsizligi', label: 'Yong\'in Xavfsizligi' },
  { value: 'elektr_xavfsizligi', label: 'Elektr Xavfsizligi' },
];

// Advanced image compression with multiple strategies
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const { width: originalWidth, height: originalHeight } = img;

      // Strategy 1: Try 800px with good quality
      let targetWidth = Math.min(800, originalWidth);
      let targetHeight = (originalHeight * targetWidth) / originalWidth;

      canvas.width = targetWidth;
      canvas.height = targetHeight;
      ctx?.drawImage(img, 0, 0, targetWidth, targetHeight);

      let compressed = canvas.toDataURL('image/jpeg', 0.8);
      console.log(`Strategy 1 (800px, 80%): ${compressed.length} chars`);

      // Strategy 2: If too large, try 600px with medium quality
      if (compressed.length > 400000) {
        targetWidth = Math.min(600, originalWidth);
        targetHeight = (originalHeight * targetWidth) / originalWidth;

        canvas.width = targetWidth;
        canvas.height = targetHeight;
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        ctx?.drawImage(img, 0, 0, targetWidth, targetHeight);

        compressed = canvas.toDataURL('image/jpeg', 0.6);
        console.log(`Strategy 2 (600px, 60%): ${compressed.length} chars`);
      }

      // Strategy 3: If still too large, try 400px with lower quality
      if (compressed.length > 400000) {
        targetWidth = Math.min(400, originalWidth);
        targetHeight = (originalHeight * targetWidth) / originalWidth;

        canvas.width = targetWidth;
        canvas.height = targetHeight;
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        ctx?.drawImage(img, 0, 0, targetWidth, targetHeight);

        compressed = canvas.toDataURL('image/jpeg', 0.4);
        console.log(`Strategy 3 (400px, 40%): ${compressed.length} chars`);
      }

      // Strategy 4: Last resort - very small and low quality
      if (compressed.length > 400000) {
        targetWidth = Math.min(300, originalWidth);
        targetHeight = (originalHeight * targetWidth) / originalWidth;

        canvas.width = targetWidth;
        canvas.height = targetHeight;
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        ctx?.drawImage(img, 0, 0, targetWidth, targetHeight);

        compressed = canvas.toDataURL('image/jpeg', 0.2);
        console.log(`Strategy 4 (300px, 20%): ${compressed.length} chars`);
      }

      const compressionRatio = ((file.size - (compressed.length * 0.75)) / file.size * 100).toFixed(1);
      console.log(`Final compression: ${file.size} bytes → ~${(compressed.length * 0.75).toFixed(0)} bytes (${compressionRatio}% reduction)`);

      resolve(compressed);
    };

    img.onerror = () => reject(new Error('Rasm yuklashda xatolik'));
    img.src = URL.createObjectURL(file);
  });
};

export default function Banners() {
  const [data, setData] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Banner | null>(null);
  const [deletingItem, setDeletingItem] = useState<Banner | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm<BannerFormData>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: banners, error } = await smartDB.select('banner');

      if (error) throw error;

      // Sort by created_at descending
      const sortedBanners = (banners || []).sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setData(sortedBanners);
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast.error('Ma\'lumotlarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    reset();
    setSelectedFile(null);
    setFormOpen(true);
  };

  const handleEdit = (item: Banner) => {
    setEditingItem(item);
    setValue('title', item.title);
    setValue('description', item.description || '');
    setValue('kategoriya', item.kategoriya);
    setValue('xavfsizlik_darajasi', item.xavfsizlik_darajasi);
    setSelectedFile(null);
    setFormOpen(true);
  };

  const handleDelete = (item: Banner) => {
    setDeletingItem(item);
    setDeleteOpen(true);
  };

  const onSubmit = async (formData: BannerFormData) => {
    try {
      let file_path = editingItem?.file_path;

      // Handle file upload if a new file is selected
      if (selectedFile) {
        console.log('Processing file:', selectedFile.name, 'Size:', selectedFile.size);

        try {
          // Compress and convert image to base64
          const compressedBase64 = await compressImage(selectedFile);
          file_path = compressedBase64;
          console.log('File compressed and converted to base64');
        } catch (error) {
          console.error('File conversion error:', error);
          throw new Error('Fayl o\'qishda xatolik yuz berdi');
        }
      }

      const bannerData = {
        ...formData,
        file_path,
        updated_at: new Date().toISOString(),
      };

      console.log('Saving banner data:', bannerData);

      if (editingItem) {
        const { error, data } = await smartDB.update('banner', bannerData, editingItem.id);

        if (error) {
          console.error('Update error:', error);
          throw new Error(`Yangilashda xatolik: ${error.message}`);
        }
        console.log('Update successful:', data);
        toast.success('Banner muvaffaqiyatli yangilandi');
      } else {
        const { error, data } = await smartDB.insert('banner', [bannerData]);

        if (error) {
          console.error('Insert error:', error);
          throw new Error(`Qo'shishda xatolik: ${error.message}`);
        }
        console.log('Insert successful:', data);
        toast.success('Banner muvaffaqiyatli qo\'shildi');
      }

      setFormOpen(false);
      fetchData();
    } catch (error: any) {
      console.error('Error saving banner:', error);
      const errorMessage = error?.message || 'Noma\'lum xatolik yuz berdi';

      // If it's a database size limit error, suggest local DB
      if (errorMessage.includes('value too long') || errorMessage.includes('character varying')) {
        toast.error('Rasm hajmi juda katta! Local Database rejimiga o\'ting yoki kichikroq rasm ishlating.');

        // Auto-suggest local DB
        setTimeout(() => {
          if (confirm('Local Database rejimiga o\'tishni xohlaysizmi? Bu muammoni hal qiladi.')) {
            localStorage.setItem('use_local_db', 'true');
            window.location.reload();
          }
        }, 2000);
      } else {
        toast.error(`Saqlashda xatolik: ${errorMessage}`);
      }
    }
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;

    try {
      const { error } = await smartDB.delete('banner', deletingItem.id);

      if (error) throw error;

      toast.success('Banner muvaffaqiyatli o\'chirildi');
      setDeleteOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast.error('O\'chirishda xatolik yuz berdi');
    }
  };

  const columns: ColumnDef<Banner>[] = [
    {
      accessorKey: 'title',
      header: 'Sarlavha',
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate font-medium">
          {row.getValue('title')}
        </div>
      ),
    },
    {
      accessorKey: 'kategoriya',
      header: 'Kategoriya',
      cell: ({ row }) => {
        const category = row.getValue('kategoriya') as string;
        const categoryConfig = categories.find(c => c.value === category);
        return (
          <Badge variant="secondary">
            {categoryConfig?.label || category}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'xavfsizlik_darajasi',
      header: 'Xavfsizlik Darajasi',
      cell: ({ row }) => {
        const level = row.getValue('xavfsizlik_darajasi') as string;
        const levelConfig = safetyLevels.find(l => l.value === level);
        return (
          <Badge variant="outline">
            {levelConfig?.label || level}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'file_path',
      header: 'Rasm',
      cell: ({ row }) => {
        const filePath = row.getValue('file_path') as string;
        return filePath ? (
          <div className="flex items-center space-x-2">
            {filePath.startsWith('data:image') ? (
              <img
                src={filePath}
                alt="Banner"
                className="w-8 h-8 object-cover rounded"
              />
            ) : null}
            <Button variant="outline" size="sm" onClick={() => {
              if (filePath.startsWith('data:')) {
                // For base64 images, create a blob URL
                const link = document.createElement('a');
                link.href = filePath;
                link.download = 'banner.jpg';
                link.click();
              } else {
                window.open(filePath, '_blank');
              }
            }}>
              <ExternalLink className="h-4 w-4 mr-1" />
              Ko'rish
            </Button>
          </div>
        ) : (
          <span className="text-muted-foreground">Rasm yo'q</span>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Yaratilgan',
      cell: ({ row }) => {
        const date = new Date(row.getValue('created_at'));
        return date.toLocaleDateString('uz-UZ');
      },
    },
    {
      id: 'actions',
      header: 'Harakatlar',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(item)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(item)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        columns={columns}
        data={data}
        searchKey="title"
        onAdd={handleAdd}
        addButtonText="Yangi Banner Qo'shish"
        title="Bannerlar"
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editingItem ? 'Banner Tahrirlash' : 'Yangi Banner Qo\'shish'}
        description="Banner ma'lumotlarini kiriting"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Sarlavha *</Label>
            <Input
              id="title"
              {...register('title', { required: true })}
              placeholder="Banner sarlavhasini kiriting"
            />
          </div>

          <div>
            <Label htmlFor="description">Tavsif</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Banner tavsifini kiriting"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="kategoriya">Kategoriya *</Label>
            <Select
              value={watch('kategoriya')}
              onValueChange={(value) => setValue('kategoriya', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Kategoriyani tanlang" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="xavfsizlik_darajasi">Xavfsizlik Darajasi *</Label>
            <Select
              value={watch('xavfsizlik_darajasi')}
              onValueChange={(value) => setValue('xavfsizlik_darajasi', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Xavfsizlik darajasini tanlang" />
              </SelectTrigger>
              <SelectContent>
                {safetyLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <FileUpload
            onFileSelect={setSelectedFile}
            accept="image/*"
            maxSize={5}
            currentFile={editingItem?.file_path || undefined}
            label="Banner Rasm"
          />

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
              Bekor qilish
            </Button>
            <Button type="submit">
              {editingItem ? 'Yangilash' : 'Qo\'shish'}
            </Button>
          </div>
        </form>
      </FormDialog>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Bannerni o'chirish"
        description={`"${deletingItem?.title}" bannerini o'chirishni tasdiqlaysizmi? Bu amalni bekor qilib bo'lmaydi.`}
        onConfirm={confirmDelete}
        variant="destructive"
        confirmText="O'chirish"
      />
    </div>
  );
}
