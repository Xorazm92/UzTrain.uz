import React, { useEffect } from 'react';

// Skip link component for keyboard navigation
export const SkipLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a
    href={href}
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
               bg-primary text-primary-foreground px-4 py-2 rounded-md z-50 
               transition-all duration-200 focus:outline-none focus:ring-2 
               focus:ring-ring focus:ring-offset-2"
  >
    {children}
  </a>
);

// Screen reader announcements
export const useAnnounceToScreenReader = () => {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return { announce };
};

// Focus management hook
export const useFocusManagement = () => {
  const focusElement = (selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.focus();
    }
  };

  const trapFocus = (containerRef: React.RefObject<HTMLElement>) => {
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      };

      container.addEventListener('keydown', handleTabKey);
      firstElement?.focus();

      return () => {
        container.removeEventListener('keydown', handleTabKey);
      };
    }, [containerRef]);
  };

  return { focusElement, trapFocus };
};

// ARIA live region for dynamic content updates
export const LiveRegion: React.FC<{
  message?: string;
  priority?: 'polite' | 'assertive';
  atomic?: boolean;
}> = ({ message, priority = 'polite', atomic = true }) => (
  <div
    aria-live={priority}
    aria-atomic={atomic}
    className="sr-only"
    role="status"
  >
    {message}
  </div>
);

// High contrast mode detection and styles
export const useHighContrastMode = () => {
  const [isHighContrast, setIsHighContrast] = React.useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setIsHighContrast(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isHighContrast;
};

// Reduced motion preference
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Accessible button component with loading state
export const AccessibleButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  'aria-label'?: string;
  'aria-describedby'?: string;
}> = ({
  children,
  onClick,
  loading = false,
  disabled = false,
  className = '',
  variant = 'primary',
  size = 'md',
  ...ariaProps
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
  };
  
  const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
      {...ariaProps}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      <span className={loading ? 'sr-only' : ''}>{children}</span>
      {loading && <span aria-hidden="true">Yuklanmoqda...</span>}
    </button>
  );
};

export default {
  SkipLink,
  LiveRegion,
  AccessibleButton,
  useAnnounceToScreenReader,
  useFocusManagement,
  useHighContrastMode,
  useReducedMotion
};