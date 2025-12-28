import { Card } from "@/components/ui/card";
import { KPIIndicator } from "@/lib/kpiData";
import { cn } from "@/lib/utils";

interface KPIIndicatorCardProps {
  indicator: KPIIndicator;
  score?: number;
  delay?: number;
}

export function KPIIndicatorCard({ indicator, score, delay = 0 }: KPIIndicatorCardProps) {
  const zone = score !== undefined 
    ? score >= 80 ? "green" : score >= 50 ? "yellow" : "red"
    : undefined;

  return (
    <Card 
      variant="glass" 
      className="p-4 animate-slide-up hover:scale-[1.02] transition-all duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl">{indicator.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-foreground truncate">{indicator.nameUz}</h4>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {indicator.weight}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{indicator.description}</p>
          
          {score !== undefined && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Ball</span>
                <span className={cn(
                  "font-bold",
                  zone === "green" && "text-zone-green",
                  zone === "yellow" && "text-zone-yellow",
                  zone === "red" && "text-zone-red"
                )}>
                  {score}
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-700",
                    zone === "green" && "gradient-green",
                    zone === "yellow" && "gradient-yellow",
                    zone === "red" && "gradient-red"
                  )}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
