import { useEffect, useState } from 'react';

export const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = (window.scrollY / totalHeight) * 100;
      setProgress(scrollProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-border/20">
      <div
        className="h-full w-full origin-left bg-gradient-to-r from-primary via-primary-glow to-primary shadow-glow"
        style={{
          transform: `scaleX(${Math.min(Math.max(progress, 0), 100) / 100})`,
          transition: 'transform 0.15s cubic-bezier(0.23, 1, 0.32, 1)',
        }}
      />
    </div>
  );
};
