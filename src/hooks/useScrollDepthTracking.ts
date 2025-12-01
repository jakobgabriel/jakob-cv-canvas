import { useEffect, useRef } from 'react';

interface ScrollDepthOptions {
  onScrollDepth: (percentage: number) => void;
}

export const useScrollDepthTracking = (options: ScrollDepthOptions) => {
  const { onScrollDepth } = options;
  const milestones = useRef<Set<number>>(new Set());
  const maxScrollDepth = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      
      // Calculate scroll percentage
      const scrollableHeight = documentHeight - windowHeight;
      const scrollPercentage = Math.round((scrollTop / scrollableHeight) * 100);
      
      // Track maximum scroll depth
      if (scrollPercentage > maxScrollDepth.current) {
        maxScrollDepth.current = scrollPercentage;
      }
      
      // Track milestones (25%, 50%, 75%, 100%)
      const thresholds = [25, 50, 75, 100];
      thresholds.forEach((threshold) => {
        if (scrollPercentage >= threshold && !milestones.current.has(threshold)) {
          milestones.current.add(threshold);
          onScrollDepth(threshold);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onScrollDepth]);

  return { maxScrollDepth: maxScrollDepth.current };
};
