import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Train,
  Shield,
  BookOpen,
  Users,
  Award,
  ChevronRight,
  Play,
  Pause,
  ArrowRight,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  Sparkles,
  Zap
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { useBrandTheme } from '@/components/BrandThemeToggle';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  badge?: string;
  stats?: Array<{
    label: string;
    value: string;
    icon: React.ReactNode;
  }>;
}

const bannerSlides: BannerSlide[] = [
  {
    id: '1',
    title: 'Mehnat Muhofazasi Ta\'limi',
    subtitle: 'Professional xavfsizlik ta\'limi',
    description: 'Temir yo\'l transporti va sanoat korxonalarida mehnat muhofazasi bo\'yicha zamonaviy ta\'lim dasturlari',
    image: '/files/mmm-bannerlar/uzbekcha/sanoat-havfsizligi/Босим остидаги балонлар.jpg',
    ctaText: 'Kurslarni boshlash',
    ctaLink: '/qonunlar',
    badge: 'Yangi',
    stats: [
      { label: 'Qonunlar', value: '58', icon: <BookOpen className="h-4 w-4" /> },
      { label: 'Qoidalar', value: '20', icon: <Shield className="h-4 w-4" /> },
      { label: 'Bannerlar', value: '13', icon: <Award className="h-4 w-4" /> }
    ]
  },
  {
    id: '2',
    title: 'Temir Yo\'l Xavfsizligi',
    subtitle: 'Transport xavfsizligi standartlari',
    description: 'Temir yo\'l transportida xavfsizlik qoidalari va mehnat muhofazasi talablarini o\'rganish',
    image: '/files/mmm-bannerlar/uzbekcha/sanoat-havfsizligi/Кран.jpg',
    ctaText: 'Hujjatlarni ko\'rish',
    ctaLink: '/temir-yol',
    stats: [
      { label: 'Hujjatlar', value: '17', icon: <Shield className="h-4 w-4" /> },
      { label: 'Yo\'riqnomalar', value: '141', icon: <CheckCircle className="h-4 w-4" /> },
      { label: 'Yangilanish', value: 'Har oy', icon: <TrendingUp className="h-4 w-4" /> }
    ]
  },
  {
    id: '3',
    title: 'Interaktiv O\'quv Materiallari',
    subtitle: 'Zamonaviy ta\'lim texnologiyalari',
    description: 'Prezentatsiyalar, bannerlar va amaliy mashg\'ulotlar orqali samarali o\'qitish',
    image: '/files/mmm-bannerlar/uzbekcha/sanoat-havfsizligi/Юк илиш.jpg',
    ctaText: 'Materiallarni ko\'rish',
    ctaLink: '/bannerlar',
    badge: 'Mashhur',
    stats: [
      { label: 'Prezentatsiyalar', value: '41', icon: <Play className="h-4 w-4" /> },
      { label: 'Bannerlar', value: '13', icon: <Star className="h-4 w-4" /> },
      { label: 'Kategoriyalar', value: '7', icon: <Clock className="h-4 w-4" /> }
    ]
  }
];

export function EnhancedBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const { actualTheme } = useTheme();
  const { isDark, colors, gradients } = useBrandTheme();
  const { t } = useTranslation();

  // Avtomatik slayd almashtirish
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % bannerSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentBanner = bannerSlides[currentSlide];

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Enhanced Gradient Background with Brand Colors */}
      <div className={cn(
        "absolute inset-0 transition-all duration-500",
        isDark
          ? "bg-gradient-to-br from-brand-orange/20 via-brand-green/10 to-brand-dark/20"
          : "bg-gradient-to-br from-brand-orange/10 via-brand-green/5 to-brand-dark/10"
      )} />

      {/* Animated Background Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-brand-orange/20 rounded-full blur-xl animate-float" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-brand-green/20 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}} />
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-brand-dark/20 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}} />

      {/* Main Banner */}
      <Card className={cn(
        "relative border-0 shadow-2xl backdrop-blur-md transition-all duration-500",
        "card-professional hover-lift",
        isDark ? "bg-background/90" : "bg-background/95"
      )}>
        <CardContent className="p-0">
          <div className="grid lg:grid-cols-2 gap-0 min-h-[500px]">
            {/* Content Section */}
            <div className="flex flex-col justify-center p-8 lg:p-12 space-y-6">
              {/* Enhanced Badge */}
              {currentBanner.badge && (
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "bg-brand-orange/15 text-brand-orange border-brand-orange/30",
                      "animate-pulse shadow-sm backdrop-blur-sm",
                      "hover:bg-brand-orange/20 transition-all duration-300"
                    )}
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    {currentBanner.badge}
                  </Badge>
                  <div className="h-px flex-1 bg-gradient-to-r from-brand-orange/50 via-brand-green/30 to-transparent" />
                </div>
              )}

              {/* Enhanced Title with Brand Gradient */}
              <div className="space-y-3">
                <h1 className={cn(
                  "text-4xl lg:text-5xl font-bold leading-tight transition-all duration-500",
                  "bg-gradient-to-r from-brand-orange via-brand-green to-brand-dark bg-clip-text text-transparent",
                  "animate-brand-gradient"
                )}>
                  {currentBanner.title}
                </h1>
                <h2 className="text-xl lg:text-2xl text-muted-foreground font-medium">
                  {currentBanner.subtitle}
                </h2>
              </div>

              {/* Enhanced Description */}
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                {currentBanner.description}
              </p>

              {/* Enhanced Stats with Brand Colors */}
              {currentBanner.stats && (
                <div className="grid grid-cols-3 gap-4 py-4">
                  {currentBanner.stats.map((stat, index) => (
                    <div
                      key={index}
                      className={cn(
                        "text-center p-3 rounded-lg backdrop-blur-sm transition-all duration-300",
                        "card-professional hover-lift cursor-pointer group",
                        isDark ? "bg-muted/40" : "bg-muted/30"
                      )}
                    >
                      <div className={cn(
                        "flex items-center justify-center mb-1 transition-colors duration-300",
                        index === 0 ? "text-brand-orange" :
                        index === 1 ? "text-brand-green" : "text-brand-dark",
                        "group-hover:scale-110 transition-transform duration-300"
                      )}>
                        {stat.icon}
                      </div>
                      <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Enhanced CTA Buttons with Brand Styling */}
              <div className="flex items-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className={cn(
                    "bg-gradient-primary hover:opacity-90 text-white shadow-lg hover:shadow-xl",
                    "transition-all duration-300 group animate-brand-pulse",
                    "hover:scale-105 focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
                  )}
                >
                  <Link to={currentBanner.ctaLink}>
                    <Zap className="mr-2 h-4 w-4" />
                    {currentBanner.ctaText}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={togglePlayback}
                  className={cn(
                    "hover:bg-brand-orange/10 hover:border-brand-orange/30 hover:text-brand-orange",
                    "transition-all duration-300 backdrop-blur-sm"
                  )}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Image Section */}
            <div className="relative overflow-hidden lg:rounded-r-lg">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
                style={{
                  backgroundImage: `url(${currentBanner.image})`,
                  filter: actualTheme === 'dark' ? 'brightness(0.7)' : 'brightness(0.9)'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              
              {/* Floating Elements */}
              <div className="absolute top-6 right-6">
                <div className="bg-background/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                  <Train className="h-6 w-6 text-primary" />
                </div>
              </div>

              <div className="absolute bottom-6 left-6">
                <div className="bg-background/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">Sertifikatlangan</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
            {bannerSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-primary scale-125' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>

          {/* Progress Bar */}
          {isPlaying && (
            <div className="absolute bottom-0 left-0 h-1 bg-primary/20">
              <div 
                className="h-full bg-gradient-to-r from-primary to-purple-600 transition-all duration-100 ease-linear"
                style={{
                  width: `${((Date.now() % 5000) / 5000) * 100}%`
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Decorative Elements */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
      <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl" />
    </div>
  );
}
