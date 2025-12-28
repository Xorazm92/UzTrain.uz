import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';

interface FilterBarProps {
  onSearch: (query: string) => void;
  onFilterBySafety: (level: string | null) => void;
  onClearFilters: () => void;
  searchQuery: string;
  selectedSafetyLevel: string | null;
  totalCount: number;
  filteredCount: number;
}

const safetyLevels = [
  { value: 'sanoat_xavfsizligi', label: 'Sanoat xavfsizligi' },
  { value: 'mehnat_muhofazasi', label: 'Mehnat muhofazasi' },
  { value: 'sogliqni_saqlash', label: 'Sog\'liqni saqlash' },
  { value: 'yol_harakati', label: 'Yo\'l harakati' },
  { value: 'yongin_xavfsizligi', label: 'Yong\'in xavfsizligi' },
  { value: 'elektr_xavfsizligi', label: 'Elektr xavfsizligi' }
];

export function FilterBar({
  onSearch,
  onFilterBySafety,
  onClearFilters,
  searchQuery,
  selectedSafetyLevel,
  totalCount,
  filteredCount
}: FilterBarProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearchQuery);
  };

  const hasActiveFilters = searchQuery || selectedSafetyLevel;

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Materiallarni qidiring..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>
        
        <div className="flex gap-2">
          <Select value={selectedSafetyLevel || ''} onValueChange={(value) => onFilterBySafety(value || null)}>
            <SelectTrigger className="w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Xavfsizlik darajasi" />
            </SelectTrigger>
            <SelectContent>
              {safetyLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="outline" onClick={onClearFilters} size="icon">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Results Summary and Active Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="text-sm text-muted-foreground">
          {hasActiveFilters ? (
            <span>
              {filteredCount} ta material topildi (jami {totalCount} tadan)
            </span>
          ) : (
            <span>Jami {totalCount} ta material</span>
          )}
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Qidiruv: "{searchQuery}"
                <button
                  onClick={() => onSearch('')}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedSafetyLevel && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {safetyLevels.find(l => l.value === selectedSafetyLevel)?.label}
                <button
                  onClick={() => onFilterBySafety(null)}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}