import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Settings as SettingsIcon, 
  Database, 
  Shield, 
  Bell, 
  Palette,
  Globe,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Save,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { smartDB } from '@/lib/smartDB';

interface SystemSettings {
  siteName: string;
  siteDescription: string;
  adminEmail: string;
  maxFileSize: number;
  allowedFileTypes: string[];
  enableNotifications: boolean;
  enablePWA: boolean;
  defaultLanguage: string;
  theme: string;
  maintenanceMode: boolean;
}

const defaultSettings: SystemSettings = {
  siteName: 'NBT Admin',
  siteDescription: 'Xavfsizlik ta\'limi platformasi admin paneli',
  adminEmail: 'admin@safedocs.uz',
  maxFileSize: 10,
  allowedFileTypes: ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.png', '.mp4'],
  enableNotifications: true,
  enablePWA: true,
  defaultLanguage: 'uz',
  theme: 'system',
  maintenanceMode: false,
};

export default function Settings() {
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    // Load settings from localStorage (in a real app, this would come from a database)
    const savedSettings = localStorage.getItem('admin-settings');
    if (savedSettings) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  };

  // Assets → DB sync UI removed (we're moving to Storage-first approach)

  const saveSettings = async () => {
    try {
      setSaving(true);
      
      // Save to localStorage (in a real app, this would save to database)
      localStorage.setItem('admin-settings', JSON.stringify(settings));
      
      toast.success('Sozlamalar muvaffaqiyatli saqlandi');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Sozlamalarni saqlashda xatolik yuz berdi');
    } finally {
      setSaving(false);
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('admin-settings');
    toast.success('Sozlamalar asl holatiga qaytarildi');
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'admin-settings.json';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Sozlamalar eksport qilindi');
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string);
        setSettings({ ...defaultSettings, ...importedSettings });
        toast.success('Sozlamalar import qilindi');
      } catch (error) {
        toast.error('Fayl formatida xatolik');
      }
    };
    reader.readAsText(file);
  };

  const clearCache = async () => {
    try {
      setLoading(true);
      
      // Clear browser cache
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      
      // Clear localStorage except settings
      const settingsBackup = localStorage.getItem('admin-settings');
      localStorage.clear();
      if (settingsBackup) {
        localStorage.setItem('admin-settings', settingsBackup);
      }
      
      toast.success('Cache tozalandi');
    } catch (error) {
      toast.error('Cache tozalashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sozlamalar</h1>
          <p className="text-muted-foreground">
            Tizim sozlamalari va konfiguratsiyalar
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={exportSettings}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={resetSettings}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={saveSettings} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saqlanmoqda...' : 'Saqlash'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Umumiy</TabsTrigger>
          <TabsTrigger value="files">Fayllar</TabsTrigger>
          <TabsTrigger value="notifications">Bildirishnomalar</TabsTrigger>
          <TabsTrigger value="appearance">Ko'rinish</TabsTrigger>
          <TabsTrigger value="system">Tizim</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Asosiy Sozlamalar</CardTitle>
              <CardDescription>
                Sayt nomi va asosiy ma'lumotlar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Sayt Nomi</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  placeholder="NBT Admin"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Sayt Tavsifi</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  placeholder="Xavfsizlik ta'limi platformasi"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                  placeholder="admin@safedocs.uz"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultLanguage">Standart Til</Label>
                <Select
                  value={settings.defaultLanguage}
                  onValueChange={(value) => setSettings({ ...settings, defaultLanguage: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uz">O'zbek</SelectItem>
                    <SelectItem value="ru">Русский</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fayl Sozlamalari</CardTitle>
              <CardDescription>
                Fayl yuklash va saqlash sozlamalari
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="maxFileSize">Maksimal Fayl Hajmi (MB)</Label>
                <Input
                  id="maxFileSize"
                  type="number"
                  value={settings.maxFileSize}
                  onChange={(e) => setSettings({ ...settings, maxFileSize: parseInt(e.target.value) || 10 })}
                  min="1"
                  max="100"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Ruxsat Etilgan Fayl Turlari</Label>
                <div className="flex flex-wrap gap-2">
                  {settings.allowedFileTypes.map((type, index) => (
                    <Badge key={index} variant="secondary">
                      {type}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Hozircha faqat ko'rish rejimida. Tahrirlash funksiyasi keyingi versiyada qo'shiladi.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bildirishnoma Sozlamalari</CardTitle>
              <CardDescription>
                Push bildirishnomalar va email xabarlari
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Bildirishnomalarni Yoqish</Label>
                  <p className="text-sm text-muted-foreground">
                    Yangi ma'lumotlar qo'shilganda bildirishnoma yuborish
                  </p>
                </div>
                <Switch
                  checked={settings.enableNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableNotifications: checked })}
                />
              </div>
              
              <Separator />

              
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>PWA Yoqish</Label>
                  <p className="text-sm text-muted-foreground">
                    Progressive Web App funksiyalarini yoqish
                  </p>
                </div>
                <Switch
                  checked={settings.enablePWA}
                  onCheckedChange={(checked) => setSettings({ ...settings, enablePWA: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ko'rinish Sozlamalari</CardTitle>
              <CardDescription>
                Tema va interfeys sozlamalari
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tema</Label>
                <Select
                  value={settings.theme}
                  onValueChange={(value) => setSettings({ ...settings, theme: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Yorug'</SelectItem>
                    <SelectItem value="dark">Qorong'u</SelectItem>
                    <SelectItem value="system">Tizim</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tizim Sozlamalari</CardTitle>
              <CardDescription>
                Tizim boshqaruvi va texnik sozlamalar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Texnik Ishlar Rejimi</Label>
                  <p className="text-sm text-muted-foreground">
                    Saytni vaqtincha yopish
                  </p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div>
                  <Label>Import/Export</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <input
                      type="file"
                      accept=".json"
                      onChange={importSettings}
                      className="hidden"
                      id="import-settings"
                    />
                    <Button variant="outline" onClick={() => document.getElementById('import-settings')?.click()}>
                      <Upload className="mr-2 h-4 w-4" />
                      Import
                    </Button>
                    <Button variant="outline" onClick={exportSettings}>
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label>Cache Boshqaruvi</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Button variant="outline" onClick={clearCache} disabled={loading}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      {loading ? 'Tozalanmoqda...' : 'Cache Tozalash'}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Brauzer cache va vaqtincha fayllarni tozalash
                  </p>
                </div>
              </div>
              
              {settings.maintenanceMode && (
                <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    Texnik ishlar rejimi yoqilgan. Foydalanuvchilar saytga kira olmaydi.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
