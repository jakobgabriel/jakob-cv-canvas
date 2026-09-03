import { CookieManager } from '@/lib/cookieManager';
import { GoogleAnalytics } from '@/lib/googleAnalytics';
import { config } from '@/data/config';

/**
 * Wire up Consent Mode and, where consent already exists, gtag.js.
 *
 * Called from `main.tsx` before the app renders. Doing it here rather than in a
 * component effect matters: child effects run before parent effects, so an
 * `App`-level bootstrap would still miss events fired by sections mounting
 * underneath it.
 */
export const bootstrapAnalytics = (): void => {
  const trackingId = config?.analytics?.googleAnalyticsId;
  if (!trackingId) return;

  GoogleAnalytics.setTrackingId(trackingId);
  GoogleAnalytics.init();

  if (CookieManager.analyticsAllowed()) {
    GoogleAnalytics.enable();
    CookieManager.initializeSession();
  }
};
