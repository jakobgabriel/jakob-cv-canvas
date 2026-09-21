import { useState, useEffect, useRef } from "react";

interface LazyImageProps {
  src: string;
  /** Candidate sources, e.g. "a.webp 288w, b.webp 432w". */
  srcSet?: string;
  /** Slot width per breakpoint, so the browser can pick from srcSet. */
  sizes?: string;
  alt: string;
  className?: string;
  width?: string | number;
  height?: string | number;
  loading?: "lazy" | "eager";
  decoding?: "async" | "sync" | "auto";
  onLoad?: () => void;
}

export const LazyImage = ({
  src,
  srcSet,
  sizes,
  alt,
  className = "",
  width,
  height,
  loading = "lazy",
  decoding = "async",
  onLoad,
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(loading === "eager");
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (loading === "eager") {
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
        rootMargin: "50px", // Start loading 50px before entering viewport
      },
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

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {!isLoaded && <div className="absolute inset-0 bg-muted/50 animate-pulse rounded-inherit" />}
      {isInView && (
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          className={`${className} transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          width={width}
          height={height}
          loading={loading}
          decoding={decoding}
          onLoad={handleLoad}
        />
      )}
    </div>
  );
};
