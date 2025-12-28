import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Search, Filter, X, Calendar, FileType, Tag, Folder } from 'lucide-react';
import { formatFileSize } from '@/lib/fileService';

interface SearchFilters {
  query: string;
  fileTypes: string[];
  categories: string[];
  tags: string[];
  sizeRange: [number, number];
  dateRange: {
    from?: Date;
    to?: Date;
  };
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onReset: () => void;
  availableFileTypes: string[];
  availableCategories: string[];
  availableTags: string[];
}

export function AdvancedSearch({
  onSearch,
  onReset,
  availableFileTypes,
  availableCategories,
  availableTags
}: AdvancedSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    fileTypes: [],
    categories: [],
    tags: [],
    sizeRange: [0, 100], // MB
    dateRange: {}
  });

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      query: '',
      fileTypes: [],
      categories: [],
      tags: [],
      sizeRange: [0, 100],
      dateRange: {}
    });
    onReset();
  };

  const toggleFileType = (type: string) => {
    setFilters(prev => ({
      ...prev,
      fileTypes: prev.fileTypes.includes(type)
        ? prev.fileTypes.filter(t => t !== type)
        : [...prev.fileTypes, type]
    }));
  };

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const hasActiveFilters = 
    filters.query ||
    filters.fileTypes.length > 0 ||
    filters.categories.length > 0 ||
    filters.tags.length > 0 ||
    filters.sizeRange[0] > 0 ||
    filters.sizeRange[1] < 100;

  return (
    <Card className="railway-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Kengaytirilgan qidiruv
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {filters.fileTypes.length + filters.categories.length + filters.tags.length} ta filter
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Basic Search */}
        <div className="space-y-2">
          <Label htmlFor="search-query">Qidiruv so'zi</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="search-query"
              placeholder="Fayl nomi, tavsif yoki teg bo'yicha qidiring..."
              value={filters.query}
              onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
              className="pl-10"
            />
          </div>
        </div>

        {isExpanded && (
          <>
            {/* File Types */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <FileType className="h-4 w-4" />
                Fayl turlari
              </Label>
              <div className="flex flex-wrap gap-2">
                {availableFileTypes.map(type => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={filters.fileTypes.includes(type)}
                      onCheckedChange={() => toggleFileType(type)}
                    />
                    <Label htmlFor={`type-${type}`} className="text-sm">
                      {type.toUpperCase()}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Folder className="h-4 w-4" />
                Kategoriyalar
              </Label>
              <div className="flex flex-wrap gap-2">
                {availableCategories.map(category => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cat-${category}`}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    />
                    <Label htmlFor={`cat-${category}`} className="text-sm">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Teglar
              </Label>
              <div className="flex flex-wrap gap-2">
                {availableTags.slice(0, 10).map(tag => (
                  <Badge
                    key={tag}
                    variant={filters.tags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/20"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* File Size Range */}
            <div className="space-y-2">
              <Label>Fayl hajmi (MB)</Label>
              <div className="px-3">
                <Slider
                  value={filters.sizeRange}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, sizeRange: value as [number, number] }))}
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>{formatFileSize(filters.sizeRange[0] * 1024 * 1024)}</span>
                  <span>{filters.sizeRange[1] >= 100 ? '100+ MB' : formatFileSize(filters.sizeRange[1] * 1024 * 1024)}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button onClick={handleSearch} className="flex-1 btn-railway">
            <Search className="h-4 w-4 mr-2" />
            Qidirish
          </Button>
          {hasActiveFilters && (
            <Button variant="outline" onClick={handleReset}>
              <X className="h-4 w-4 mr-2" />
              Tozalash
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="space-y-2 pt-2 border-t">
            <Label className="text-sm text-muted-foreground">Faol filterlar:</Label>
            <div className="flex flex-wrap gap-1">
              {filters.fileTypes.map(type => (
                <Badge key={type} variant="secondary" className="text-xs">
                  {type.toUpperCase()}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => toggleFileType(type)}
                  />
                </Badge>
              ))}
              {filters.categories.map(category => (
                <Badge key={category} variant="secondary" className="text-xs">
                  {category}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => toggleCategory(category)}
                  />
                </Badge>
              ))}
              {filters.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => toggleTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
