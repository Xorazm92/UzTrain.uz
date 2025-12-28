import { cn } from "@/lib/utils";

interface ZoneBadgeProps {
  zone: "green" | "yellow" | "red";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const zoneConfig = {
  green: {
    label: "Yashil",
    emoji: "🟢",
    className: "bg-zone-green/20 text-zone-green border-zone-green/30 glow-green",
  },
  yellow: {
    label: "Sariq",
    emoji: "🟡",
    className: "bg-zone-yellow/20 text-zone-yellow border-zone-yellow/30 glow-yellow",
  },
  red: {
    label: "Qizil",
    emoji: "🔴",
    className: "bg-zone-red/20 text-zone-red border-zone-red/30 glow-red",
  },
};

const sizeConfig = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-3 py-1",
  lg: "text-base px-4 py-1.5",
};

export function ZoneBadge({ zone, size = "md", showLabel = true }: ZoneBadgeProps) {
  const config = zoneConfig[zone];
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold transition-all duration-300",
        config.className,
        sizeConfig[size]
      )}
    >
      <span className="animate-pulse-glow">{config.emoji}</span>
      {showLabel && <span>{config.label} zona</span>}
    </span>
  );
}
