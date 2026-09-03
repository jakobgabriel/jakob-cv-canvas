import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Cookies from 'js-cookie';

const configMock = { analytics: { googleAnalyticsId: 'G-TEST12345' } };
vi.mock('@/data/config', () => ({
  get config() {
    return configMock;
  },
}));

import { bootstrapAnalytics } from './analyticsBootstrap';
import { CookieManager } from './cookieManager';
import { GoogleAnalytics } from './googleAnalytics';

const clearAllCookies = () =>
  Object.keys(Cookies.get()).forEach((name) => Cookies.remove(name, { path: '/' }));

describe('bootstrapAnalytics', () => {
  beforeEach(() => {
    clearAllCookies();
    GoogleAnalytics.reset();
    // reset() clears module state; the globals gtag.js touches are separate.
    delete window.gtag;
    delete window.dataLayer;
    configMock.analytics.googleAnalyticsId = 'G-TEST12345';
    vi.restoreAllMocks();
  });

  afterEach(() => {
    clearAllCookies();
    GoogleAnalytics.reset();
  });

  it('sets up consent mode but does not enable analytics without a decision', () => {
    const enable = vi.spyOn(GoogleAnalytics, 'enable');

    bootstrapAnalytics();

    expect(GoogleAnalytics.isAnalyticsEnabled()).toBe(false);
    expect(enable).not.toHaveBeenCalled();
  });

  it('enables analytics for a returning visitor who accepted', () => {
    CookieManager.saveConsent(true);

    bootstrapAnalytics();

    expect(GoogleAnalytics.isAnalyticsEnabled()).toBe(true);
  });

  it('stays off for a returning visitor who declined', () => {
    CookieManager.saveConsent(false);

    bootstrapAnalytics();

    expect(GoogleAnalytics.isAnalyticsEnabled()).toBe(false);
  });

  it('does nothing at all when no tracking ID is configured', () => {
    configMock.analytics.googleAnalyticsId = '';
    CookieManager.saveConsent(true);

    bootstrapAnalytics();

    expect(GoogleAnalytics.isAnalyticsEnabled()).toBe(false);
    expect(window.gtag).toBeUndefined();
  });
});
