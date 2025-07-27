import { useEffect } from 'react';
import { CookieManager } from '@/lib/cookieManager';

// Hook to track user interactions
export const useAnalytics = () => {
  useEffect(() => {
    // Track page view on component mount
    CookieManager.trackInteraction('page_view', {
      path: window.location.pathname,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      language: navigator.language,
    });
  }, []);

  const trackEvent = (action: string, data?: Record<string, any>) => {
    CookieManager.trackInteraction(action, data);
  };

  const trackClick = (element: string, details?: Record<string, any>) => {
    trackEvent('click', { element, ...details });
  };

  const trackDownload = (fileName: string, type: string) => {
    trackEvent('download', { fileName, type });
  };

  const trackSocialClick = (platform: string, url: string) => {
    trackEvent('social_click', { platform, url });
  };

  const trackLanguageChange = (from: string, to: string) => {
    trackEvent('language_change', { from, to });
  };

  const trackThemeChange = (theme: string) => {
    trackEvent('theme_change', { theme });
  };

  return {
    trackEvent,
    trackClick,
    trackDownload,
    trackSocialClick,
    trackLanguageChange,
    trackThemeChange,
  };
};