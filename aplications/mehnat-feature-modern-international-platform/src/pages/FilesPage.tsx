import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CategoryGrid } from '@/components/CategoryGrid';
import { FileViewer } from '@/components/FileViewer';
import { Pagination } from '@/components/Pagination';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { AdvancedSearch } from '@/components/AdvancedSearch';
import { Search, Filter, ArrowLeft, Grid, List, SortAsc, SortDesc, Settings } from 'lucide-react';
import { 
  getAllCategories, 
  getFilesByCategory, 
  searchFiles, 
  FileItem, 
  FileCategory 
} from '@/lib/fileService';

type ViewMode = 'categories' | 'files';
type SortBy = 'name' | 'size' | 'date' | 'type';
type SortOrder = 'asc' | 'desc';

export default function FilesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category'));
  const [viewMode, setViewMode] = useState<ViewMode>(selectedCategory ? 'files' : 'categories');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedFileType, setSelectedFileType] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [isGridView, setIsGridView] = useState(true);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const categories = getAllCategories();

  // Get files based on current state
  const allFiles = useMemo(() => {
    let files: FileItem[] = [];
    
    if (selectedCategory) {
      files = getFilesByCategory(selectedCategory);
    } else if (searchTerm) {
      files = searchFiles(searchTerm);
    } else {
      // Show all files from all categories
      files = categories.flatMap(cat => cat.files);
    }

    // Filter by file type
    if (selectedFileType !== 'all') {
      files = files.filter(file => file.type === selectedFileType);
    }

    // Sort files
    files.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
        case 'date':
          const dateA = a.lastModified || new Date(0);
          const dateB = b.lastModified || new Date(0);
          comparison = dateA.getTime() - dateB.getTime();
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return files;
  }, [selectedCategory, searchTerm, selectedFileType, sortBy, sortOrder, categories]);

  // Pagination
  const totalPages = Math.ceil(allFiles.length / itemsPerPage);
  const paginatedFiles = allFiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory) params.set('category', selectedCategory);
    setSearchParams(params);
  }, [searchTerm, selectedCategory, setSearchParams]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedFileType, sortBy, sortOrder]);

  const handleCategorySelect = (categoryKey: string) => {
    setSelectedCategory(categoryKey);
    setViewMode('files');
    setSearchTerm('');
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setViewMode('categories');
    setSearchTerm('');
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value) {
      setViewMode('files');
      setSelectedCategory(null);
    } else if (!selectedCategory) {
      setViewMode('categories');
    }
  };

  const getFileTypes = () => {
    const types = new Set(allFiles.map(file => file.type));
    return Array.from(types);
  };

  const getAvailableCategories = () => {
    const categories = new Set(allFiles.map(file => file.category));
    return Array.from(categories);
  };

  const getAvailableTags = () => {
    const tags = new Set(allFiles.flatMap(file => file.tags || []));
    return Array.from(tags);
  };

  const handleAdvancedSearch = (filters: any) => {
    // Advanced search logic will be implemented here
    console.log('Advanced search filters:', filters);
    setShowAdvancedSearch(false);
  };

  const handleResetSearch = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedFileType('all');
    setViewMode('categories');
  };

  const getCurrentCategoryName = () => {
    if (!selectedCategory) return null;
    const category = categories.find(cat => {
      const categoryKeys = {
        laws: "Qonunlar",
        jobManuals: "Kasb yo'riqnomalari", 
        decisions: "Qarorlar",
        presentations: "Prezentatsiyalar",
        railwayDocs: "Temir yo'l hujjatlari",
        banners: "Bannerlar"
      };
      return categoryKeys[selectedCategory as keyof typeof categoryKeys] === cat.name;
    });
    return category?.name;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {viewMode === 'files' && (
                <Button variant="ghost" onClick={handleBackToCategories}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kategoriyalarga qaytish
                </Button>
              )}
              <div>
                <h1 className="text-3xl font-bold">
                  {viewMode === 'categories' ? 'Fayl kategoriyalari' : 
                   getCurrentCategoryName() || 'Qidiruv natijalari'}
                </h1>
                <p className="text-muted-foreground">
                  {viewMode === 'categories' 
                    ? 'Kerakli kategoriyani tanlang'
                    : `${allFiles.length} ta fayl topildi`
                  }
                </p>
              </div>
            </div>
            
            {viewMode === 'files' && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                  className={showAdvancedSearch ? "bg-primary/10 border-primary/30" : ""}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  variant={isGridView ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsGridView(true)}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={!isGridView ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsGridView(false)}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Fayllarni qidiring..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {viewMode === 'files' && (
              <div className="flex gap-2">
                <Select value={selectedFileType} onValueChange={setSelectedFileType}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Turi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barchasi</SelectItem>
                    {getFileTypes().map(type => (
                      <SelectItem key={type} value={type}>
                        {type.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Saralash" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Nomi</SelectItem>
                    <SelectItem value="size">Hajmi</SelectItem>
                    <SelectItem value="date">Sanasi</SelectItem>
                    <SelectItem value="type">Turi</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Advanced Search */}
        {showAdvancedSearch && viewMode === 'files' && (
          <AdvancedSearch
            onSearch={handleAdvancedSearch}
            onReset={handleResetSearch}
            availableFileTypes={getFileTypes()}
            availableCategories={getAvailableCategories()}
            availableTags={getAvailableTags()}
          />
        )}

        {/* Content */}
        {loading ? (
          <LoadingSkeleton type="card" count={12} />
        ) : viewMode === 'categories' ? (
          <CategoryGrid
            categories={categories}
            onCategorySelect={handleCategorySelect}
          />
        ) : (
          <div className="space-y-6">
            {/* Files Grid/List */}
            {isGridView ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedFiles.map((file, index) => (
                  <FileViewer key={index} file={file} />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {paginatedFiles.map((file, index) => (
                  <FileViewer key={index} file={file} compact />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={allFiles.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            )}
          </div>
        )}

        {/* Empty State */}
        {viewMode === 'files' && allFiles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-lg font-semibold mb-2">Hech qanday fayl topilmadi</h3>
            <p className="text-muted-foreground mb-4">
              Qidiruv shartlaringizni o'zgartiring yoki boshqa kategoriyani tanlang
            </p>
            <Button onClick={handleBackToCategories}>
              Kategoriyalarga qaytish
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
