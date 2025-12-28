import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  zone: "green" | "yellow" | "red";
  showValue?: boolean;
}

const zoneColors = {
  green: "stroke-zone-green",
  yellow: "stroke-zone-yellow",
  red: "stroke-zone-red",
};

export function ScoreRing({ 
  score, 
  size = 120, 
  strokeWidth = 8, 
  zone,
  showValue = true 
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-muted"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(
            zoneColors[zone],
            "transition-all duration-1000 ease-out drop-shadow-lg"
          )}
          style={{
            filter: `drop-shadow(0 0 10px hsl(var(--zone-${zone}-glow) / 0.6))`,
          }}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-foreground">{score.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">ball</span>
        </div>
      )}
    </div>
  );
}
