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
import { uploadFileWithValidation, deleteFile } from '@/lib/fileUpload';
import { Edit, Trash2, Play } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface VideoMaterial {
  id: number;
  title: string;
  description: string | null;
  video_url: string | null;
  file_path: string | null;
  xavfsizlik_darajasi: string;
  created_at: string;
  updated_at: string | null;
}

interface VideoFormData {
  title: string;
  description: string;
  video_url: string;
  xavfsizlik_darajasi: string;
}

const safetyLevels = [
  { value: 'sanoat_xavfsizligi', label: 'Sanoat Xavfsizligi' },
  { value: 'mehnat_muhofazasi', label: 'Mehnat Muhofazasi' },
  { value: 'sogliqni_saqlash', label: 'Sog\'liqni Saqlash' },
  { value: 'yol_harakati', label: 'Yo\'l Harakati' },
  { value: 'yongin_xavfsizligi', label: 'Yong\'in Xavfsizligi' },
  { value: 'elektr_xavfsizligi', label: 'Elektr Xavfsizligi' },
];

export default function VideoMaterials() {
  const [data, setData] = useState<VideoMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VideoMaterial | null>(null);
  const [deletingItem, setDeletingItem] = useState<VideoMaterial | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm<VideoFormData>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: videos, error } = await supabase
        .from('video_materiallar')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setData(videos || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
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

  const handleEdit = (item: VideoMaterial) => {
    setEditingItem(item);
    setValue('title', item.title);
    setValue('description', item.description || '');
    setValue('video_url', item.video_url || '');
    setValue('xavfsizlik_darajasi', item.xavfsizlik_darajasi);
    setSelectedFile(null);
    setFormOpen(true);
  };

  const handleDelete = (item: VideoMaterial) => {
    setDeletingItem(item);
    setDeleteOpen(true);
  };

  const onSubmit = async (formData: VideoFormData) => {
    try {
      let file_path = editingItem?.file_path;

      // Handle file upload if a new file is selected
      if (selectedFile) {
        try {
          file_path = await uploadFileWithValidation(selectedFile, 'videos', {
            allowedTypes: ['video/*', 'audio/*'],
            maxSizeMB: 50,
            compress: false
          });
          console.log('✅ Video file uploaded successfully');
        } catch (error: any) {
          console.error('❌ Video upload failed:', error);
          toast.error(error.message || 'Video yuklashda xatolik');
          return;
        }
      }

      const videoData = {
        ...formData,
        file_path,
        updated_at: new Date().toISOString(),
      };

      if (editingItem) {
        const { error } = await supabase
          .from('video_materiallar')
          .update(videoData)
          .eq('id', editingItem.id);

        if (error) throw error;
        toast.success('Video muvaffaqiyatli yangilandi');
      } else {
        const { error } = await supabase
          .from('video_materiallar')
          .insert([videoData]);

        if (error) throw error;
        toast.success('Video muvaffaqiyatli qo\'shildi');
      }

      setFormOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving video:', error);
      toast.error('Saqlashda xatolik yuz berdi');
    }
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;

    try {
      const { error } = await supabase
        .from('video_materiallar')
        .delete()
        .eq('id', deletingItem.id);

      if (error) throw error;

      toast.success('Video muvaffaqiyatli o\'chirildi');
      setDeleteOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error('O\'chirishda xatolik yuz berdi');
    }
  };

  const columns: ColumnDef<VideoMaterial>[] = [
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
      accessorKey: 'description',
      header: 'Tavsif',
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate text-muted-foreground">
          {row.getValue('description') || 'Tavsif yo\'q'}
        </div>
      ),
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
      accessorKey: 'video_url',
      header: 'Video',
      cell: ({ row }) => {
        const url = row.getValue('video_url') as string;
        return url ? (
          <Button variant="outline" size="sm" onClick={() => window.open(url, '_blank')}>
            <Play className="h-4 w-4 mr-1" />
            Ko'rish
          </Button>
        ) : (
          <span className="text-muted-foreground">URL yo'q</span>
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
        addButtonText="Yangi Video Qo'shish"
        title="Video Materiallar"
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editingItem ? 'Video Tahrirlash' : 'Yangi Video Qo\'shish'}
        description="Video ma'lumotlarini kiriting"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Sarlavha *</Label>
            <Input
              id="title"
              {...register('title', { required: true })}
              placeholder="Video sarlavhasini kiriting"
            />
          </div>

          <div>
            <Label htmlFor="description">Tavsif</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Video tavsifini kiriting"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="video_url">Video URL</Label>
            <Input
              id="video_url"
              {...register('video_url')}
              placeholder="https://youtube.com/watch?v=..."
              type="url"
            />
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
            accept="video/*"
            maxSize={100}
            currentFile={editingItem?.file_path || undefined}
            label="Video Fayl (ixtiyoriy)"
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
        title="Videoni o'chirish"
        description={`"${deletingItem?.title}" videosini o'chirishni tasdiqlaysizmi? Bu amalni bekor qilib bo'lmaydi.`}
        onConfirm={confirmDelete}
        variant="destructive"
        confirmText="O'chirish"
      />
    </div>
  );
}
