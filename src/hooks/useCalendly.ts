import { useEffect, useCallback } from 'react';

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
      initBadgeWidget: (options: {
        url: string;
        text: string;
        color: string;
        textColor: string;
        branding?: boolean;
      }) => void;
    };
  }
}

const CALENDLY_URL = 'https://calendly.com/jakob-gabriel/30min';

// Brand colors (hex without the leading '#') so the Calendly widget matches the
// app's teal theme instead of Calendly's default blue. The primary/accent teal
// mirrors `--primary` in src/index.css for each theme.
const CALENDLY_COLORS = {
  light: { primary_color: '246b65', text_color: '1a1a1a', background_color: 'ffffff' },
  dark: { primary_color: '6ecfc6', text_color: 'ffffff', background_color: '1a1a1a' },
} as const;

/**
 * Builds the Calendly URL with color query params matching the current theme.
 * `next-themes` is configured with `attribute="class"` (see src/App.tsx), so the
 * active theme is read from the `dark` class on the document element.
 */
const buildCalendlyUrl = () => {
  const isDark =
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark');
  const params = new URLSearchParams(CALENDLY_COLORS[isDark ? 'dark' : 'light']);
  return `${CALENDLY_URL}?${params.toString()}`;
};

export const useCalendly = () => {
  useEffect(() => {
    // Load Calendly CSS
    if (!document.querySelector('link[href*="calendly"]')) {
      const link = document.createElement('link');
      link.href = 'https://assets.calendly.com/assets/external/widget.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }

    // Load Calendly JS
    if (!document.querySelector('script[src*="calendly"]')) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const openCalendly = useCallback(() => {
    // Resolve the themed URL at click time so it reflects the current theme.
    const url = buildCalendlyUrl();
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url });
    } else {
      // Fallback to opening in new tab if widget not loaded
      window.open(url, '_blank');
    }
  }, []);

  return { openCalendly, calendlyUrl: CALENDLY_URL };
};
