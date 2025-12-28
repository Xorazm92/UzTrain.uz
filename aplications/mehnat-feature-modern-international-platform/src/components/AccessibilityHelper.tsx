import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Accessibility,
  Eye,
  EyeOff,
  Type,
  Contrast,
  Volume2,
  VolumeX,
  Keyboard,
  MousePointer,
  Settings,
  Zap,
  Monitor,
  Smartphone,
  Tablet,
  X
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { useBrandTheme } from '@/components/BrandThemeToggle';
import { cn } from '@/lib/utils';

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  focusIndicators: boolean;
  responsiveMode: 'auto' | 'mobile' | 'tablet' | 'desktop';
  brandThemeSync: boolean;
}

export function AccessibilityHelper() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    focusIndicators: true,
    responsiveMode: 'auto',
    brandThemeSync: true,
  });
  const { actualTheme } = useTheme();
  const { isDark, colors } = useBrandTheme();

  useEffect(() => {
    // Load accessibility settings from localStorage
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Check for system preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setSettings(prev => ({ ...prev, reducedMotion: true }));
    }
  }, []);

  useEffect(() => {
    // Apply accessibility settings to document
    const root = document.documentElement;
    
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (settings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    if (settings.focusIndicators) {
      root.classList.add('enhanced-focus');
    } else {
      root.classList.remove('enhanced-focus');
    }

    // Save settings to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  const toggleSetting = (key: keyof AccessibilitySettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  const resetSettings = () => {
    const defaultSettings: AccessibilitySettings = {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: true,
      focusIndicators: true,
    };
    setSettings(defaultSettings);
    announceToScreenReader('Accessibility settings reset to default');
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        aria-label="Open accessibility settings"
      >
        <Accessibility className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 shadow-xl">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Accessibility className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Accessibility</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            aria-label="Close accessibility settings"
          >
            ×
          </Button>
        </div>

        <div className="space-y-3">
          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Contrast className="h-4 w-4" />
              <span className="text-sm">High Contrast</span>
            </div>
            <Button
              variant={settings.highContrast ? "default" : "outline"}
              size="sm"
              onClick={() => {
                toggleSetting('highContrast');
                announceToScreenReader(`High contrast ${!settings.highContrast ? 'enabled' : 'disabled'}`);
              }}
              aria-pressed={settings.highContrast}
            >
              {settings.highContrast ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
          </div>

          {/* Large Text */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Type className="h-4 w-4" />
              <span className="text-sm">Large Text</span>
            </div>
            <Button
              variant={settings.largeText ? "default" : "outline"}
              size="sm"
              onClick={() => {
                toggleSetting('largeText');
                announceToScreenReader(`Large text ${!settings.largeText ? 'enabled' : 'disabled'}`);
              }}
              aria-pressed={settings.largeText}
            >
              <Type className={`h-4 w-4 ${settings.largeText ? 'scale-125' : ''}`} />
            </Button>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MousePointer className="h-4 w-4" />
              <span className="text-sm">Reduced Motion</span>
            </div>
            <Button
              variant={settings.reducedMotion ? "default" : "outline"}
              size="sm"
              onClick={() => {
                toggleSetting('reducedMotion');
                announceToScreenReader(`Reduced motion ${!settings.reducedMotion ? 'enabled' : 'disabled'}`);
              }}
              aria-pressed={settings.reducedMotion}
            >
              {settings.reducedMotion ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>

          {/* Keyboard Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Keyboard className="h-4 w-4" />
              <span className="text-sm">Enhanced Focus</span>
            </div>
            <Button
              variant={settings.focusIndicators ? "default" : "outline"}
              size="sm"
              onClick={() => {
                toggleSetting('focusIndicators');
                announceToScreenReader(`Enhanced focus indicators ${!settings.focusIndicators ? 'enabled' : 'disabled'}`);
              }}
              aria-pressed={settings.focusIndicators}
            >
              <Keyboard className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              Theme: {actualTheme}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetSettings}
              className="text-xs"
            >
              <Settings className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>
        </div>

        {/* Screen reader announcement area */}
        <div className="sr-only" aria-live="polite" aria-atomic="true"></div>
      </CardContent>
    </Card>
  );
}

// CSS classes to be added to global styles
export const accessibilityStyles = `
  .high-contrast {
    --background: 0 0% 0%;
    --foreground: 0 0% 100%;
    --card: 0 0% 10%;
    --card-foreground: 0 0% 100%;
    --border: 0 0% 30%;
    --primary: 210 100% 70%;
  }

  .large-text {
    font-size: 1.125rem;
  }

  .large-text h1 { font-size: 2.5rem; }
  .large-text h2 { font-size: 2rem; }
  .large-text h3 { font-size: 1.75rem; }
  .large-text h4 { font-size: 1.5rem; }
  .large-text .text-sm { font-size: 1rem; }
  .large-text .text-xs { font-size: 0.875rem; }

  .reduced-motion * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .enhanced-focus *:focus-visible {
    outline: 3px solid hsl(var(--primary));
    outline-offset: 2px;
    border-radius: 4px;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;
