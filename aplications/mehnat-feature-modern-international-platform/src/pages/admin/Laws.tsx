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
import { Edit, Trash2, ExternalLink } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface Law {
  id: number;
  titleblob: string;
  content: string | null;
  file_path: string | null;
  normativ_hujjat_id: number | null;
  xavfsizlik_darajasi: string;
  created_at: string;
  updated_at: string | null;
}

interface LawFormData {
  titleblob: string;
  content: string;
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

export default function Laws() {
  const [data, setData] = useState<Law[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Law | null>(null);
  const [deletingItem, setDeletingItem] = useState<Law | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm<LawFormData>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: laws, error } = await supabase
        .from('qonunlar')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setData(laws || []);
    } catch (error) {
      console.error('Error fetching laws:', error);
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

  const handleEdit = (item: Law) => {
    setEditingItem(item);
    setValue('titleblob', item.titleblob);
    setValue('content', item.content || '');
    setValue('xavfsizlik_darajasi', item.xavfsizlik_darajasi);
    setSelectedFile(null);
    setFormOpen(true);
  };

  const handleDelete = (item: Law) => {
    setDeletingItem(item);
    setDeleteOpen(true);
  };

  const onSubmit = async (formData: LawFormData) => {
    try {
      let file_path = editingItem?.file_path;

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `laws/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('materials')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('materials')
          .getPublicUrl(filePath);

        file_path = publicUrl;
      }

      const lawData = {
        ...formData,
        file_path,
        updated_at: new Date().toISOString(),
      };

      if (editingItem) {
        const { error } = await supabase
          .from('qonunlar')
          .update(lawData)
          .eq('id', editingItem.id);

        if (error) throw error;
        toast.success('Qonun muvaffaqiyatli yangilandi');
      } else {
        const { error } = await supabase
          .from('qonunlar')
          .insert([lawData]);

        if (error) throw error;
        toast.success('Qonun muvaffaqiyatli qo\'shildi');
      }

      setFormOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving law:', error);
      toast.error('Saqlashda xatolik yuz berdi');
    }
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;

    try {
      const { error } = await supabase
        .from('qonunlar')
        .delete()
        .eq('id', deletingItem.id);

      if (error) throw error;

      toast.success('Qonun muvaffaqiyatli o\'chirildi');
      setDeleteOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error deleting law:', error);
      toast.error('O\'chirishda xatolik yuz berdi');
    }
  };

  const columns: ColumnDef<Law>[] = [
    {
      accessorKey: 'titleblob',
      header: 'Sarlavha',
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate font-medium">
          {row.getValue('titleblob')}
        </div>
      ),
    },
    {
      accessorKey: 'content',
      header: 'Mazmun',
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate text-muted-foreground">
          {row.getValue('content') || 'Mazmun yo\'q'}
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
        searchKey="titleblob"
        onAdd={handleAdd}
        addButtonText="Yangi Qonun Qo'shish"
        title="Qonunlar"
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editingItem ? 'Qonun Tahrirlash' : 'Yangi Qonun Qo\'shish'}
        description="Qonun ma'lumotlarini kiriting"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="titleblob">Sarlavha *</Label>
            <Input
              id="titleblob"
              {...register('titleblob', { required: true })}
              placeholder="Qonun sarlavhasini kiriting"
            />
          </div>

          <div>
            <Label htmlFor="content">Mazmun</Label>
            <Textarea
              id="content"
              {...register('content')}
              placeholder="Qonun mazmunini kiriting"
              rows={4}
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
            accept=".pdf,.doc,.docx,.txt"
            maxSize={10}
            currentFile={editingItem?.file_path || undefined}
            label="Qonun Fayl (ixtiyoriy)"
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
        title="Qonunni o'chirish"
        description={`"${deletingItem?.titleblob}" qonunini o'chirishni tasdiqlaysizmi? Bu amalni bekor qilib bo'lmaydi.`}
        onConfirm={confirmDelete}
        variant="destructive"
        confirmText="O'chirish"
      />
    </div>
  );
}
