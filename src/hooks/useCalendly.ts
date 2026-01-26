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
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url: CALENDLY_URL });
    } else {
      // Fallback to opening in new tab if widget not loaded
      window.open(CALENDLY_URL, '_blank');
    }
  }, []);

  return { openCalendly, calendlyUrl: CALENDLY_URL };
};
