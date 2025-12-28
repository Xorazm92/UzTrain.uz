import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Maximize2,
  Minimize2,
  Search,
  FileText,
  Loader2,
  AlertCircle,
  Settings,
  Eye,
  EyeOff,
  Sun,
  Moon
} from 'lucide-react';
import { FileItem, formatFileSize } from '@/lib/fileService';
import { useTheme } from '@/components/ThemeProvider';
import { useBrandTheme } from '@/components/BrandThemeToggle';
import { cn } from '@/lib/utils';

// PDF.js worker sozlamalari
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface AdvancedPDFViewerProps {
  file: FileItem;
  className?: string;
  fullscreen?: boolean;
  onFullscreenToggle?: () => void;
}

export function AdvancedPDFViewer({ 
  file, 
  className = '', 
  fullscreen = false,
  onFullscreenToggle 
}: AdvancedPDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [rotation, setRotation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showControls, setShowControls] = useState(true);
  const [pageInput, setPageInput] = useState('1');
  const [pdfTheme, setPdfTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const containerRef = useRef<HTMLDivElement>(null);
  const { actualTheme } = useTheme();
  const { isDark, colors } = useBrandTheme();

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
    setHasError(false);
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('PDF yuklashda xatolik:', error);
    setHasError(true);
    setIsLoading(false);
  }, []);

  const goToPrevPage = useCallback(() => {
    setPageNumber(page => {
      const newPage = Math.max(1, page - 1);
      setPageInput(newPage.toString());
      return newPage;
    });
  }, []);

  const goToNextPage = useCallback(() => {
    setPageNumber(page => {
      const newPage = Math.min(numPages, page + 1);
      setPageInput(newPage.toString());
      return newPage;
    });
  }, [numPages]);

  const handlePageInputChange = (value: string) => {
    setPageInput(value);
    const pageNum = parseInt(value);
    if (pageNum >= 1 && pageNum <= numPages) {
      setPageNumber(pageNum);
    }
  };

  const zoomIn = useCallback(() => {
    setScale(scale => Math.min(3, scale + 0.2));
  }, []);

  const zoomOut = useCallback(() => {
    setScale(scale => Math.max(0.5, scale - 0.2));
  }, []);

  const resetZoom = useCallback(() => {
    setScale(1.2);
  }, []);

  const rotate = useCallback(() => {
    setRotation(rotation => (rotation + 90) % 360);
  }, []);

  const handleDownload = useCallback(() => {
    window.open(file.path, '_blank');
  }, [file.path]);

  // Klaviatura boshqaruvi
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          goToPrevPage();
          break;
        case 'ArrowRight':
          event.preventDefault();
          goToNextPage();
          break;
        case '+':
        case '=':
          event.preventDefault();
          zoomIn();
          break;
        case '-':
          event.preventDefault();
          zoomOut();
          break;
        case '0':
          event.preventDefault();
          resetZoom();
          break;
        case 'r':
          event.preventDefault();
          rotate();
          break;
        case 'f':
          event.preventDefault();
          onFullscreenToggle?.();
          break;
      }
    };

    if (fullscreen) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [fullscreen, goToPrevPage, goToNextPage, zoomIn, zoomOut, resetZoom, rotate, onFullscreenToggle]);

  if (hasError) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="p-6">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 mx-auto text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">PDF yuklashda xatolik</h3>
            <p className="text-muted-foreground mb-4">
              Fayl buzilgan yoki mavjud emas
            </p>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Yuklab olish
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${fullscreen ? 'fixed inset-0 z-50 rounded-none' : ''} ${className}`}>
      <CardHeader className={`${fullscreen ? 'p-2' : 'p-4'} border-b`}>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-red-500" />
            <span className="truncate">{file.name}</span>
            <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
              PDF
            </Badge>
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowControls(!showControls)}
              className="hidden md:flex"
            >
              {showControls ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            
            {onFullscreenToggle && (
              <Button variant="ghost" size="sm" onClick={onFullscreenToggle}>
                {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>

        {/* Boshqaruv paneli */}
        {showControls && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {/* Sahifa navigatsiyasi */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevPage}
                disabled={pageNumber <= 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  value={pageInput}
                  onChange={(e) => handlePageInputChange(e.target.value)}
                  className="w-16 h-8 text-center"
                  min={1}
                  max={numPages}
                />
                <span className="text-sm text-muted-foreground">/ {numPages || '...'}</span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={pageNumber >= numPages || isLoading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Zoom boshqaruvi */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={zoomOut} disabled={scale <= 0.5}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-2 min-w-[120px]">
                <Slider
                  value={[scale]}
                  onValueChange={([value]) => setScale(value)}
                  min={0.5}
                  max={3}
                  step={0.1}
                  className="flex-1"
                />
                <span className="text-sm font-medium min-w-[45px] text-center">
                  {Math.round(scale * 100)}%
                </span>
              </div>
              
              <Button variant="outline" size="sm" onClick={zoomIn} disabled={scale >= 3}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            {/* Qo'shimcha boshqaruvlar */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={rotate}>
                <RotateCw className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="sm" onClick={resetZoom}>
                <Settings className="h-4 w-4" />
              </Button>
              
              <Button variant="default" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1" />
                Yuklab olish
              </Button>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0 relative overflow-auto" style={{ height: fullscreen ? 'calc(100vh - 120px)' : '600px' }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">PDF yuklanmoqda...</p>
            </div>
          </div>
        )}

        <div 
          ref={containerRef}
          className="flex justify-center p-4 min-h-full"
          style={{ 
            backgroundColor: actualTheme === 'dark' ? '#1a1a1a' : '#f5f5f5'
          }}
        >
          <Document
            file={file.path}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={null}
            error={null}
            className="max-w-full"
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              rotate={rotation}
              className="shadow-2xl border border-border/20 bg-white dark:bg-gray-900"
              loading={
                <div className="flex items-center justify-center h-96 bg-white dark:bg-gray-900 border border-border/20 shadow-lg">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              }
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </Document>
        </div>
      </CardContent>

      {/* Fayl ma'lumotlari */}
      {!fullscreen && (
        <div className="px-4 py-2 border-t bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Hajmi: {formatFileSize(file.size)}</span>
            <span>Sahifalar: {numPages}</span>
            <span>Masshtab: {Math.round(scale * 100)}%</span>
          </div>
        </div>
      )}
    </Card>
  );
}
