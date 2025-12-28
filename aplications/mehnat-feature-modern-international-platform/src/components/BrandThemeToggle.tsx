import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';

interface BrandThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const BrandThemeToggle: React.FC<BrandThemeToggleProps> = ({
  className,
  showLabel = false,
}) => {
  const { theme, setTheme, actualTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { value: 'light', label: 'Kunduzgi', icon: Sun },
    { value: 'dark', label: 'Tungi', icon: Moon },
    { value: 'system', label: 'Tizim', icon: Monitor },
  ];

  const currentTheme = themes.find(t => t.value === theme) || themes[0];
  const CurrentIcon = currentTheme.icon;

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as any);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      {/* Main Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative h-10 w-10 rounded-full p-0 transition-all duration-300",
          "hover:bg-brand-orange/10 hover:scale-110",
          "focus:ring-2 focus:ring-brand-orange focus:ring-offset-2",
          actualTheme === 'dark' && "hover:bg-brand-orange/20"
        )}
        aria-label="Theme toggle"
      >
        <div className="relative">
          {/* Animated Background */}
          <div className={cn(
            "absolute inset-0 rounded-full transition-all duration-500",
            actualTheme === 'dark' 
              ? "bg-gradient-to-br from-slate-800 to-slate-900" 
              : "bg-gradient-to-br from-orange-100 to-yellow-100"
          )} />
          
          {/* Icon */}
          <CurrentIcon className={cn(
            "relative h-5 w-5 transition-all duration-300",
            actualTheme === 'dark' ? "text-yellow-400" : "text-brand-orange",
            "drop-shadow-sm"
          )} />
          
          {/* Glow Effect */}
          <div className={cn(
            "absolute inset-0 rounded-full opacity-0 transition-opacity duration-300",
            "group-hover:opacity-100",
            actualTheme === 'dark' 
              ? "shadow-lg shadow-yellow-400/25" 
              : "shadow-lg shadow-brand-orange/25"
          )} />
        </div>
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className={cn(
            "absolute right-0 top-12 z-50 min-w-[160px]",
            "bg-background/95 backdrop-blur-md border border-border/50",
            "rounded-xl shadow-xl p-2",
            "animate-in slide-in-from-top-2 duration-200"
          )}>
            {themes.map((themeOption) => {
              const Icon = themeOption.icon;
              const isSelected = theme === themeOption.value;
              
              return (
                <button
                  key={themeOption.value}
                  onClick={() => handleThemeChange(themeOption.value)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
                    "text-sm font-medium transition-all duration-200",
                    "hover:bg-brand-orange/10 hover:text-brand-orange",
                    isSelected && "bg-brand-orange/15 text-brand-orange",
                    isSelected && "shadow-sm"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{themeOption.label}</span>
                  {isSelected && (
                    <div className="ml-auto w-2 h-2 bg-brand-orange rounded-full" />
                  )}
                </button>
              );
            })}
            
            {/* Theme Preview */}
            <div className="mt-2 pt-2 border-t border-border/50">
              <div className="px-3 py-2">
                <div className="text-xs text-muted-foreground mb-2">
                  Joriy tema: {actualTheme === 'dark' ? 'Tungi' : 'Kunduzgi'}
                </div>
                <div className="flex gap-2">
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2",
                    actualTheme === 'dark' 
                      ? "bg-slate-800 border-slate-600" 
                      : "bg-white border-gray-300"
                  )} />
                  <div className="w-4 h-4 rounded-full bg-brand-orange" />
                  <div className="w-4 h-4 rounded-full bg-brand-green" />
                  <div className="w-4 h-4 rounded-full bg-brand-dark" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Label */}
      {showLabel && (
        <span className="ml-2 text-sm font-medium text-muted-foreground">
          {currentTheme.label}
        </span>
      )}
    </div>
  );
};

// Compact version for mobile
export const BrandThemeToggleCompact: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, setTheme, actualTheme } = useTheme();

  const cycleTheme = () => {
    const themes = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex] as any);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={cycleTheme}
      className={cn(
        "h-9 w-9 rounded-full p-0 transition-all duration-300",
        "hover:bg-brand-orange/10 hover:scale-110",
        "focus:ring-2 focus:ring-brand-orange focus:ring-offset-2",
        className
      )}
      aria-label="Toggle theme"
    >
      <div className="relative">
        {actualTheme === 'dark' ? (
          <Moon className="h-4 w-4 text-yellow-400 transition-transform duration-300 rotate-0" />
        ) : (
          <Sun className="h-4 w-4 text-brand-orange transition-transform duration-300 rotate-0" />
        )}
      </div>
    </Button>
  );
};

// Hook for using theme colors in components
export const useBrandTheme = () => {
  const { actualTheme } = useTheme();
  
  return {
    isDark: actualTheme === 'dark',
    colors: {
      primary: actualTheme === 'dark' ? 'hsl(14 73% 65%)' : 'hsl(14 73% 58%)',
      secondary: actualTheme === 'dark' ? 'hsl(142 45% 58%)' : 'hsl(142 45% 52%)',
      accent: actualTheme === 'dark' ? 'hsl(0 0% 85%)' : 'hsl(0 0% 24%)',
      background: actualTheme === 'dark' ? 'hsl(240 10% 3.9%)' : 'hsl(0 0% 100%)',
      foreground: actualTheme === 'dark' ? 'hsl(0 0% 98%)' : 'hsl(240 10% 3.9%)',
    },
    gradients: {
      primary: actualTheme === 'dark' 
        ? 'linear-gradient(135deg, hsl(14 73% 65%), hsl(142 45% 58%))' 
        : 'linear-gradient(135deg, hsl(14 73% 58%), hsl(142 45% 52%))',
      hero: actualTheme === 'dark'
        ? 'linear-gradient(135deg, hsl(14 73% 65%), hsl(0 0% 15%))'
        : 'linear-gradient(135deg, hsl(14 73% 58%), hsl(0 0% 24%))',
      brand: actualTheme === 'dark'
        ? 'linear-gradient(135deg, hsl(14 73% 65%) 0%, hsl(142 45% 58%) 50%, hsl(0 0% 15%) 100%)'
        : 'linear-gradient(135deg, hsl(14 73% 58%) 0%, hsl(142 45% 52%) 50%, hsl(0 0% 24%) 100%)',
    }
  };
};
