import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CorsAlert } from '@/components/admin/CorsAlert';
import {
  LayoutDashboard,
  FileText,
  Video,
  Presentation,
  BookOpen,
  Train,
  ImageIcon,
  Menu,
  Settings,
  Users,
  BarChart3,
  Home,
  LogOut,
  Database
} from 'lucide-react';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Normativ Hujjatlar',
    href: '/admin/normativ-hujjatlar',
    icon: FileText,
  },
  {
    title: 'Video Materiallar',
    href: '/admin/video-materiallar',
    icon: Video,
  },
  {
    title: 'Slaydlar',
    href: '/admin/slaydlar',
    icon: Presentation,
  },
  {
    title: 'Kasb Yo\'riqnomalari',
    href: '/admin/kasb-yoriqnomalari',
    icon: BookOpen,
  },
  {
    title: 'Temir Yo\'l Hujjatlari',
    href: '/admin/temir-yol-hujjatlari',
    icon: Train,
  },
  {
    title: 'Bannerlar',
    href: '/admin/bannerlar',
    icon: ImageIcon,
  },
  {
    title: 'Qonunlar',
    href: '/admin/qonunlar',
    icon: FileText,
  },
  {
    title: 'Qarorlar',
    href: '/admin/qarorlar',
    icon: FileText,
  },
  {
    title: 'Qoidalar',
    href: '/admin/qoidalar',
    icon: FileText,
  },
  {
    title: 'Bucket Setup',
    href: '/admin/bucket-setup',
    icon: Database,
  },
];

const bottomItems = [
  {
    title: 'Statistika',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    title: 'Sozlamalar',
    href: '/admin/settings',
    icon: Settings,
  },
];

interface SidebarProps {
  className?: string;
}

function Sidebar({ className }: SidebarProps) {
  const location = useLocation();

  return (
    <div className={cn("pb-12 min-h-screen", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">A</span>
            </div>
            <h2 className="text-lg font-semibold tracking-tight">
              Admin Panel
            </h2>
          </div>
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Button
                key={item.href}
                variant={location.pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  location.pathname === item.href && "bg-muted"
                )}
                asChild
              >
                <Link to={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
        <div className="px-3 py-2">
          <div className="space-y-1">
            {bottomItems.map((item) => (
              <Button
                key={item.href}
                variant={location.pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  location.pathname === item.href && "bg-muted"
                )}
                asChild
              >
                <Link to={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-3 right-3">
        <div className="flex items-center space-x-2 p-2 rounded-lg bg-muted/50">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Users className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin</p>
            <p className="text-xs text-muted-foreground truncate">admin@safedocs.uz</p>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="ghost" className="w-full justify-start mt-2" asChild>
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Asosiy sahifaga qaytish
          </Link>
        </Button>
      </div>
    </div>
  );
}

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed top-4 left-4 z-40 md:hidden"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <ScrollArea className="h-full">
            <Sidebar />
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0">
        <ScrollArea className="flex-1">
          <Sidebar />
        </ScrollArea>
      </div>

      {/* Main content */}
      <div className="md:pl-72">
        <main className="p-4 md:p-8">
          <div className="mb-6">
            <CorsAlert />
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
