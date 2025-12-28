import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Presentation,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  AlertCircle,
  FileText,
  Loader2,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Settings,
  Eye,
  EyeOff,
  Monitor,
  Palette,
  Sun,
  Moon
} from 'lucide-react';
import { FileItem, formatFileSize } from '@/lib/fileService';
import { useTheme } from '@/components/ThemeProvider';
import { useBrandTheme } from '@/components/BrandThemeToggle';
import { cn } from '@/lib/utils';

interface PowerPointViewerProps {
  file: FileItem;
  className?: string;
  fullscreen?: boolean;
  onFullscreenToggle?: () => void;
}

export function PowerPointViewer({
  file,
  className = '',
  fullscreen = false,
  onFullscreenToggle
}: PowerPointViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [totalSlides] = useState(15); // Bu real ilovada dinamik bo'ladi
  const [scale, setScale] = useState(1.0);
  const [showControls, setShowControls] = useState(true);
  const [slideInput, setSlideInput] = useState('1');
  const [playbackSpeed, setPlaybackSpeed] = useState(3000); // 3 soniya
  const [presentationTheme, setPresentationTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { actualTheme } = useTheme();
  const { isDark, colors } = useBrandTheme();

  useEffect(() => {
    // Yuklash simulatsiyasi
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Avtomatik o'ynash
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide(prev => {
          if (prev >= totalSlides) {
            setIsPlaying(false);
            return 1; // Boshiga qaytish
          }
          return prev + 1;
        });
      }, playbackSpeed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, totalSlides]);

  const handleDownload = useCallback(() => {
    window.open(file.path, '_blank');
  }, [file.path]);

  const handleOpenOnline = useCallback(() => {
    const officeUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(window.location.origin + file.path)}`;
    window.open(officeUrl, '_blank');
  }, [file.path]);

  const goToPrevSlide = useCallback(() => {
    setCurrentSlide(prev => {
      const newSlide = Math.max(1, prev - 1);
      setSlideInput(newSlide.toString());
      return newSlide;
    });
  }, []);

  const goToNextSlide = useCallback(() => {
    setCurrentSlide(prev => {
      const newSlide = Math.min(totalSlides, prev + 1);
      setSlideInput(newSlide.toString());
      return newSlide;
    });
  }, [totalSlides]);

  const togglePlayback = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleSlideInputChange = (value: string) => {
    setSlideInput(value);
    const slideNum = parseInt(value);
    if (slideNum >= 1 && slideNum <= totalSlides) {
      setCurrentSlide(slideNum);
    }
  };

  const zoomIn = useCallback(() => {
    setScale(scale => Math.min(2, scale + 0.1));
  }, []);

  const zoomOut = useCallback(() => {
    setScale(scale => Math.max(0.5, scale - 0.1));
  }, []);

  const resetZoom = useCallback(() => {
    setScale(1.0);
  }, []);

  if (hasError) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="p-6">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 mx-auto text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Xatolik yuz berdi</h3>
            <p className="text-muted-foreground mb-4">
              Prezentatsiyani yuklashda xatolik yuz berdi
            </p>
            <Button variant="outline" onClick={handleDownload}>
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
            <Presentation className="h-5 w-5 text-orange-500" />
            <span className="truncate">{file.name}</span>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
              {file.type.toUpperCase()}
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
            {/* Slayd navigatsiyasi */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevSlide}
                disabled={currentSlide <= 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  value={slideInput}
                  onChange={(e) => handleSlideInputChange(e.target.value)}
                  className="w-16 h-8 text-center"
                  min={1}
                  max={totalSlides}
                />
                <span className="text-sm text-muted-foreground">/ {totalSlides}</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNextSlide}
                disabled={currentSlide >= totalSlides || isLoading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* O'ynash boshqaruvi */}
            <div className="flex items-center gap-2">
              <Button
                variant={isPlaying ? "default" : "outline"}
                size="sm"
                onClick={togglePlayback}
                disabled={isLoading}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>

              <div className="flex items-center gap-2 min-w-[100px]">
                <span className="text-xs text-muted-foreground">Tezlik:</span>
                <Slider
                  value={[playbackSpeed]}
                  onValueChange={([value]) => setPlaybackSpeed(value)}
                  min={1000}
                  max={5000}
                  step={500}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground">{playbackSpeed/1000}s</span>
              </div>
            </div>

            {/* Zoom boshqaruvi */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={zoomOut} disabled={scale <= 0.5}>
                <ZoomOut className="h-4 w-4" />
              </Button>

              <span className="text-sm font-medium min-w-[45px] text-center">
                {Math.round(scale * 100)}%
              </span>

              <Button variant="outline" size="sm" onClick={zoomIn} disabled={scale >= 2}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            {/* Qo'shimcha boshqaruvlar */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={resetZoom}>
                <Settings className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="sm" onClick={handleOpenOnline}>
                <Monitor className="h-4 w-4 mr-1" />
                Online
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
              <p className="text-sm text-muted-foreground">PowerPoint yuklanmoqda...</p>
            </div>
          </div>
        )}

        <div
          className="flex justify-center p-4 min-h-full"
          style={{
            backgroundColor: actualTheme === 'dark' ? '#1a1a1a' : '#f5f5f5',
            transform: `scale(${scale})`,
            transformOrigin: 'center top'
          }}
        >
          {/* PowerPoint Slide Simulation */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-border/20 w-full max-w-4xl aspect-[16/9] flex flex-col">
            {/* Slide Header */}
            <div className="p-6 border-b border-border/20 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Presentation className="h-8 w-8 text-orange-500" />
                  <div>
                    <h3 className="font-bold text-lg text-orange-700 dark:text-orange-300">
                      Slayd {currentSlide}: Mehnat Muhofazasi
                    </h3>
                    <p className="text-sm text-orange-600 dark:text-orange-400">
                      {file.name}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                  {currentSlide}/{totalSlides}
                </Badge>
              </div>
            </div>

            {/* Slide Content */}
            <div className="flex-1 p-8 flex flex-col justify-center items-center text-center">
              <div className="space-y-6 max-w-2xl">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="h-8 w-8 text-orange-500" />
                </div>

                <h2 className="text-3xl font-bold text-foreground">
                  {currentSlide === 1 && "Mehnat Muhofazasi Asoslari"}
                  {currentSlide === 2 && "Xavfsizlik Qoidalari"}
                  {currentSlide === 3 && "Shaxsiy Himoya Vositalari"}
                  {currentSlide === 4 && "Favqulodda Vaziyatlar"}
                  {currentSlide === 5 && "Birinchi Yordam"}
                  {currentSlide > 5 && `Slayd ${currentSlide} - Qo'shimcha Ma'lumotlar`}
                </h2>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  {currentSlide === 1 && "Mehnat muhofazasi - bu ishchilarning hayoti va sog'ligini saqlash uchun amalga oshiriladigan tadbirlar majmuidir."}
                  {currentSlide === 2 && "Ish joyida xavfsizlik qoidalariga rioya qilish har bir ishchining asosiy majburiyatidir."}
                  {currentSlide === 3 && "Shaxsiy himoya vositalari to'g'ri ishlatilishi baxtsiz hodisalarning oldini oladi."}
                  {currentSlide === 4 && "Favqulodda vaziyatlarda tez va to'g'ri harakat qilish muhim ahamiyatga ega."}
                  {currentSlide === 5 && "Birinchi yordam ko'rsatish har bir ishchining bilishi kerak bo'lgan asosiy ko'nikmalardir."}
                  {currentSlide > 5 && "Mehnat muhofazasi sohasidagi qo'shimcha ma'lumotlar va amaliy maslahatlar."}
                </p>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{Math.floor(Math.random() * 100) + 50}%</div>
                    <div className="text-sm text-muted-foreground">Xavfsizlik darajasi</div>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{Math.floor(Math.random() * 50) + 20}</div>
                    <div className="text-sm text-muted-foreground">Muhim qoidalar</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide Footer */}
            <div className="p-4 border-t border-border/20 bg-muted/30 rounded-b-lg">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>UzTrain - Mehnat Muhofazasi Ta'limi</span>
                <span>Slayd {currentSlide} / {totalSlides}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Fayl ma'lumotlari */}
      {!fullscreen && (
        <div className="px-4 py-2 border-t bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Hajmi: {formatFileSize(file.size)}</span>
            <span>Slaydlar: {totalSlides}</span>
            <span>Joriy: {currentSlide}</span>
            <span>Masshtab: {Math.round(scale * 100)}%</span>
          </div>
        </div>
      )}

      {/* Tags */}
      {file.tags && file.tags.length > 0 && !fullscreen && (
        <div className="px-4 py-2 border-t">
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
    </Card>
  );
}
