import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Presentation, Search, Download, Eye, Play } from 'lucide-react';
import { apiClient } from '@/integrations/supabase/client';
import { Slide } from '@/types/database';

const Slaydlar = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSafetyLevel, setSelectedSafetyLevel] = useState<string>('');

  const safetyLevels = [
    { value: 'mehnat_muhofazasi', label: 'Mehnat Muhofazasi' },
    { value: 'yongin_xavfsizligi', label: 'Yong\'in Xavfsizligi' },
    { value: 'elektr_xavfsizligi', label: 'Elektr Xavfsizligi' },
    { value: 'sanoat_xavfsizligi', label: 'Sanoat Xavfsizligi' },
    { value: 'yol_harakati', label: 'Yo\'l Harakati' },
    { value: 'sogliqni_saqlash', label: 'Sog\'liqni Saqlash' }
  ];

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);

      // Try to fetch from API, fallback to mock data if it fails
      try {
        const data = await apiClient.getSlides();
        setSlides(data);
      } catch (error) {
        console.error('API request failed, using mock data:', error);
        
        // Fallback mock data
        const mockSlides: Slide[] = [
          {
            id: 1,
            title: "Xavfsizlik ko'rsatmalari",
            description: "Ishlab chiqarish xavfsizligi bo'yicha taqdimot",
            file_path: "/slides/xavfsizlik-korsatmalari.pptx",
            marzu_turi: "trening",
            xavfsizlik_darajasi: "mehnat_muhofazasi",
            created_at: "2024-01-15T10:00:00Z",
            updated_at: "2024-01-15T10:00:00Z"
          },
          {
            id: 2,
            title: "Birinchi yordam",
            description: "Birinchi yordam ko'rsatish bo'yicha taqdimot",
            file_path: "/slides/birinchi-yordam.pptx",
            marzu_turi: "seminar",
            xavfsizlik_darajasi: "sogliqni_saqlash",
            created_at: "2024-01-10T09:00:00Z",
            updated_at: "2024-01-10T09:00:00Z"
          },
          {
            id: 3,
            title: "Elektr xavfsizligi",
            description: "Elektr qurilmalari bilan ishlashda xavfsizlik",
            file_path: "/slides/elektr-xavfsizligi.pptx",
            marzu_turi: "trening",
            xavfsizlik_darajasi: "elektr_xavfsizligi",
            created_at: "2024-01-05T08:00:00Z",
            updated_at: "2024-01-05T08:00:00Z"
          }
        ];
        setSlides(mockSlides);
      }
    } catch (error) {
      console.error('Error fetching slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSafetyLevelLabel = (value: string) => {
    return safetyLevels.find(level => level.value === value)?.label || value;
  };

  const getSafetyLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      'mehnat_muhofazasi': 'bg-blue-100 text-blue-800',
      'yongin_xavfsizligi': 'bg-red-100 text-red-800',
      'elektr_xavfsizligi': 'bg-yellow-100 text-yellow-800',
      'sanoat_xavfsizligi': 'bg-green-100 text-green-800',
      'yol_harakati': 'bg-purple-100 text-purple-800',
      'sogliqni_saqlash': 'bg-pink-100 text-pink-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const filteredSlides = slides.filter(slide => {
    const matchesSearch = slide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         slide.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSafetyLevel = !selectedSafetyLevel || selectedSafetyLevel === 'all' || slide.xavfsizlik_darajasi === selectedSafetyLevel;
    return matchesSearch && matchesSafetyLevel;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Presentation className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Trening Slaydlari
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Xavfsizlik bo'yicha ta'lim va trening uchun tayyorlangan slaydlar to'plami
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Slaydlarni qidirish..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-64">
                <Select value={selectedSafetyLevel} onValueChange={setSelectedSafetyLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Xavfsizlik darajasi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barchasi</SelectItem>
                    {safetyLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Slides Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-32 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredSlides.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Presentation className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Slaydlar topilmadi</h3>
              <p className="text-muted-foreground text-center">
                Qidiruv shartlaringizga mos slaydlar mavjud emas
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSlides.map((slide) => (
              <Card key={slide.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-6 mb-4">
                    <Presentation className="h-12 w-12 text-primary mx-auto" />
                    <div className="absolute top-2 right-2">
                      <Badge className={getSafetyLevelColor(slide.xavfsizlik_darajasi)}>
                        {getSafetyLevelLabel(slide.xavfsizlik_darajasi)}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{slide.title}</CardTitle>
                  <CardDescription className="flex items-center justify-between">
                    <span>{new Date(slide.created_at).toLocaleDateString('uz-UZ')}</span>
                    {slide.marzu_turi && (
                      <Badge variant="outline" className="text-xs">
                        {slide.marzu_turi}
                      </Badge>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {slide.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {slide.description}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button variant="default" size="sm" className="flex-1">
                      <Play className="mr-2 h-4 w-4" />
                      Ko'rish
                    </Button>
                    {slide.file_path && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(slide.file_path!, '_blank')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Training Categories */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-8">Trening Kategoriyalari</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Kirish Darslari",
                description: "Yangi xodimlar uchun asosiy xavfsizlik qoidalari",
                count: filteredSlides.filter(s => s.marzu_turi?.includes('kirish')).length,
                color: "bg-blue-500"
              },
              {
                title: "Amaliy Mashg'ulotlar",
                description: "Amaliy ko'nikmalarni rivojlantirish uchun",
                count: filteredSlides.filter(s => s.marzu_turi?.includes('amaliy')).length,
                color: "bg-green-500"
              },
              {
                title: "Maxsus Treninglar",
                description: "Muayyan kasb va vazifalar uchun",
                count: filteredSlides.filter(s => s.marzu_turi?.includes('maxsus')).length,
                color: "bg-purple-500"
              }
            ].map((category, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className={`inline-flex p-3 rounded-full ${category.color} text-white mb-4`}>
                    <Presentation className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">{category.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                  <div className="text-2xl font-bold text-primary">{category.count}</div>
                  <div className="text-xs text-muted-foreground">slaydlar</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 text-center">
          <Card className="inline-block">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{filteredSlides.length}</div>
                  <div className="text-sm text-muted-foreground">Jami slaydlar</div>
                </div>
                <div className="h-8 w-px bg-border"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {new Set(filteredSlides.map(s => s.xavfsizlik_darajasi)).size}
                  </div>
                  <div className="text-sm text-muted-foreground">Xavfsizlik turlari</div>
                </div>
                <div className="h-8 w-px bg-border"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {new Set(filteredSlides.map(s => s.marzu_turi).filter(Boolean)).size}
                  </div>
                  <div className="text-sm text-muted-foreground">Ma'ruza turlari</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Slaydlar;
