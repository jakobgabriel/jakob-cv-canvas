import { useCallback } from 'react';
import { CookieManager } from '@/lib/cookieManager';
import { GoogleAnalytics } from '@/lib/googleAnalytics';

/**
 * Thin, side-effect-free wrapper around {@link GoogleAnalytics}.
 *
 * Deliberately does no initialization and sends no page view: the hook is used
 * by many components, so anything it did on mount would happen once per
 * consumer. Bootstrapping lives in `bootstrapAnalytics()` and page views in
 * `App`, both of which run exactly once.
 */
export const useAnalytics = () => {
  // GoogleAnalytics already refuses to send while consent is missing; this is
  // the belt-and-braces check for the cookie decision itself.
  const allowed = useCallback(() => CookieManager.analyticsAllowed(), []);

  const trackEvent = useCallback(
    (action: string, category?: string, label?: string, value?: number) => {
      if (!allowed()) return;
      GoogleAnalytics.trackEvent(action, category, label, value);
    },
    [allowed]
  );

  const trackClick = useCallback(
    (element: string, details?: Record<string, unknown>) => {
      if (!allowed()) return;
      GoogleAnalytics.trackUserEngagement('click', { element, ...details });
    },
    [allowed]
  );

  const trackDownload = useCallback(
    (fileName: string, type: string) => {
      if (!allowed()) return;
      GoogleAnalytics.trackDownload(fileName, type);
    },
    [allowed]
  );

  const trackSocialClick = useCallback(
    (platform: string, url: string) => {
      if (!allowed()) return;
      GoogleAnalytics.trackSocial(platform, 'click', url);
    },
    [allowed]
  );

  const trackLanguageChange = useCallback(
    (from: string, to: string) => {
      if (!allowed()) return;
      GoogleAnalytics.trackLanguageChange(from, to);
    },
    [allowed]
  );

  const trackThemeChange = useCallback(
    (theme: string) => {
      if (!allowed()) return;
      GoogleAnalytics.trackThemeChange(theme);
    },
    [allowed]
  );

  const trackSectionView = useCallback(
    (sectionId: string) => {
      if (!allowed()) return;
      GoogleAnalytics.trackSectionView(sectionId);
    },
    [allowed]
  );

  const trackScrollDepth = useCallback(
    (percentage: number) => {
      if (!allowed()) return;
      GoogleAnalytics.trackScrollDepth(percentage);
    },
    [allowed]
  );

  const trackNavigation = useCallback(
    (from: string, to: string) => {
      if (!allowed()) return;
      GoogleAnalytics.trackNavigationClick(from, to);
    },
    [allowed]
  );

  const trackDetailView = useCallback(
    (type: 'experience' | 'education', title: string) => {
      if (!allowed()) return;
      GoogleAnalytics.trackDetailView(type, title);
    },
    [allowed]
  );

  const trackFormInteraction = useCallback(
    (action: 'focus' | 'submit' | 'success' | 'error', formName: string) => {
      if (!allowed()) return;
      GoogleAnalytics.trackFormEvent(action, formName, action === 'success');
    },
    [allowed]
  );

  const trackExternalLink = useCallback(
    (url: string, label: string) => {
      if (!allowed()) return;
      GoogleAnalytics.trackOutboundLink(url, label);
    },
    [allowed]
  );

  const trackSessionDuration = useCallback(
    (seconds: number) => {
      if (!allowed()) return;
      GoogleAnalytics.trackSessionDuration(seconds);
    },
    [allowed]
  );

  const trackConsentAction = useCallback(
    (action: 'accept' | 'decline' | 'customize') => {
      if (!allowed()) return;
      GoogleAnalytics.trackUserEngagement('cookie_consent', { action });
    },
    [allowed]
  );

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
    trackSessionDuration,
    trackConsentAction,
  };
};
