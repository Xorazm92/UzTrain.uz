import { Card } from "@/components/ui/card";
import { Company } from "@/lib/supabase";
import { Building2, Users, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompanyRankingCardProps {
  company: Company;
  rank: number;
  onClick?: () => void;
  delay?: number;
}

export function CompanyRankingCard({ company, rank, onClick, delay = 0 }: CompanyRankingCardProps) {
  // Safety checks for company data
  const safeCompany = {
    name: company?.name || 'N/A',
    level: company?.level || 'N/A',
    employees: company?.employees || 0,
    overall_index: company?.overall_index || 0,
    zone: company?.zone || 'red' as const
  };

  // Determine colors based on zone - YAXSHILANGAN RANGLAR
  const colors = safeCompany.zone === 'green'
    ? {
      bg: 'bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/30 dark:via-emerald-900/30 dark:to-teal-900/30',
      iconBg: 'bg-gradient-to-br from-green-500 to-emerald-600',
      progressBg: 'bg-gradient-to-r from-green-500 to-emerald-600',
      ringColor: 'text-green-600 dark:text-green-500',
      dotColor: 'bg-green-500',
      textColor: 'text-foreground'
    }
    : safeCompany.zone === 'yellow'
      ? {
        bg: 'bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-900/30 dark:via-amber-900/30 dark:to-orange-900/30',
        iconBg: 'bg-gradient-to-br from-yellow-500 to-amber-600',
        progressBg: 'bg-gradient-to-r from-yellow-500 to-amber-600',
        ringColor: 'text-yellow-600 dark:text-yellow-500',
        dotColor: 'bg-yellow-500',
        textColor: 'text-foreground'
      }
      : {
        bg: 'bg-gradient-to-r from-red-50 via-rose-50 to-pink-50 dark:from-red-900/30 dark:via-rose-900/30 dark:to-pink-900/30',
        iconBg: 'bg-gradient-to-br from-red-500 to-rose-600',
        progressBg: 'bg-gradient-to-r from-red-500 to-rose-600',
        ringColor: 'text-red-600 dark:text-red-500',
        dotColor: 'bg-red-500',
        textColor: 'text-foreground'
      };

  return (
    <Card
      className={cn(
        "p-6 cursor-pointer transition-all duration-300 hover:scale-[1.01] animate-slide-up border shadow-lg hover:shadow-xl dark:shadow-none",
        colors.bg,
        "border-border"
      )}
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
    >
      <div className="flex items-center gap-6">
        {/* Company Icon */}
        <div className={cn(
          "flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg dark:shadow-none",
          colors.iconBg
        )}>
          <Building2 className="w-8 h-8 text-white" />
        </div>

        {/* Company Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className={cn("text-lg font-bold truncate", colors.textColor)}>
              {safeCompany.name}
            </h3>
            <div className={cn("w-3 h-3 rounded-full shadow-sm", colors.dotColor)}></div>
          </div>

          <div className="flex items-center gap-6 text-sm mb-4">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-4 w-4 text-orange-600 dark:text-orange-500" />
              <span className="font-medium">{safeCompany.level}</span>
            </span>
            <span className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4 text-orange-600 dark:text-orange-500" />
              <span className="font-medium">{safeCompany.employees.toLocaleString()} xodim</span>
            </span>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-500 flex-shrink-0" />
            <div className="flex-1 h-3 bg-background/80 rounded-full overflow-hidden shadow-inner border border-border">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-1000 shadow-sm",
                  colors.progressBg
                )}
                style={{ width: `${Math.min(100, safeCompany.overall_index)}%` }}
              />
            </div>
            <span className="text-base font-bold text-foreground min-w-[60px] text-right">
              {safeCompany.overall_index.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Score Circle */}
        <div className="flex-shrink-0 relative">
          <svg className="w-24 h-24 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted/20"
            />
            {/* Progress circle */}
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - safeCompany.overall_index / 100)}`}
              className={cn("transition-all duration-1000", colors.ringColor)}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-muted-foreground">ball</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
