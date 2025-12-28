import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  Download,
  Eye,
  Search,
  Play,
  FileImage,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileItem {
  id: string;
  name: string;
  type: 'pdf' | 'ppt' | 'doc' | 'video' | 'image';
  size: string;
  downloadCount: number;
  viewCount: number;
  uploadDate: string;
  description: string;
  category: string;
  url?: string;
  thumbnail?: string;
}

interface BrandFileViewerProps {
  files?: FileItem[];
  onFileSelect?: (file: FileItem) => void;
  onFileDownload?: (file: FileItem) => void;
  className?: string;
}

const defaultFiles: FileItem[] = [
  {
    id: '1',
    name: 'Temir yo\'l xavfsizligi qoidalari',
    type: 'pdf',
    size: '2.4 MB',
    downloadCount: 245,
    viewCount: 1250,
    uploadDate: '2024-01-15',
    description: 'Temir yo\'l transportida xavfsizlik choralari va qoidalar',
    category: 'Qonunlar',
  },
  {
    id: '2',
    name: 'Lokomotiv boshqaruv asoslari',
    type: 'ppt',
    size: '15.8 MB',
    downloadCount: 189,
    viewCount: 890,
    uploadDate: '2024-01-10',
    description: 'Lokomotiv boshqarish texnikasi va usullari',
    category: 'Slaydlar',
  },
];

const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf': return FileText;
    case 'ppt': return FileImage;
    case 'doc': return FileText;
    case 'video': return Play;
    case 'image': return FileImage;
    default: return FileText;
  }
};

const getFileColor = (type: string) => {
  switch (type) {
    case 'pdf': return 'text-brand-orange';
    case 'ppt': return 'text-brand-green';
    case 'doc': return 'text-brand-dark dark:text-white';
    case 'video': return 'text-purple-600';
    case 'image': return 'text-blue-600';
    default: return 'text-gray-600';
  }
};

export const BrandFileViewer: React.FC<BrandFileViewerProps> = ({
  files = defaultFiles,
  onFileSelect,
  onFileDownload,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Barchasi');

  const categories = ['Barchasi', 'Qonunlar', 'Qoidalar', 'Slaydlar', 'Video Materiallar'];

  const filteredFiles = files.filter(file =>
    (selectedCategory === 'Barchasi' || file.category === selectedCategory) &&
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileClick = (file: FileItem) => {
    onFileSelect?.(file);
  };

  const handleDownload = (file: FileItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    onFileDownload?.(file);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-brand-orange/20 via-brand-green/20 to-brand-dark/20 p-6">
        <div className="relative">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            📚 Fayl Ko'ruvchi
          </h2>
          <p className="text-muted-foreground">
            Professional ta'lim materiallari va hujjatlar
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Fayllarni qidiring..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFiles.map((file) => {
          const IconComponent = getFileIcon(file.type);
          const colorClass = getFileColor(file.type);

          return (
            <Card
              key={file.id}
              className="cursor-pointer group hover:shadow-lg transition-shadow"
              onClick={() => handleFileClick(file)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={cn("p-3 rounded-lg bg-muted/50", colorClass)}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {file.type.toUpperCase()}
                  </Badge>
                </div>
                <CardTitle className="text-lg line-clamp-2">
                  {file.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {file.description}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{file.size}</span>
                  <span>{file.category}</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{file.viewCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      <span>{file.downloadCount}</span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="default"
                    className="h-8 w-8 p-0"
                    onClick={(e) => handleDownload(file, e)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};