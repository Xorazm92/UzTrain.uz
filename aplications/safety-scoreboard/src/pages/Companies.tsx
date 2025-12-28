import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Filter, Building2 } from 'lucide-react';
import { supabase, Company } from '@/lib/supabase';
import { CompanyRankingCard } from '@/components/CompanyRankingCard';
import { hasPermission } from '@/lib/auth/auth';
import { useToast } from '@/hooks/use-toast';

export default function Companies() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [zoneFilter, setZoneFilter] = useState('all');

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('overall_index', { ascending: false });

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error loading companies:', error);
      toast({
        title: "Xatolik",
        description: "Ma'lumotlarni yuklashda xatolik yuz berdi",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesZone = zoneFilter === 'all' || company.zone === zoneFilter;
    return matchesSearch && matchesZone;
  });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 gradient-warm opacity-50 rounded-3xl blur-3xl"></div>
          <div className="relative bg-card rounded-2xl shadow-etsy-lg dark:shadow-none p-8 border border-orange-100 dark:border-orange-800">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
                  Korxonalar Ro'yxati
                </h1>
                <p className="text-muted-foreground">
                  Jami {filteredCompanies.length} ta korxona
                </p>
              </div>
              {hasPermission('addCompany') && (
                <Button
                  onClick={() => navigate('/companies/new')}
                  className="gradient-primary hover:opacity-90 shadow-etsy dark:shadow-none"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Yangi Korxona
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Korxona nomini qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-orange-200 dark:border-orange-800 focus:border-orange-500 bg-card"
            />
          </div>
          <Select value={zoneFilter} onValueChange={setZoneFilter}>
            <SelectTrigger className="w-full md:w-[200px] border-orange-200 dark:border-orange-800 bg-card">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha zonalar</SelectItem>
              <SelectItem value="green">🟢 Yashil zona</SelectItem>
              <SelectItem value="yellow">🟡 Sariq zona</SelectItem>
              <SelectItem value="red">🔴 Qizil zona</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Companies List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-12 h-12 border-4 border-orange-200 dark:border-orange-800 border-t-orange-500 rounded-full animate-spin mb-4"></div>
            <p className="text-muted-foreground font-medium">Yuklanmoqda...</p>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-etsy dark:shadow-none">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {searchTerm || zoneFilter !== 'all' ? 'Natija topilmadi' : 'Hali korxonalar qo\'shilmagan'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || zoneFilter !== 'all'
                ? 'Qidiruv shartlarini o\'zgartiring'
                : 'Yangi korxona qo\'shish uchun yuqoridagi tugmani bosing'}
            </p>
            {hasPermission('addCompany') && !searchTerm && zoneFilter === 'all' && (
              <Button onClick={() => navigate('/companies/new')} className="gradient-primary hover:opacity-90 shadow-etsy dark:shadow-none">
                <Plus className="w-4 h-4 mr-2" />
                Korxona Qo'shish
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCompanies.map((company, index) => (
              <CompanyRankingCard
                key={company.id}
                company={company}
                rank={index + 1}
                onClick={() => navigate(`/companies/${company.id}`)}
                delay={index * 50}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
