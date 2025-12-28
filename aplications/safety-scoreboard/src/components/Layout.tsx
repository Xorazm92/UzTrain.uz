import { ReactNode } from "react";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50/30 via-amber-50/30 to-yellow-50/30 dark:from-background dark:via-background dark:to-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>
      <footer className="border-t border-orange-100 dark:border-orange-800 bg-white/80 dark:bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm font-semibold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                © 2025 Mehnat Muhofazasi Reyting Tizimi
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                ISO 45001, OSHA, ILO standartlariga asoslangan
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-semibold rounded-full">
                ISO 45001
              </span>
              <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-full">
                OSHA
              </span>
              <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-semibold rounded-full">
                ILO
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
