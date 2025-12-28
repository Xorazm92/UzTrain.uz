import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  FileText,
  Download,
  Eye,
  Share2,
  Heart,
  X,
  ExternalLink,
  Play,
  FileImage,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/ThemeProvider';

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

interface BrandFileModalProps {
  file: FileItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: (file: FileItem) => void;
  onShare?: (file: FileItem) => void;
  onFavorite?: (file: FileItem) => void;
}

export const BrandFileModal: React.FC<BrandFileModalProps> = ({
  file,
  isOpen,
  onClose,
  onDownload,
  onShare,
  onFavorite,
}) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(10); // Mock data
  const { actualTheme } = useTheme();

  useEffect(() => {
    if (isOpen && file) {
      // Reset viewer state when opening new file
      setZoom(100);
      setRotation(0);
      setCurrentPage(1);
    }
  }, [isOpen, file]);

  if (!file) return null;

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

  const IconComponent = getFileIcon(file.type);
  const colorClass = getFileColor(file.type);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  const renderFileViewer = () => {
    switch (file.type) {
      case 'pdf':
        return (
          <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            {/* PDF Viewer Controls */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <div className="bg-background/90 backdrop-blur-sm rounded-lg p-2 flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={handlePrevPage} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium px-2">
                  {currentPage} / {totalPages}
                </span>
                <Button size="sm" variant="ghost" onClick={handleNextPage} disabled={currentPage === totalPages}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              <div className="bg-background/90 backdrop-blur-sm rounded-lg p-2 flex items-center gap-1">
                <Button size="sm" variant="ghost" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium px-2">{zoom}%</span>
                <Button size="sm" variant="ghost" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="h-4 mx-1" />
                <Button size="sm" variant="ghost" onClick={handleRotate}>
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* PDF Content */}
            <div className="h-[600px] flex items-center justify-center p-8">
              <div 
                className="bg-white shadow-lg rounded-lg max-w-full max-h-full overflow-auto"
                style={{ 
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                  transformOrigin: 'center'
                }}
              >
                <div className="w-[595px] h-[842px] p-8 text-gray-800">
                  <h1 className="text-2xl font-bold mb-4 text-brand-orange">
                    {file.name}
                  </h1>
                  <p className="text-gray-600 mb-6">{file.description}</p>
                  <div className="space-y-4">
                    <p>Bu PDF faylning demo ko'rinishi. Haqiqiy PDF fayl yuklanganda, bu yerda fayl mazmuni ko'rsatiladi.</p>
                    <p>Sahifa {currentPage} / {totalPages}</p>
                    <div className="bg-gray-100 p-4 rounded">
                      <h3 className="font-semibold mb-2">Fayl ma'lumotlari:</h3>
                      <ul className="space-y-1 text-sm">
                        <li>Kategoriya: {file.category}</li>
                        <li>Hajmi: {file.size}</li>
                        <li>Yuklangan sana: {file.uploadDate}</li>
                        <li>Ko'rishlar: {file.viewCount}</li>
                        <li>Yuklab olishlar: {file.downloadCount}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'ppt':
        return (
          <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            {/* PowerPoint Viewer Controls */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <div className="bg-background/90 backdrop-blur-sm rounded-lg p-2 flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={handlePrevPage} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium px-2">
                  Slayd {currentPage} / {totalPages}
                </span>
                <Button size="sm" variant="ghost" onClick={handleNextPage} disabled={currentPage === totalPages}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="absolute top-4 right-4 z-10">
              <div className="bg-background/90 backdrop-blur-sm rounded-lg p-2 flex items-center gap-1">
                <Button size="sm" variant="ghost" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium px-2">{zoom}%</span>
                <Button size="sm" variant="ghost" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* PowerPoint Content */}
            <div className="h-[600px] flex items-center justify-center p-8">
              <div 
                className="bg-white shadow-lg rounded-lg max-w-full max-h-full overflow-auto"
                style={{ 
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: 'center'
                }}
              >
                <div className="w-[800px] h-[600px] bg-gradient-to-br from-brand-orange/10 to-brand-green/10 p-8 flex flex-col justify-center items-center text-center">
                  <h1 className="text-4xl font-bold mb-6 text-brand-orange">
                    {file.name}
                  </h1>
                  <p className="text-xl text-gray-600 mb-8">{file.description}</p>
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 max-w-md">
                    <h3 className="font-semibold mb-4 text-brand-green">Slayd {currentPage}</h3>
                    <p className="text-gray-700">
                      Bu PowerPoint taqdimotining demo ko'rinishi. Haqiqiy fayl yuklanganda, 
                      bu yerda slaydlar mazmuni ko'rsatiladi.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="relative bg-black rounded-lg overflow-hidden">
            <div className="h-[600px] flex items-center justify-center">
              <div className="text-center text-white">
                <Play className="h-16 w-16 mx-auto mb-4 text-brand-orange" />
                <h3 className="text-xl font-semibold mb-2">Video Player</h3>
                <p className="text-gray-300 mb-4">
                  Video fayl uchun player bu yerda ko'rsatiladi
                </p>
                <Button className="bg-brand-orange hover:bg-brand-orange/90">
                  <Play className="h-4 w-4 mr-2" />
                  Videoni Ijro Etish
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="h-[600px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="text-center">
              <IconComponent className={cn("h-16 w-16 mx-auto mb-4", colorClass)} />
              <h3 className="text-xl font-semibold mb-2">Fayl Ko'ruvchi</h3>
              <p className="text-muted-foreground">
                Bu fayl turi uchun ko'ruvchi mavjud emas
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className={cn("p-3 rounded-lg bg-muted/50", colorClass)}>
                <IconComponent className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-xl font-semibold line-clamp-2">
                  {file.name}
                </DialogTitle>
                <DialogDescription className="mt-2 line-clamp-2">
                  {file.description}
                </DialogDescription>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span>{file.size}</span>
                  <span>{file.category}</span>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{file.viewCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    <span>{file.downloadCount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onFavorite?.(file)}
                className="hover:bg-red-50 hover:text-red-600"
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onShare?.(file)}
                className="hover:bg-blue-50 hover:text-blue-600"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => window.open(file.url, '_blank')}
                className="hover:bg-green-50 hover:text-green-600"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="default"
                onClick={() => onDownload?.(file)}
                className="bg-gradient-primary hover:opacity-90"
              >
                <Download className="h-4 w-4 mr-2" />
                Yuklab olish
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* File Viewer */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6">
              {renderFileViewer()}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
