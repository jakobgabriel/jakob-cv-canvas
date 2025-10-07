import { useEffect } from 'react';
import { CookieManager } from '@/lib/cookieManager';
import { GoogleAnalytics } from '@/lib/googleAnalytics';
import { useConfig } from './useConfig';

// Hook to track user interactions with Google Analytics
export const useAnalytics = () => {
  const { config } = useConfig();

  useEffect(() => {
    // Only initialize if tracking ID is provided in config
    if (config?.analytics?.googleAnalyticsId) {
      GoogleAnalytics.setTrackingId(config.analytics.googleAnalyticsId);
      GoogleAnalytics.init();
      
      // Check if user has given analytics consent
      const preferences = CookieManager.getPreferences();
      if (CookieManager.hasConsent() && preferences.analytics) {
        GoogleAnalytics.enable();
      }

      // Track page view on component mount (if consent given)
      if (CookieManager.hasConsent() && preferences.analytics) {
        GoogleAnalytics.trackPageView();
      }
    }
  }, [config]);

  const trackEvent = (action: string, category?: string, label?: string, value?: number) => {
    // Still track locally for basic functionality
    CookieManager.trackInteraction(action, { category, label, value });
    
    // Track with Google Analytics if consent given
    const preferences = CookieManager.getPreferences();
    if (CookieManager.hasConsent() && preferences.analytics) {
      GoogleAnalytics.trackEvent(action, category, label, value);
    }
  };

  const trackClick = (element: string, details?: Record<string, any>) => {
    trackEvent('click', 'engagement', element);
  };

  const trackDownload = (fileName: string, type: string) => {
    trackEvent('download', 'files', fileName);
    
    const preferences = CookieManager.getPreferences();
    if (CookieManager.hasConsent() && preferences.analytics) {
      GoogleAnalytics.trackDownload(fileName, type);
    }
  };

  const trackSocialClick = (platform: string, url: string) => {
    trackEvent('social_click', 'social', platform);
    
    const preferences = CookieManager.getPreferences();
    if (CookieManager.hasConsent() && preferences.analytics) {
      GoogleAnalytics.trackSocial(platform, 'click', url);
    }
  };

  const trackLanguageChange = (from: string, to: string) => {
    trackEvent('language_change', 'preferences');
    
    const preferences = CookieManager.getPreferences();
    if (CookieManager.hasConsent() && preferences.analytics) {
      GoogleAnalytics.trackLanguageChange(from, to);
    }
  };

  const trackThemeChange = (theme: string) => {
    trackEvent('theme_change', 'preferences');
    
    const preferences = CookieManager.getPreferences();
    if (CookieManager.hasConsent() && preferences.analytics) {
      GoogleAnalytics.trackThemeChange(theme);
    }
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