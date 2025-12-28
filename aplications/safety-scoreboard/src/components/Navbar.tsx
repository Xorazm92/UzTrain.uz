import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  BarChart3,
  Settings,
  Shield,
  Menu,
  X,
  LogOut,
  User,
  Sparkles,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logout, getRoleLabel, getRoleColor } from "@/lib/auth/auth";
import { ModeToggle } from "@/components/mode-toggle";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/global-dashboard", label: "Global", icon: Activity },
  { to: "/companies", label: "Korxonalar", icon: Building2 },
  { to: "/kpi", label: "KPI Ko'rsatkichlar", icon: BarChart3 },
  { to: "/admin", label: "Admin", icon: Settings },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!currentUser) return null;

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-xl border-b border-orange-100 dark:border-orange-800 shadow-etsy">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
        {/* Logo - Etsy Style */}
        <NavLink to="/dashboard" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-xl flex items-center justify-center shadow-etsy group-hover:shadow-etsy-lg transition-all duration-300 group-hover:scale-105 overflow-hidden bg-white">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain p-1" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                MM Reyting
              </h1>
            </div>
            <p className="text-xs text-muted-foreground">Mehnat muhofazasi</p>
          </div>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                "text-muted-foreground hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
              )}
              activeClassName="text-orange-600 bg-orange-50 dark:bg-orange-900/20 shadow-sm"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User Info & Logout - Etsy Style */}
        <div className="hidden md:flex items-center gap-3">
          <ModeToggle />
          <NavLink to="/profile" className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10 border border-orange-100 dark:border-orange-800 hover:shadow-md transition-all cursor-pointer">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shadow-sm">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">{currentUser.displayName}</span>
              <span className={cn("text-xs px-2 py-0.5 rounded-full w-fit", getRoleColor(currentUser.role))}>
                {getRoleLabel(currentUser.role)}
              </span>
            </div>
          </NavLink>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Chiqish
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <nav className="md:hidden border-t border-orange-100 dark:border-orange-800 bg-background/95 backdrop-blur-xl animate-fade-in shadow-etsy">
          <div className="container mx-auto py-4 space-y-2 px-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  "text-muted-foreground hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                )}
                activeClassName="text-orange-600 bg-orange-50 dark:bg-orange-900/20 shadow-sm"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            ))}
            <div className="pt-4 border-t border-orange-100 dark:border-orange-800 mt-4 space-y-3">
              <NavLink to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10 border border-orange-100 dark:border-orange-800" onClick={() => setIsOpen(false)}>
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center shadow-sm">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-semibold text-foreground">{currentUser.displayName}</span>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full w-fit mt-1", getRoleColor(currentUser.role))}>
                    {getRoleLabel(currentUser.role)}
                  </span>
                </div>
              </NavLink>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-start text-muted-foreground hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Chiqish
              </Button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
