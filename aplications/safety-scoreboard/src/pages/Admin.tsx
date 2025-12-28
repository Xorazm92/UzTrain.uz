import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  Users,
  Building2,
  Activity,
  Shield,
  Search,
  UserPlus,
  LogOut
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase, Company } from "@/lib/supabase";
import {
  getUsers,
  addUser,
  removeUser,
  User,
  UserRole,
  getRoleLabel,
  getRoleColor
} from "@/lib/auth/auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function Admin() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // New User State
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({
    role: 'user',
    displayName: '',
    username: '',
    password: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load Companies
      const { data: companiesData, error } = await supabase
        .from('companies')
        .select('*')
        .order('overall_index', { ascending: false });

      if (error) throw error;
      setCompanies(companiesData || []);

      // Load Users
      setUsers(getUsers());

    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        title: "Xatolik",
        description: "Ma'lumotlarni yuklashda xatolik",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompany = async (id: string) => {
    if (!confirm("Rostdan ham bu korxonani o'chirmoqchimisiz?")) return;

    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCompanies(prev => prev.filter(c => c.id !== id));
      toast({
        title: "Muvaffaqiyatli",
        description: "Korxona o'chirildi"
      });
    } catch (error) {
      console.error('Error deleting company:', error);
      toast({
        title: "Xatolik",
        description: "O'chirishda xatolik yuz berdi",
        variant: "destructive"
      });
    }
  };

  const handleAddUser = () => {
    if (!newUser.username || !newUser.password || !newUser.displayName) {
      toast({
        title: "Xatolik",
        description: "Barcha maydonlarni to'ldiring",
        variant: "destructive"
      });
      return;
    }

    try {
      addUser(newUser as User);
      setUsers(getUsers());
      setIsAddUserOpen(false);
      setNewUser({ role: 'user', displayName: '', username: '', password: '' });
      toast({
        title: "Muvaffaqiyatli",
        description: "Foydalanuvchi qo'shildi"
      });
    } catch (error: any) {
      toast({
        title: "Xatolik",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = (username: string) => {
    if (username === 'admin') {
      toast({
        title: "Xatolik",
        description: "Admin foydalanuvchisini o'chirib bo'lmaydi",
        variant: "destructive"
      });
      return;
    }

    if (!confirm("Rostdan ham bu foydalanuvchini o'chirmoqchimisiz?")) return;

    removeUser(username);
    setUsers(getUsers());
    toast({
      title: "Muvaffaqiyatli",
      description: "Foydalanuvchi o'chirildi"
    });
  };

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground">Tizimni boshqarish markazi</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => loadData()} className="border-border hover:bg-accent hover:text-accent-foreground">
              Yangilash
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-100 dark:border-blue-900">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl text-blue-600 dark:text-blue-400">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Jami Korxonalar</p>
                <p className="text-2xl font-bold text-foreground">{companies.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-100 dark:border-green-900">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-xl text-green-600 dark:text-green-400">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Yashil Zona</p>
                <p className="text-2xl font-bold text-foreground">
                  {companies.filter(c => c.zone === 'green').length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 border-orange-100 dark:border-orange-900">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-xl text-orange-600 dark:text-orange-400">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Foydalanuvchilar</p>
                <p className="text-2xl font-bold text-foreground">{users.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 border-purple-100 dark:border-purple-900">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-xl text-purple-600 dark:text-purple-400">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">O'rtacha Ball</p>
                <p className="text-2xl font-bold text-foreground">
                  {(companies.reduce((acc, c) => acc + c.overall_index, 0) / (companies.length || 1)).toFixed(1)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="companies" className="space-y-6">
          <TabsList className="bg-card border border-border p-1">
            <TabsTrigger value="companies" className="data-[state=active]:bg-orange-50 dark:data-[state=active]:bg-orange-900/20 data-[state=active]:text-orange-700 dark:data-[state=active]:text-orange-400">
              Korxonalar
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-orange-50 dark:data-[state=active]:bg-orange-900/20 data-[state=active]:text-orange-700 dark:data-[state=active]:text-orange-400">
              Foydalanuvchilar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="companies" className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Qidirish..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 border-border"
                />
              </div>
              <Button onClick={() => navigate('/companies/new')} className="bg-orange-600 hover:bg-orange-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Yangi Korxona
              </Button>
            </div>

            <Card className="border-border shadow-sm dark:shadow-none bg-card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Korxona</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Daraja</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Xodimlar</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Ball</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Amallar</th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {filteredCompanies.map((company) => (
                      <tr key={company.id} className="hover:bg-muted/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-foreground">{company.name}</div>
                          <div className="text-sm text-muted-foreground">{company.profile}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {company.level}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-center">
                          {company.employees.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${company.zone === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                              company.zone === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                                'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'}`}>
                            {company.overall_index.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/companies/${company.id}/edit`)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-2"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCompany(company.id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-end">
              <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Foydalanuvchi qo'shish
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Yangi foydalanuvchi</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Ism Familiya</Label>
                      <Input
                        value={newUser.displayName}
                        onChange={(e) => setNewUser({ ...newUser, displayName: e.target.value })}
                        placeholder="Vali Valiyev"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Login (Username)</Label>
                      <Input
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        placeholder="login"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Parol</Label>
                      <Input
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        placeholder="******"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Rol</Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(v: UserRole) => setNewUser({ ...newUser, role: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrator</SelectItem>
                          <SelectItem value="manager">Menejer</SelectItem>
                          <SelectItem value="supervisor">Nazoratchi</SelectItem>
                          <SelectItem value="user">Foydalanuvchi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleAddUser} className="w-full bg-orange-600 hover:bg-orange-700">
                      Saqlash
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="border-border shadow-sm dark:shadow-none bg-card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Foydalanuvchi</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Login</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Rol</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Amallar</th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {users.map((user) => (
                      <tr key={user.username} className="hover:bg-muted/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-foreground">{user.displayName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {user.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                            {getRoleLabel(user.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {user.username !== 'admin' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.username)}
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
