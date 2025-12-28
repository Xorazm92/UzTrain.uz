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

interface Slide {
  id: number;
  title: string;
  description: string | null;
  file_path: string | null;
  marzu_turi: string | null;
  xavfsizlik_darajasi: string;
  created_at: string;
  updated_at: string | null;
}

interface SlideFormData {
  title: string;
  description: string;
  marzu_turi: string;
  xavfsizlik_darajasi: string;
}

const presentationTypes = [
  { value: 'ta\'lim', label: 'Ta\'lim' },
  { value: 'trening', label: 'Trening' },
  { value: 'seminar', label: 'Seminar' },
  { value: 'konferensiya', label: 'Konferensiya' },
  { value: 'boshqa', label: 'Boshqa' },
];

const safetyLevels = [
  { value: 'sanoat_xavfsizligi', label: 'Sanoat Xavfsizligi' },
  { value: 'mehnat_muhofazasi', label: 'Mehnat Muhofazasi' },
  { value: 'sogliqni_saqlash', label: 'Sog\'liqni Saqlash' },
  { value: 'yol_harakati', label: 'Yo\'l Harakati' },
  { value: 'yongin_xavfsizligi', label: 'Yong\'in Xavfsizligi' },
  { value: 'elektr_xavfsizligi', label: 'Elektr Xavfsizligi' },
];

export default function Slides() {
  const [data, setData] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Slide | null>(null);
  const [deletingItem, setDeletingItem] = useState<Slide | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm<SlideFormData>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await smartDB.select('slaydlar', '*');

      if (result.error) {
        console.error('Error fetching slides:', result.error);
        toast.error('Ma\'lumotlarni yuklashda xatolik yuz berdi');
      } else {
        setData(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching slides:', error);
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

  const handleEdit = (item: Slide) => {
    setEditingItem(item);
    setValue('title', item.title);
    setValue('description', item.description || '');
    setValue('marzu_turi', item.marzu_turi || '');
    setValue('xavfsizlik_darajasi', item.xavfsizlik_darajasi);
    setSelectedFile(null);
    setFormOpen(true);
  };

  const handleDelete = (item: Slide) => {
    setDeletingItem(item);
    setDeleteOpen(true);
  };

  const onSubmit = async (formData: SlideFormData) => {
    try {
      let file_path = editingItem?.file_path;

      // Handle file upload if a new file is selected
      if (selectedFile) {
        try {
          file_path = await uploadFileWithValidation(selectedFile, 'slides', {
            allowedTypes: ['image/*', 'application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
            maxSizeMB: 20,
            compress: selectedFile.type.startsWith('image/'),
            maxWidth: 1200,
            quality: 0.8
          });
          console.log('✅ Slide file uploaded successfully');
        } catch (error: any) {
          console.error('❌ Slide upload failed:', error);
          toast.error(error.message || 'Slayd yuklashda xatolik');
          return;
        }
      }

      const slideData = {
        ...formData,
        file_path,
        updated_at: new Date().toISOString(),
      };

      if (editingItem) {
        const result = await smartDB.update('slaydlar', slideData, editingItem.id);

        if (result.error) {
          console.error('Error updating slide:', result.error);
          toast.error('Slayd yangilashda xatolik yuz berdi');
          return;
        }

        toast.success('Slayd muvaffaqiyatli yangilandi');
      } else {
        const result = await smartDB.insert('slaydlar', [slideData]);

        if (result.error) {
          console.error('Error creating slide:', result.error);
          toast.error('Slayd yaratishda xatolik yuz berdi');
          return;
        }
        toast.success('Slayd muvaffaqiyatli qo\'shildi');
      }

      setFormOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving slide:', error);
      toast.error('Saqlashda xatolik yuz berdi');
    }
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;

    try {
      // Delete file if it exists
      if (deletingItem.file_path) {
        await deleteFile(deletingItem.file_path);
      }

      const result = await smartDB.delete('slaydlar', deletingItem.id);

      if (result.error) {
        console.error('Error deleting slide:', result.error);
        toast.error('O\'chirishda xatolik yuz berdi');
        return;
      }

      toast.success('Slayd muvaffaqiyatli o\'chirildi');
      setDeleteOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error deleting slide:', error);
      toast.error('O\'chirishda xatolik yuz berdi');
    }
  };

  const columns: ColumnDef<Slide>[] = [
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
      accessorKey: 'marzu_turi',
      header: 'Ma\'ruza Turi',
      cell: ({ row }) => {
        const type = row.getValue('marzu_turi') as string;
        const typeConfig = presentationTypes.find(t => t.value === type);
        return (
          <Badge variant="secondary">
            {typeConfig?.label || type || 'Belgilanmagan'}
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
      header: 'Fayl',
      cell: ({ row }) => {
        const filePath = row.getValue('file_path') as string;
        return filePath ? (
          <Button variant="outline" size="sm" onClick={() => window.open(filePath, '_blank')}>
            <ExternalLink className="h-4 w-4 mr-1" />
            Ko'rish
          </Button>
        ) : (
          <span className="text-muted-foreground">Fayl yo'q</span>
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
        addButtonText="Yangi Slayd Qo'shish"
        title="Slaydlar"
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editingItem ? 'Slayd Tahrirlash' : 'Yangi Slayd Qo\'shish'}
        description="Slayd ma'lumotlarini kiriting"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Sarlavha *</Label>
            <Input
              id="title"
              {...register('title', { required: true })}
              placeholder="Slayd sarlavhasini kiriting"
            />
          </div>

          <div>
            <Label htmlFor="description">Tavsif</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Slayd tavsifini kiriting"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="marzu_turi">Ma'ruza Turi</Label>
            <Select
              value={watch('marzu_turi')}
              onValueChange={(value) => setValue('marzu_turi', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Ma'ruza turini tanlang" />
              </SelectTrigger>
              <SelectContent>
                {presentationTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
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
            accept=".ppt,.pptx,.pdf"
            maxSize={50}
            currentFile={editingItem?.file_path || undefined}
            label="Slayd Fayl"
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
        title="Slaydni o'chirish"
        description={`"${deletingItem?.title}" slaydini o'chirishni tasdiqlaysizmi? Bu amalni bekor qilib bo'lmaydi.`}
        onConfirm={confirmDelete}
        variant="destructive"
        confirmText="O'chirish"
      />
    </div>
  );
}
