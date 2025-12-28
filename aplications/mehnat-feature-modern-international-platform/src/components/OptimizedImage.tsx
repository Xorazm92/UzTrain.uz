import React, { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  quality?: number;
  sizes?: string;
  className?: string;
  containerClassName?: string;
  lazy?: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  quality = 85,
  sizes,
  className,
  containerClassName,
  lazy = true,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setIsError(false);
  }, []);

  const handleError = useCallback(() => {
    setIsError(true);
    setIsLoaded(false);
  }, []);

  useEffect(() => {
    if (priority || !lazy) {
      setCurrentSrc(src);
    } else {
      // Lazy loading with Intersection Observer
      const img = new Image();
      img.onload = () => setCurrentSrc(src);
      img.onerror = handleError;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              img.src = src;
              observer.disconnect();
            }
          });
        },
        { threshold: 0.1, rootMargin: '50px' }
      );

      const element = document.getElementById(`img-${src.replace(/[^a-zA-Z0-9]/g, '')}`);
      if (element) {
        observer.observe(element);
      }

      return () => observer.disconnect();
    }
  }, [src, priority, lazy]);

  // Generate responsive image sources
  const generateSrcSet = (originalSrc: string) => {
    const widths = [320, 640, 768, 1024, 1280, 1536];
    return widths
      .map(w => `${originalSrc}?w=${w}&q=${quality} ${w}w`)
      .join(', ');
  };

  // Default placeholder for safety content
  const defaultPlaceholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PGNpcmNsZSBjeD0iMjAwIiBjeT0iMTUwIiByPSI0MCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjNlbSI+U2FmZURvY3M8L3RleHQ+PC9zdmc+';

  if (isError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 rounded",
          containerClassName
        )}
        style={{ width, height }}
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={cn("relative overflow-hidden", containerClassName)}
      style={{ width, height }}
      id={`img-${src.replace(/[^a-zA-Z0-9]/g, '')}`}
    >
      {/* Placeholder */}
      {placeholder === 'blur' && !isLoaded && (
        <img
          src={blurDataURL || defaultPlaceholder}
          alt=""
          className={cn(
            "absolute inset-0 w-full h-full object-cover filter blur-sm scale-110 transition-opacity duration-300",
            isLoaded ? 'opacity-0' : 'opacity-100'
          )}
          aria-hidden="true"
        />
      )}

      {/* Loading skeleton */}
      {!isLoaded && !currentSrc && (
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse",
            "bg-[length:200%_100%] animate-gradient-x"
          )}
        />
      )}

      {/* Main image */}
      {currentSrc && (
        <img
          src={currentSrc}
          srcSet={generateSrcSet(currentSrc)}
          sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          {...props}
        />
      )}

      {/* Quality badge for safety content */}
      {isLoaded && alt.toLowerCase().includes('xavfsizlik') && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
          ✓ Verified
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;