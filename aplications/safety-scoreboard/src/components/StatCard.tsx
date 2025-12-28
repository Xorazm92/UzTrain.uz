import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon | string;  // Only LucideIcon or string emoji
  trend?: {
    value: number;
    isPositive: boolean;
  } | null;
  variant?: "default" | "green" | "yellow" | "red" | "primary";
  delay?: number;
  className?: string;
}

const variantStyles = {
  default: "border-border bg-card hover:shadow-etsy-lg dark:hover:shadow-none",
  green: "border-green-200 dark:border-green-900 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 hover:shadow-etsy-lg dark:hover:shadow-none",
  yellow: "border-yellow-200 dark:border-yellow-900 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 hover:shadow-etsy-lg dark:hover:shadow-none",
  red: "border-red-200 dark:border-red-900 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 hover:shadow-etsy-lg dark:hover:shadow-none",
  primary: "border-orange-200 dark:border-orange-900 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 hover:shadow-etsy-lg dark:hover:shadow-none",
};

const iconVariantStyles = {
  default: "bg-muted text-muted-foreground",
  green: "gradient-green dark:bg-green-900 text-white dark:text-green-100",
  yellow: "gradient-yellow dark:bg-yellow-900 text-white dark:text-yellow-100",
  red: "gradient-red dark:bg-red-900 text-white dark:text-red-100",
  primary: "gradient-primary text-white",
};

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = "default",
  delay = 0,
  className
}: StatCardProps) {
  const isStringIcon = typeof icon === 'string';

  return (
    <Card
      className={cn(
        "p-6 animate-slide-up transition-all duration-300 hover-lift shadow-etsy dark:shadow-none",
        variantStyles[variant],
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              "inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full",
              trend.isPositive
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
            )}>
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-xl shadow-etsy dark:shadow-none flex items-center justify-center",
          iconVariantStyles[variant]
        )}>
          {isStringIcon ? (
            <span className="text-2xl">{icon}</span>
          ) : (
            (() => {
              const IconComponent = icon as LucideIcon;
              return <IconComponent className="h-6 w-6" />;
            })()
          )}
        </div>
      </div>
    </Card>
  );
}
