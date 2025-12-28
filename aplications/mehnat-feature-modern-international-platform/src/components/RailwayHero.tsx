import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  Zap,
  Shield,
  Train,
  Users,
  BookOpen,
  Award,
  TrendingUp,
  Sparkles,
  Play,
  ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useRealStats } from '@/hooks/useRealStats';
import { AnimatedCounter } from '@/components/AnimatedCounter';



export function RailwayHero() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const { stats: realStats, loading: statsLoading } = useRealStats();

  useEffect(() => {
    setIsVisible(true);
  }, []);



  const stats = [
    {
      icon: <Shield className="h-5 w-5" />,
      value: statsLoading ? 0 : realStats.safetyRules,
      label: "Xavfsizlik Qoidalari",
      color: "text-orange-400",
      loading: statsLoading
    },
    {
      icon: <Users className="h-5 w-5" />,
      value: statsLoading ? 0 : realStats.activeEmployees,
      label: "Faol Xodimlar",
      color: "text-blue-400",
      suffix: "+",
      loading: statsLoading
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      value: statsLoading ? 0 : realStats.totalMaterials,
      label: "Ta'lim Modullari",
      color: "text-cyan-400",
      loading: statsLoading
    },
    {
      icon: <Award className="h-5 w-5" />,
      value: statsLoading ? 0 : realStats.totalCertificates,
      label: "Sertifikat Olganlar",
      color: "text-green-400",
      suffix: "+",
      loading: statsLoading
    }
  ];

  return (
    <div className="railway-hero relative flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className={cn(
            "inline-flex items-center space-x-2 transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 hover:bg-orange-500/30">
              <Shield className="h-3 w-3 mr-1" />
              Xodimlar Xavfsizligi - Birinchi O'rinda
            </Badge>
          </div>

          {/* Main heading */}
          <div className={cn(
            "space-y-4 transition-all duration-1000 delay-200",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="railway-text-gradient">Xodimlar Uchun</span>
              <br />
              <span className="text-white">Mehnat Muhofazasi</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Temir yo'l xodimlari uchun xavfsizlik bilimi va ko'nikmalarini oshirish,
              professional rivojlanish va mehnat muhofazasi standartlarini o'rganish platformasi
            </p>
          </div>

          {/* CTA Buttons */}
          <div className={cn(
            "flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-400",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <Button
              asChild
              className="railway-button group text-lg px-8 py-4 h-auto"
            >
              <Link to="/qonunlar">
                <Shield className="mr-2 h-5 w-5" />
                Xavfsizlik Ta'limini Boshlash
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button
              variant="outline"
              className="railway-card border-white/20 text-white hover:bg-white/10 text-lg px-8 py-4 h-auto group"
            >
              <Play className="mr-2 h-5 w-5" />
              Xavfsizlik Videolarini Ko'rish
              <ChevronDown className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
            </Button>
          </div>

          {/* Stats */}
          <div className={cn(
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-16 transition-all duration-1000 delay-600",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="railway-card p-6 text-center group hover:scale-105 transition-all duration-300"
                style={{animationDelay: `${600 + index * 100}ms`}}
              >
                <div className={cn("flex items-center justify-center mb-3", stat.color)}>
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    loading={stat.loading}
                    className="railway-text-gradient"
                  />
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Features preview */}
          <div className={cn(
            "mt-20 transition-all duration-1000 delay-800",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <div className="railway-card p-8 max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto">
                    <Shield className="h-6 w-6 text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Xavfsizlik Standartlari</h3>
                  <p className="text-gray-400 text-sm">Temir yo'l xavfsizligi bo'yicha qoidalar va talablar</p>
                </div>

                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto">
                    <Users className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Xodimlar Ta'limi</h3>
                  <p className="text-gray-400 text-sm">Praktik mashg'ulotlar va malaka oshirish dasturlari</p>
                </div>

                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mx-auto">
                    <TrendingUp className="h-6 w-6 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Bilim Baholash</h3>
                  <p className="text-gray-400 text-sm">Xodimlar bilimini tekshirish va sertifikatlashtirish</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-6 w-6 text-white/60" />
      </div>
    </div>
  );
}
