import { useEffect, useRef } from "react";

/**
 * Marks a container with `data-revealed` the first time it scrolls into view,
 * so its children can play an entrance animation the user actually sees.
 *
 * Without this the reveals are wasted: the sections below the hero are mounted
 * eagerly by Suspense, so a mount-triggered animation finishes long before the
 * user scrolls anywhere near it.
 *
 * The observer only ever *adds* the attribute. Content must render visible
 * without it — the animation is an enhancement, never a gate. If the observer
 * never fires, or IntersectionObserver is unavailable, the section reveals
 * immediately rather than staying hidden.
 */
export const useRevealOnScroll = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reveal = () => element.setAttribute("data-revealed", "");

    if (typeof IntersectionObserver === "undefined") {
      reveal();
      return;
    }

    // Already on screen (deep link, refresh mid-page): reveal without waiting
    // for a scroll that may never come.
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        clearTimeout(failsafe);
        reveal();
        observer.disconnect();
      },
      // Fire just before the section reaches the fold, so the animation is
      // underway by the time it is properly in view.
      { rootMargin: "0px 0px -80px 0px" },
    );

    // Belt and braces: if the observer is somehow never delivered, show the
    // content anyway. Losing the animation is the correct failure mode;
    // withholding the content is not.
    const failsafe = setTimeout(() => {
      reveal();
      observer.disconnect();
    }, 3000);

    observer.observe(element);
    return () => {
      clearTimeout(failsafe);
      observer.disconnect();
    };
  }, []);

  return ref;
};
