import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: FilterOptions) => void;
  onSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  searchPlaceholder?: string;
  showFilters?: boolean;
  showSort?: boolean;
}

interface FilterOptions {
  category?: string;
  safetyLevel?: string;
  type?: string;
  dateRange?: string;
}

const categories = [
  { value: 'all', key: 'all' },
  { value: 'laws', key: 'laws' },
  { value: 'videos', key: 'videos' },
  { value: 'slides', key: 'slides' },
  { value: 'manuals', key: 'manuals' },
  { value: 'railway', key: 'railway' },
  { value: 'banners', key: 'banners' },
];

const safetyLevels = [
  { value: 'all', key: 'all' },
  { value: 'sanoat_xavfsizligi', key: 'industrial' },
  { value: 'mehnat_muhofazasi', key: 'labor' },
  { value: 'sogliqni_saqlash', key: 'health' },
  { value: 'yol_harakati', key: 'traffic' },
  { value: 'yongin_xavfsizligi', key: 'fire' },
  { value: 'elektr_xavfsizligi', key: 'electrical' },
];

const materialTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'document', label: 'Documents' },
  { value: 'video', label: 'Videos' },
  { value: 'slide', label: 'Slides' },
];

const sortOptions = [
  { value: 'created_at_desc', label: 'Newest First' },
  { value: 'created_at_asc', label: 'Oldest First' },
  { value: 'title_asc', label: 'Title A-Z' },
  { value: 'title_desc', label: 'Title Z-A' },
];

export function SearchAndFilter({
  onSearch,
  onFilter,
  onSort,
  searchPlaceholder,
  showFilters = true,
  showSort = true,
}: SearchAndFilterProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value === 'all' ? undefined : value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('_');
    onSort(sortBy, sortOrder as 'asc' | 'desc');
  };

  const clearFilters = () => {
    setFilters({});
    onFilter({});
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder || t('common.search')}
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* Filter and Sort Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {showFilters && (
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <Filter className="h-4 w-4 mr-2" />
                {t('common.filter')}
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{t('common.filter')}</h4>
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <X className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={filters.category || 'all'}
                    onValueChange={(value) => handleFilterChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.key === 'all' ? 'All Categories' : t(`categories.${category.key}.name`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Safety Level Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Safety Level</label>
                  <Select
                    value={filters.safetyLevel || 'all'}
                    onValueChange={(value) => handleFilterChange('safetyLevel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {safetyLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.key === 'all' ? 'All Levels' : t(`safety.${level.key}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Material Type Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Material Type</label>
                  <Select
                    value={filters.type || 'all'}
                    onValueChange={(value) => handleFilterChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {materialTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {showSort && (
          <Select onValueChange={handleSortChange} defaultValue="created_at_desc">
            <SelectTrigger className="w-[180px]">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-1">
            {filters.category && (
              <Badge variant="secondary" className="text-xs">
                {t(`categories.${filters.category}.name`)}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => handleFilterChange('category', 'all')}
                />
              </Badge>
            )}
            {filters.safetyLevel && (
              <Badge variant="secondary" className="text-xs">
                {t(`safety.${safetyLevels.find(l => l.value === filters.safetyLevel)?.key || ''}`)}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => handleFilterChange('safetyLevel', 'all')}
                />
              </Badge>
            )}
            {filters.type && (
              <Badge variant="secondary" className="text-xs">
                {materialTypes.find(t => t.value === filters.type)?.label}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => handleFilterChange('type', 'all')}
                />
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
