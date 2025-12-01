import { useEffect } from 'react';
import { CookieManager } from '@/lib/cookieManager';
import { GoogleAnalytics } from '@/lib/googleAnalytics';
import { config } from '@/data/config';

// Hook to track user interactions with Google Analytics
export const useAnalytics = () => {
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
  }, []);

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

  const trackSectionView = (sectionId: string) => {
    trackEvent('section_view', 'engagement', sectionId);
    
    const preferences = CookieManager.getPreferences();
    if (CookieManager.hasConsent() && preferences.analytics) {
      GoogleAnalytics.trackSectionView(sectionId);
    }
  };

  const trackScrollDepth = (percentage: number) => {
    trackEvent('scroll_depth', 'engagement', `${percentage}%`, percentage);
    
    const preferences = CookieManager.getPreferences();
    if (CookieManager.hasConsent() && preferences.analytics) {
      GoogleAnalytics.trackScrollDepth(percentage);
    }
  };

  const trackNavigation = (from: string, to: string) => {
    trackEvent('navigation', 'navigation', `${from} to ${to}`);
    
    const preferences = CookieManager.getPreferences();
    if (CookieManager.hasConsent() && preferences.analytics) {
      GoogleAnalytics.trackNavigationClick(from, to);
    }
  };

  const trackDetailView = (type: 'experience' | 'education', title: string) => {
    trackEvent('detail_view', 'content', `${type}: ${title}`);
    
    const preferences = CookieManager.getPreferences();
    if (CookieManager.hasConsent() && preferences.analytics) {
      GoogleAnalytics.trackDetailView(type, title);
    }
  };

  const trackFormInteraction = (action: 'focus' | 'submit' | 'success' | 'error', formName: string) => {
    trackEvent('form_interaction', 'forms', `${formName}: ${action}`);
    
    const preferences = CookieManager.getPreferences();
    if (CookieManager.hasConsent() && preferences.analytics) {
      GoogleAnalytics.trackFormEvent(action, formName, action === 'success');
    }
  };

  const trackExternalLink = (url: string, label: string) => {
    trackEvent('external_link', 'outbound', label);
    
    const preferences = CookieManager.getPreferences();
    if (CookieManager.hasConsent() && preferences.analytics) {
      GoogleAnalytics.trackOutboundLink(url, label);
    }
  };

  const trackConsentAction = (action: 'accept' | 'decline' | 'customize') => {
    trackEvent('consent_action', 'privacy', action);
    
    const preferences = CookieManager.getPreferences();
    if (CookieManager.hasConsent() && preferences.analytics) {
      GoogleAnalytics.trackUserEngagement('cookie_consent', { action });
    }
  };

  return {
    trackEvent,
    trackClick,
    trackDownload,
    trackSocialClick,
    trackLanguageChange,
    trackThemeChange,
    trackSectionView,
    trackScrollDepth,
    trackNavigation,
    trackDetailView,
    trackFormInteraction,
    trackExternalLink,
    trackConsentAction,
  };
};