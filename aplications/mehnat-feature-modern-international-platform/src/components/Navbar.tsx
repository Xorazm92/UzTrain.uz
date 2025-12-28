import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BrandThemeToggle, BrandThemeToggleCompact } from '@/components/BrandThemeToggle';
import { NotificationCenter } from '@/components/NotificationCenter';
import { Menu, Train, Video, FileText, Presentation, ImageIcon, BookOpen, Settings, Shield } from 'lucide-react';

const navigationItems = [
  {
    key: 'laws',
    path: '/qonunlar',
    icon: FileText,
  },
  {
    key: 'rules',
    path: '/qoidalar',
    icon: Train,
  },
  {
    key: 'videos',
    path: '/video-materiallar',
    icon: Video,
  },
  {
    key: 'slides',
    path: '/slaydlar',
    icon: Presentation,
  },
  {
    key: 'railway',
    path: '/temir-yol',
    icon: Train,
  },
  {
    key: 'banners',
    path: '/bannerlar',
    icon: ImageIcon,
  },
  {
    key: 'manuals',
    path: '/kasb-yoriqnomalari',
    icon: BookOpen,
  }
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  const NavLinks = ({ mobile = false, onItemClick }: { mobile?: boolean; onItemClick?: () => void }) => (
    <nav className={`${mobile ? 'flex flex-col space-y-3' : 'hidden lg:flex items-center space-x-1'}`}>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`${
              mobile
                ? 'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-primary/10'
                : 'text-sm font-medium px-3 py-2 rounded-md transition-all duration-200 hover:bg-primary/10 hover:text-primary relative flex items-center space-x-1'
            } ${
              isActive
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={onItemClick}
          >
            {(mobile || !mobile) && <Icon className={`${mobile ? 'h-5 w-5' : 'h-4 w-4'}`} />}
            <span>{t(`nav.${item.key}`)}</span>
            {!mobile && isActive && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-railway-dark/95 backdrop-blur-md supports-[backdrop-filter]:bg-railway-dark/80">
      {/* Railway-style gradient top banner */}
      <div className="h-1 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500"></div>

      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img
                src="/logo-light.png"
                alt="UzTrain Logo"
                className="h-10 w-10 transition-all duration-300 group-hover:scale-110 dark:hidden"
              />
              <img
                src="/logo-dark.png"
                alt="UzTrain Logo"
                className="h-10 w-10 transition-all duration-300 group-hover:scale-110 hidden dark:block"
              />
              <div className="absolute -inset-1 bg-orange-400/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold railway-text-gradient">
                UzTrain
              </span>
              <span className="text-xs text-gray-400 hidden sm:block">
                Mehnat Muhofazasi
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="flex items-center space-x-6">
          <NavLinks />

          {/* Divider */}
          <div className="hidden lg:block h-6 w-px bg-border"></div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <NotificationCenter />
              <LanguageSwitcher />
              <BrandThemeToggle />
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-primary/10 hover:text-primary transition-all duration-200"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[320px] sm:w-[400px] bg-background/95 backdrop-blur-md">
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between pb-6 border-b">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Train className="h-6 w-6 text-brand-orange" />
                    <div className="absolute -inset-1 bg-brand-orange/20 rounded-full blur opacity-50"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold bg-gradient-to-r from-brand-orange via-brand-green to-brand-dark bg-clip-text text-transparent">
                      UzTrain
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Ta'lim Platformasi
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <NotificationCenter />
                  <LanguageSwitcher />
                  <ThemeToggle />
                </div>
              </div>

              {/* Mobile Navigation Links */}
              <div className="flex-1 py-6">
                <NavLinks mobile onItemClick={() => setIsOpen(false)} />
              </div>

              {/* Mobile Footer */}
              <div className="pt-6 border-t space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Tema</span>
                  <BrandThemeToggleCompact />
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}