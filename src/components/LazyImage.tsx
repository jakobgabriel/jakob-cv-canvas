import { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: string | number;
  height?: string | number;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
  onLoad?: () => void;
}

export const LazyImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  decoding = 'async',
  onLoad,
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(loading === 'eager');
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (loading === 'eager') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [loading]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Generate WebP source path (assumes .webp version exists alongside original)
  const webpSrc = src.replace(/\.(jpe?g|png)$/i, '.webp');

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted/50 animate-pulse rounded-inherit" />
      )}
      {isInView && (
        <picture>
          {/* WebP source for modern browsers */}
          <source srcSet={webpSrc} type="image/webp" />
          {/* Fallback to original format */}
          <img
            src={src}
            alt={alt}
            className={`${className} transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            width={width}
            height={height}
            loading={loading}
            decoding={decoding}
            onLoad={handleLoad}
          />
        </picture>
      )}
    </div>
  );
};
