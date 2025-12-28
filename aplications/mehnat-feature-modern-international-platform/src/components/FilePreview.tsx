import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Image, Video, FileSpreadsheet, Presentation, Archive, AlertCircle, Download, Maximize2, ExternalLink } from 'lucide-react';
import { FileItem, formatFileSize, getFileIcon } from '@/lib/fileService';
import { AdvancedPDFViewer } from '@/components/AdvancedPDFViewer';
import { PowerPointViewer } from '@/components/PowerPointViewer';

interface FilePreviewProps {
  file: FileItem;
  className?: string;
  fullscreen?: boolean;
  onFullscreenToggle?: () => void;
}

export function FilePreview({
  file,
  className = '',
  fullscreen = false,
  onFullscreenToggle
}: FilePreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const getPreviewComponent = () => {
    const fileExtension = file.path.split('.').pop()?.toLowerCase();
    
    switch (file.type) {
      case 'pdf':
        return (
          <AdvancedPDFViewer
            file={file}
            className={className}
            fullscreen={fullscreen}
            onFullscreenToggle={onFullscreenToggle}
          />
        );
      
      case 'doc':
      case 'docx':
        return (
          <div className="w-full h-96 border rounded-lg overflow-hidden bg-muted/50">
            <div className="p-6 text-center">
              <FileText className="h-16 w-16 mx-auto text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Word hujjat</h3>
              <p className="text-muted-foreground mb-4">
                Bu Word hujjatini ko'rish uchun yuklab oling
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Fayl nomi:</strong> {file.name}</p>
                <p><strong>Hajmi:</strong> {formatFileSize(file.size)}</p>
                {file.description && (
                  <p><strong>Tavsif:</strong> {file.description}</p>
                )}
              </div>
            </div>
          </div>
        );
      
      case 'ppt':
      case 'pptx':
        return (
          <PowerPointViewer
            file={file}
            className={className}
            fullscreen={fullscreen}
            onFullscreenToggle={onFullscreenToggle}
          />
        );
      
      case 'xls':
      case 'xlsx':
        return (
          <div className="w-full h-96 border rounded-lg overflow-hidden bg-muted/50">
            <div className="p-6 text-center">
              <FileSpreadsheet className="h-16 w-16 mx-auto text-green-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Excel jadval</h3>
              <p className="text-muted-foreground mb-4">
                Bu Excel faylini ko'rish uchun yuklab oling
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Fayl nomi:</strong> {file.name}</p>
                <p><strong>Hajmi:</strong> {formatFileSize(file.size)}</p>
                {file.description && (
                  <p><strong>Tavsif:</strong> {file.description}</p>
                )}
              </div>
            </div>
          </div>
        );
      
      case 'zip':
        return (
          <div className="w-full h-96 border rounded-lg overflow-hidden bg-muted/50">
            <div className="p-6 text-center">
              <Archive className="h-16 w-16 mx-auto text-purple-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Arxiv fayl</h3>
              <p className="text-muted-foreground mb-4">
                Bu arxiv faylini ochish uchun yuklab oling
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Fayl nomi:</strong> {file.name}</p>
                <p><strong>Hajmi:</strong> {formatFileSize(file.size)}</p>
                {file.description && (
                  <p><strong>Tavsif:</strong> {file.description}</p>
                )}
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="w-full h-96 border rounded-lg overflow-hidden bg-muted/50">
            <div className="p-6 text-center">
              <FileText className="h-16 w-16 mx-auto text-gray-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Fayl preview</h3>
              <p className="text-muted-foreground mb-4">
                Bu fayl turini preview qilib bo'lmaydi
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Fayl nomi:</strong> {file.name}</p>
                <p><strong>Turi:</strong> {file.type.toUpperCase()}</p>
                <p><strong>Hajmi:</strong> {formatFileSize(file.size)}</p>
                {file.description && (
                  <p><strong>Tavsif:</strong> {file.description}</p>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  if (hasError) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="p-6">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 mx-auto text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Xatolik yuz berdi</h3>
            <p className="text-muted-foreground mb-4">
              Faylni yuklashda xatolik yuz berdi
            </p>
            <Button 
              variant="outline" 
              onClick={() => window.open(file.path, '_blank')}
            >
              Yangi oynada ochish
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">{getFileIcon(file.type)}</span>
            {file.name}
          </CardTitle>
          <Badge variant="outline">
            {file.type.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && file.type === 'pdf' && (
          <div className="w-full h-96 border rounded-lg overflow-hidden">
            <div className="p-6 space-y-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        )}
        
        <div className={isLoading && file.type === 'pdf' ? 'hidden' : ''}>
          {getPreviewComponent()}
        </div>
        
        {file.tags && file.tags.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Teglar:</h4>
            <div className="flex flex-wrap gap-1">
              {file.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
