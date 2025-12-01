import { useEffect, useRef } from 'react';

interface SectionTrackingOptions {
  threshold?: number;
  onSectionView: (sectionId: string) => void;
}

export const useSectionTracking = (
  sectionIds: string[],
  options: SectionTrackingOptions
) => {
  const { threshold = 0.5, onSectionView } = options;
  const observedSections = useRef<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.id;
          
          // Track when section becomes visible (only once per session)
          if (entry.isIntersecting && !observedSections.current.has(sectionId)) {
            observedSections.current.add(sectionId);
            onSectionView(sectionId);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -10% 0px', // Trigger when section is 10% from bottom
      }
    );

    // Observe all sections
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionIds, threshold, onSectionView]);
};
