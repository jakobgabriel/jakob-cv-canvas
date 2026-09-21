import { useEffect, useState } from "react";

export const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      // A page shorter than the viewport has nowhere to scroll — guard the
      // divide so the bar does not render NaN.
      setProgress(totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0);
    };

    // One layout read per frame rather than one per scroll event.
    const handleScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-border/20">
      <div
        className="h-full w-full origin-left bg-gradient-to-r from-primary via-primary-glow to-primary shadow-glow"
        style={{
          transform: `scaleX(${Math.min(Math.max(progress, 0), 100) / 100})`,
          transition: "transform 0.15s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      />
    </div>
  );
};
