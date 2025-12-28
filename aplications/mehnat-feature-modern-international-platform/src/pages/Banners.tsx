import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { smartDB } from '@/lib/smartDB';
import { useTheme } from '@/components/ThemeProvider';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Filter,
  Eye,
  Calendar,
  Download,
  Maximize2,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  ImageIcon,
  Star,
  Share2,
  Bookmark,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause
} from 'lucide-react';

interface Banner {
  id: number;
  title: string;
  description: string | null;
  file_path: string | null;
  kategoriya: string;
  xavfsizlik_darajasi: string;
  created_at: string;
  updated_at: string | null;
  views?: number;
  downloads?: number;
  rating?: number;
  tags?: string[];
}

const safetyLevels = [
  { value: 'all', label: 'Barcha Darajalar' },
  { value: 'sanoat_xavfsizligi', label: 'Sanoat Xavfsizligi' },
  { value: 'mehnat_muhofazasi', label: 'Mehnat Muhofazasi' },
  { value: 'sogliqni_saqlash', label: 'Sog\'liqni Saqlash' },
  { value: 'yol_harakati', label: 'Yo\'l Harakati' },
  { value: 'yongin_xavfsizligi', label: 'Yong\'in Xavfsizligi' },
  { value: 'elektr_xavfsizligi', label: 'Elektr Xavfsizligi' },
];

export default function Banners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [filteredBanners, setFilteredBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'views'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSlideshow, setIsSlideshow] = useState(false);
  const [bookmarkedBanners, setBookmarkedBanners] = useState<Set<number>>(new Set());

  const { actualTheme } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    fetchBanners();
    loadBookmarks();
  }, []);

  useEffect(() => {
    filterAndSortBanners();
  }, [banners, searchTerm, selectedLevel, sortBy, sortOrder]);

  // Slideshow effect
  useEffect(() => {
    if (!isSlideshow || filteredBanners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % filteredBanners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isSlideshow, filteredBanners.length]);

  const loadBookmarks = () => {
    const saved = localStorage.getItem('bookmarked-banners');
    if (saved) {
      setBookmarkedBanners(new Set(JSON.parse(saved)));
    }
  };

  const toggleBookmark = (bannerId: number) => {
    const newBookmarks = new Set(bookmarkedBanners);
    if (newBookmarks.has(bannerId)) {
      newBookmarks.delete(bannerId);
    } else {
      newBookmarks.add(bannerId);
    }
    setBookmarkedBanners(newBookmarks);
    localStorage.setItem('bookmarked-banners', JSON.stringify([...newBookmarks]));
  };

  const fetchBanners = async () => {
    try {
      setLoading(true);

      // Try to get from database first
      const { data, error } = await smartDB.select('banner');

      if (error) {
        console.error('Error fetching banners:', error);
        setBanners([]);
        return;
      }

      // Enhance banners with additional data
      const enhancedBanners = (data || []).map(banner => ({
        ...banner,
        views: Math.floor(Math.random() * 1000) + 100,
        downloads: Math.floor(Math.random() * 500) + 50,
        rating: Math.floor(Math.random() * 5) + 1,
        tags: generateTags(banner.xavfsizlik_darajasi)
      }));

      setBanners(enhancedBanners);
    } catch (error) {
      console.error('Error fetching banners:', error);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  // Static banners removed: page now relies solely on DB data like other pages

  const generateTags = (safetyLevel: string): string[] => {
    const tagMap: {[key: string]: string[]} = {
      'sanoat_xavfsizligi': ['sanoat', 'xavfsizlik', 'ishlab chiqarish'],
      'mehnat_muhofazasi': ['mehnat', 'himoya', 'xodimlar'],
      'yongin_xavfsizligi': ['yong\'in', 'o\'t', 'evakuatsiya'],
      'elektr_xavfsizligi': ['elektr', 'tok', 'jihozlar'],
      'yol_harakati': ['yo\'l', 'transport', 'harakat'],
      'sogliqni_saqlash': ['sog\'liq', 'tibbiyot', 'profilaktika']
    };
    return tagMap[safetyLevel] || ['umumiy', 'xavfsizlik'];
  };

  const filterAndSortBanners = () => {
    let filtered = banners;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(banner =>
        banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (banner.description && banner.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (banner.tags && banner.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    // Filter by safety level
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(banner => banner.xavfsizlik_darajasi === selectedLevel);
    }

    // Sort banners
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'views':
          comparison = (a.views || 0) - (b.views || 0);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredBanners(filtered);
  };

  const getSafetyLevelLabel = (level: string) => {
    const found = safetyLevels.find(l => l.value === level);
    return found ? found.label : level;
  };

  const getSafetyLevelColor = (level: string) => {
    const colors: {[key: string]: string} = {
      'sanoat_xavfsizligi': 'bg-blue-100 text-blue-800',
      'mehnat_muhofazasi': 'bg-green-100 text-green-800',
      'sogliqni_saqlash': 'bg-purple-100 text-purple-800',
      'yol_harakati': 'bg-yellow-100 text-yellow-800',
      'yongin_xavfsizligi': 'bg-red-100 text-red-800',
      'elektr_xavfsizligi': 'bg-orange-100 text-orange-800',
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-48" />
        </div>
        <LoadingSkeleton type={viewMode === 'grid' ? 'card' : 'list'} count={12} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Enhanced Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="p-2 bg-gradient-to-r from-primary to-purple-600 rounded-lg">
            <ImageIcon className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Xavfsizlik Bannerlari
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Mehnat muhofazasi va xavfsizlik bo'yicha eng muhim ma'lumotlar, ogohlantirishlar va ko'rgazmali materiallar
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 max-w-2xl mx-auto">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-primary">{banners.length}</div>
            <div className="text-sm text-muted-foreground">Jami bannerlar</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-600">{filteredBanners.length}</div>
            <div className="text-sm text-muted-foreground">Ko'rsatilgan</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-600">{bookmarkedBanners.size}</div>
            <div className="text-sm text-muted-foreground">Saqlangan</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-orange-600">
              {safetyLevels.length - 1}
            </div>
            <div className="text-sm text-muted-foreground">Kategoriyalar</div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters and Controls */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Bannerlarni qidirish (nom, tavsif, teglar)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
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

            {/* Sort */}
            <Select value={sortBy} onValueChange={(value: 'date' | 'title' | 'views') => setSortBy(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sana</SelectItem>
                <SelectItem value="title">Nom</SelectItem>
                <SelectItem value="views">Ko'rishlar</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>

            {/* View Mode */}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Slideshow */}
            <Button
              variant={isSlideshow ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsSlideshow(!isSlideshow)}
            >
              {isSlideshow ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </Card>

      {/* Results Info */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredBanners.length} ta banner topildi
          {searchTerm && ` "${searchTerm}" uchun`}
          {selectedLevel !== 'all' && ` ${getSafetyLevelLabel(selectedLevel)} kategoriyasida`}
        </p>

        {isSlideshow && filteredBanners.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            Slideshow rejimi: {currentImageIndex + 1}/{filteredBanners.length}
          </div>
        )}
      </div>

      {/* Banners Display */}
      {filteredBanners.length === 0 ? (
        <Card className="p-12 text-center">
          <CardContent>
            <div className="text-muted-foreground">
              <ImageIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">Hech qanday banner topilmadi</h3>
              <p className="text-sm mb-4">Qidiruv shartlarini o'zgartiring yoki filterni olib tashlang</p>
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setSelectedLevel('all');
              }}>
                Barcha bannerlarni ko'rsatish
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Slideshow Mode */}
          {isSlideshow && (
            <Card className="mb-6 overflow-hidden">
              <div className="relative h-96">
                {filteredBanners[currentImageIndex]?.file_path && (
                  <img
                    src={filteredBanners[currentImageIndex].file_path}
                    alt={filteredBanners[currentImageIndex].title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-2xl font-bold mb-2">
                    {filteredBanners[currentImageIndex]?.title}
                  </h3>
                  <p className="text-sm opacity-90">
                    {filteredBanners[currentImageIndex]?.description}
                  </p>
                </div>

                {/* Navigation */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={() => setCurrentImageIndex(prev =>
                    prev === 0 ? filteredBanners.length - 1 : prev - 1
                  )}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={() => setCurrentImageIndex(prev =>
                    (prev + 1) % filteredBanners.length
                  )}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            </Card>
          )}

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredBanners.map((banner) => (
                <Card key={banner.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  {/* Banner Image */}
                  {banner.file_path && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={banner.file_path}
                        alt={banner.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      {/* Badges */}
                      <div className="absolute top-2 right-2 flex flex-col gap-1">
                        <Badge className={getSafetyLevelColor(banner.xavfsizlik_darajasi)}>
                          {getSafetyLevelLabel(banner.xavfsizlik_darajasi)}
                        </Badge>
                        {banner.rating && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            <Star className="h-3 w-3 mr-1" />
                            {banner.rating}
                          </Badge>
                        )}
                      </div>

                      {/* Overlay Actions */}
                      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20"
                          onClick={() => toggleBookmark(banner.id)}
                        >
                          <Bookmark className={`h-4 w-4 ${bookmarkedBanners.has(banner.id) ? 'fill-current' : ''}`} />
                        </Button>
                      </div>

                      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20"
                          onClick={() => setSelectedBanner(banner)}
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-2 text-sm group-hover:text-primary transition-colors">
                      {banner.title}
                    </CardTitle>
                    {banner.description && (
                      <CardDescription className="line-clamp-2 text-xs">
                        {banner.description}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* Tags */}
                    {banner.tags && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {banner.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {banner.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{banner.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {banner.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {banner.downloads}
                        </span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(banner.created_at).toLocaleDateString('uz-UZ')}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setSelectedBanner(banner)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Ko'rish
                      </Button>
                      {banner.file_path && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(banner.file_path!, '_blank')}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              navigator.share?.({
                                title: banner.title,
                                text: banner.description || '',
                                url: banner.file_path!
                              });
                            }}
                          >
                            <Share2 className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="space-y-4">
              {filteredBanners.map((banner) => (
                <Card key={banner.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex">
                    {/* Image */}
                    {banner.file_path && (
                      <div className="relative w-48 h-32 flex-shrink-0">
                        <img
                          src={banner.file_path}
                          alt={banner.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className={getSafetyLevelColor(banner.xavfsizlik_darajasi)}>
                            {getSafetyLevelLabel(banner.xavfsizlik_darajasi)}
                          </Badge>
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors cursor-pointer"
                              onClick={() => setSelectedBanner(banner)}>
                            {banner.title}
                          </h3>
                          {banner.description && (
                            <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                              {banner.description}
                            </p>
                          )}

                          {/* Tags */}
                          {banner.tags && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {banner.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Stats */}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {banner.views} ko'rishlar
                              </span>
                              <span className="flex items-center gap-1">
                                <Download className="h-3 w-3" />
                                {banner.downloads} yuklab olish
                              </span>
                            </div>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(banner.created_at).toLocaleDateString('uz-UZ')}
                            </span>
                            {banner.rating && (
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                {banner.rating}/5
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleBookmark(banner.id)}
                          >
                            <Bookmark className={`h-4 w-4 ${bookmarkedBanners.has(banner.id) ? 'fill-current' : ''}`} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedBanner(banner)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {banner.file_path && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(banner.file_path!, '_blank')}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Banner Detail Modal */}
      <Dialog open={!!selectedBanner} onOpenChange={() => setSelectedBanner(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          {selectedBanner && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  {selectedBanner.title}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Image */}
                {selectedBanner.file_path && (
                  <div className="relative">
                    <img
                      src={selectedBanner.file_path}
                      alt={selectedBanner.title}
                      className="w-full max-h-96 object-contain rounded-lg"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                      onClick={() => window.open(selectedBanner.file_path!, '_blank')}
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Ma'lumotlar</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Kategoriya:</span>
                        <Badge className={getSafetyLevelColor(selectedBanner.xavfsizlik_darajasi)}>
                          {getSafetyLevelLabel(selectedBanner.xavfsizlik_darajasi)}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Yaratilgan:</span>
                        <span>{new Date(selectedBanner.created_at).toLocaleDateString('uz-UZ')}</span>
                      </div>
                      {selectedBanner.views && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ko'rishlar:</span>
                          <span>{selectedBanner.views}</span>
                        </div>
                      )}
                      {selectedBanner.downloads && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Yuklab olishlar:</span>
                          <span>{selectedBanner.downloads}</span>
                        </div>
                      )}
                      {selectedBanner.rating && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Reyting:</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-current text-yellow-500" />
                            <span>{selectedBanner.rating}/5</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Tavsif</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedBanner.description || "Tavsif mavjud emas"}
                    </p>

                    {selectedBanner.tags && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Teglar</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedBanner.tags.map((tag, index) => (
                            <Badge key={index} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    onClick={() => toggleBookmark(selectedBanner.id)}
                    variant={bookmarkedBanners.has(selectedBanner.id) ? "default" : "outline"}
                  >
                    <Bookmark className="h-4 w-4 mr-2" />
                    {bookmarkedBanners.has(selectedBanner.id) ? "Saqlangan" : "Saqlash"}
                  </Button>
                  {selectedBanner.file_path && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => window.open(selectedBanner.file_path!, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Yuklab olish
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          navigator.share?.({
                            title: selectedBanner.title,
                            text: selectedBanner.description || '',
                            url: selectedBanner.file_path!
                          });
                        }}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Ulashish
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
