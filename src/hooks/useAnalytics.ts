import { CookieManager } from "@/lib/cookieManager";
import { GoogleAnalytics } from "@/lib/googleAnalytics";

/**
 * Event API for the app. Initialisation, consent and the single page view all
 * live in App, deliberately: this hook is used by eight components, and when
 * it owned a mount effect each of them fired its own page view — nine per
 * visit once GA's own send_page_view is counted.
 *
 * Each helper sends exactly one GA event. Previously each sent two or three:
 * CookieManager.trackInteraction pushed a raw gtag event, trackEvent pushed
 * the same action again, and the specific wrapper added a third.
 */
export const useAnalytics = () => {
  const consented = () => {
    if (!CookieManager.hasConsent()) return false;
    return Boolean(CookieManager.getPreferences().analytics);
  };

  /** Runs `send` only when the visitor has consented to analytics. */
  const withConsent = (send: () => void) => {
    if (consented()) send();
  };

  const trackEvent = (action: string, category?: string, label?: string, value?: number) =>
    withConsent(() => GoogleAnalytics.trackEvent(action, category, label, value));

  const trackClick = (element: string) => trackEvent("click", "engagement", element);

  const trackDownload = (fileName: string, type: string) =>
    withConsent(() => GoogleAnalytics.trackDownload(fileName, type));

  const trackSocialClick = (platform: string, url: string) =>
    withConsent(() => GoogleAnalytics.trackSocial(platform, "click", url));

  const trackLanguageChange = (from: string, to: string) =>
    withConsent(() => GoogleAnalytics.trackLanguageChange(from, to));

  const trackThemeChange = (theme: string) =>
    withConsent(() => GoogleAnalytics.trackThemeChange(theme));

  const trackSectionView = (sectionId: string) =>
    withConsent(() => GoogleAnalytics.trackSectionView(sectionId));

  const trackScrollDepth = (percentage: number) =>
    withConsent(() => GoogleAnalytics.trackScrollDepth(percentage));

  const trackNavigation = (from: string, to: string) =>
    withConsent(() => GoogleAnalytics.trackNavigationClick(from, to));

  const trackDetailView = (type: "experience" | "education", title: string) =>
    withConsent(() => GoogleAnalytics.trackDetailView(type, title));

  const trackFormInteraction = (
    action: "focus" | "submit" | "success" | "error",
    formName: string,
  ) => withConsent(() => GoogleAnalytics.trackFormEvent(action, formName, action === "success"));

  const trackExternalLink = (url: string, label: string) =>
    withConsent(() => GoogleAnalytics.trackOutboundLink(url, label));

  const trackConsentAction = (action: "accept" | "decline" | "customize") =>
    withConsent(() => GoogleAnalytics.trackUserEngagement("cookie_consent", { action }));

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
