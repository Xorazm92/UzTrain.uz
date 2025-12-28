import React, { useState, useEffect, memo } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  className?: string;
  loading?: boolean;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = memo(({
  value,
  duration = 2000,
  suffix = '',
  className,
  loading = false
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (loading || value === 0) {
      setCount(0);
      return;
    }

    const startTime = Date.now();
    const startValue = 0;
    const endValue = value;

    const updateCount = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);

      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    const timer = setTimeout(() => {
      setIsVisible(true);
      requestAnimationFrame(updateCount);
    }, 300);

    return () => clearTimeout(timer);
  }, [value, duration, loading]);

  if (loading) {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="h-8 bg-gray-600 rounded w-16"></div>
      </div>
    );
  }

  return (
    <span 
      className={cn(
        "transition-all duration-500",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
        className
      )}
    >
      {count.toLocaleString()}{suffix}
    </span>
  );
});
