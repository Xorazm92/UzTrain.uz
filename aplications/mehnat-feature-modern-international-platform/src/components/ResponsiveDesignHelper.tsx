import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  Laptop,
  Settings,
  Eye,
  Ruler,
  Grid,
  Layout,
  Maximize2,
  Minimize2,
  RotateCcw,
  Zap
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { useBrandTheme } from '@/components/BrandThemeToggle';
import { cn } from '@/lib/utils';

interface ResponsiveBreakpoint {
  name: string;
  width: number;
  icon: React.ReactNode;
  description: string;
}

const breakpoints: ResponsiveBreakpoint[] = [
  {
    name: 'Mobile',
    width: 375,
    icon: <Smartphone className="h-4 w-4" />,
    description: 'Small mobile devices'
  },
  {
    name: 'Mobile L',
    width: 425,
    icon: <Smartphone className="h-4 w-4" />,
    description: 'Large mobile devices'
  },
  {
    name: 'Tablet',
    width: 768,
    icon: <Tablet className="h-4 w-4" />,
    description: 'Tablet devices'
  },
  {
    name: 'Laptop',
    width: 1024,
    icon: <Laptop className="h-4 w-4" />,
    description: 'Small laptops'
  },
  {
    name: 'Desktop',
    width: 1440,
    icon: <Monitor className="h-4 w-4" />,
    description: 'Desktop screens'
  }
];

interface ResponsiveDesignHelperProps {
  className?: string;
  showInProduction?: boolean;
}

export function ResponsiveDesignHelper({
  className,
  showInProduction = false
}: ResponsiveDesignHelperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>('auto');
  const [showGrid, setShowGrid] = useState(false);
  const [showRuler, setShowRuler] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const { actualTheme } = useTheme();
  const { isDark, colors } = useBrandTheme();

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  // Hide in production unless explicitly shown
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction && !showInProduction) {
    return null;
  }

  const getCurrentBreakpointInfo = () => {
    const width = windowSize.width;
    if (width < 640) return { name: 'Mobile', class: 'sm:hidden' };
    if (width < 768) return { name: 'Small', class: 'md:hidden' };
    if (width < 1024) return { name: 'Tablet', class: 'lg:hidden' };
    if (width < 1280) return { name: 'Laptop', class: 'xl:hidden' };
    return { name: 'Desktop', class: '2xl:hidden' };
  };

  const applyBreakpoint = (width: number) => {
    const container = document.querySelector('.responsive-container');
    if (container) {
      (container as HTMLElement).style.maxWidth = `${width}px`;
      (container as HTMLElement).style.margin = '0 auto';
      (container as HTMLElement).style.border = `2px solid ${colors.primary}`;
    }
  };

  const resetBreakpoint = () => {
    const container = document.querySelector('.responsive-container');
    if (container) {
      (container as HTMLElement).style.maxWidth = '';
      (container as HTMLElement).style.margin = '';
      (container as HTMLElement).style.border = '';
    }
    setCurrentBreakpoint('auto');
  };

  const toggleGrid = () => {
    setShowGrid(!showGrid);
    const body = document.body;
    if (!showGrid) {
      body.classList.add('show-grid');
    } else {
      body.classList.remove('show-grid');
    }
  };

  const currentInfo = getCurrentBreakpointInfo();

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-20 right-4 z-40 h-12 w-12 rounded-full shadow-lg",
          "hover:shadow-xl transition-all duration-200",
          "bg-brand-orange/10 border-brand-orange/30 hover:bg-brand-orange/20",
          className
        )}
        aria-label="Open responsive design helper"
      >
        <Layout className="h-6 w-6 text-brand-orange" />
      </Button>
    );
  }

  return (
    <Card className={cn(
      "fixed bottom-20 right-4 z-40 w-80 shadow-xl",
      "card-professional backdrop-blur-md",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layout className="h-5 w-5 text-brand-orange" />
            <CardTitle className="text-lg">Responsive Design</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            aria-label="Close responsive design helper"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Viewport Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Current Viewport</span>
            <Badge variant="secondary" className="bg-brand-orange/15 text-brand-orange">
              {currentInfo.name}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            {windowSize.width} × {windowSize.height}px
          </div>
        </div>

        <Separator />

        {/* Breakpoint Testing */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Ruler className="h-4 w-4 text-brand-green" />
            <span className="text-sm font-medium">Test Breakpoints</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {breakpoints.map((bp) => (
              <Button
                key={bp.name}
                variant={currentBreakpoint === bp.name ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setCurrentBreakpoint(bp.name);
                  applyBreakpoint(bp.width);
                }}
                className={cn(
                  "flex items-center space-x-1 text-xs",
                  currentBreakpoint === bp.name && "bg-brand-orange text-white"
                )}
              >
                {bp.icon}
                <span>{bp.name}</span>
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={resetBreakpoint}
            className="w-full text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset to Auto
          </Button>
        </div>

        <Separator />

        {/* Design Tools */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Grid className="h-4 w-4 text-brand-dark" />
            <span className="text-sm font-medium">Design Tools</span>
          </div>

          <div className="flex space-x-2">
            <Button
              variant={showGrid ? "default" : "outline"}
              size="sm"
              onClick={toggleGrid}
              className={cn(
                "flex-1 text-xs",
                showGrid && "bg-brand-green text-white"
              )}
            >
              <Grid className="h-3 w-3 mr-1" />
              Grid
            </Button>
            
            <Button
              variant={showRuler ? "default" : "outline"}
              size="sm"
              onClick={() => setShowRuler(!showRuler)}
              className={cn(
                "flex-1 text-xs",
                showRuler && "bg-brand-green text-white"
              )}
            >
              <Ruler className="h-3 w-3 mr-1" />
              Ruler
            </Button>
          </div>
        </div>

        {/* Quick Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <div>Theme: {actualTheme}</div>
          <div>Grid: {showGrid ? 'Visible' : 'Hidden'}</div>
          <div>Mode: {currentBreakpoint}</div>
        </div>
      </CardContent>
    </Card>
  );
}

// CSS for grid overlay
export const responsiveDesignStyles = `
  .show-grid::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      linear-gradient(rgba(255, 0, 0, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 0, 0, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
    pointer-events: none;
    z-index: 9999;
  }

  .responsive-container {
    transition: all 0.3s ease;
  }
`;
