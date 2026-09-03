import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Cookies from 'js-cookie';
import { GoogleAnalytics } from './googleAnalytics';

const TRACKING_ID = 'G-TEST12345';

/** Everything pushed through the gtag stub, as plain arrays. */
const calls = () => (window.dataLayer ?? []).map((entry) => Array.from(entry as IArguments));

const eventsNamed = (name: string) =>
  calls().filter((c) => c[0] === 'event' && c[1] === name);

const gtagScripts = () =>
  Array.from(document.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]'));

describe('GoogleAnalytics', () => {
  beforeEach(() => {
    GoogleAnalytics.reset();
    delete window.gtag;
    delete window.dataLayer;
    gtagScripts().forEach((s) => s.remove());
    Object.keys(Cookies.get()).forEach((name) => Cookies.remove(name, { path: '/' }));
    Object.defineProperty(navigator, 'doNotTrack', { value: null, configurable: true });
    Object.defineProperty(navigator, 'globalPrivacyControl', {
      value: undefined,
      configurable: true,
    });
  });

  afterEach(() => {
    GoogleAnalytics.reset();
  });

  it('does nothing without a tracking ID', () => {
    expect(GoogleAnalytics.init()).toBe(false);
    expect(window.gtag).toBeUndefined();
  });

  it('bootstraps consent mode with everything denied by default', () => {
    GoogleAnalytics.setTrackingId(TRACKING_ID);

    expect(GoogleAnalytics.init()).toBe(true);

    const [defaults] = calls().filter((c) => c[0] === 'consent' && c[1] === 'default');
    expect(defaults[2]).toMatchObject({
      ad_storage: 'denied',
      analytics_storage: 'denied',
      security_storage: 'granted',
    });
    // Nothing may load before consent.
    expect(gtagScripts()).toHaveLength(0);
    expect(GoogleAnalytics.isAnalyticsEnabled()).toBe(false);
  });

  it('sends no events while consent is outstanding', () => {
    GoogleAnalytics.setTrackingId(TRACKING_ID);
    GoogleAnalytics.init();

    GoogleAnalytics.trackEvent('some_action');
    GoogleAnalytics.trackPageView();

    expect(calls().filter((c) => c[0] === 'event')).toHaveLength(0);
  });

  it('loads gtag.js and grants consent on enable', () => {
    GoogleAnalytics.setTrackingId(TRACKING_ID);
    GoogleAnalytics.init();
    GoogleAnalytics.enable();

    expect(gtagScripts()).toHaveLength(1);
    const [update] = calls().filter((c) => c[0] === 'consent' && c[1] === 'update');
    expect(update[2]).toMatchObject({ analytics_storage: 'granted' });
    expect(GoogleAnalytics.isAnalyticsEnabled()).toBe(true);
  });

  it('sends exactly one page view per enable, not one from config and one manual', () => {
    GoogleAnalytics.setTrackingId(TRACKING_ID);
    GoogleAnalytics.enable();

    const [configCall] = calls().filter((c) => c[0] === 'config');
    // gtag.js would send its own page view on top of the explicit one.
    expect(configCall[2]).toMatchObject({ send_page_view: false });
    expect(eventsNamed('page_view')).toHaveLength(1);
  });

  it('is idempotent: a second enable neither reloads the script nor re-counts the view', () => {
    GoogleAnalytics.setTrackingId(TRACKING_ID);
    GoogleAnalytics.enable();
    GoogleAnalytics.enable();

    expect(gtagScripts()).toHaveLength(1);
    expect(eventsNamed('page_view')).toHaveLength(1);
  });

  it('does not inject a second script when consent is withdrawn and given again', () => {
    GoogleAnalytics.setTrackingId(TRACKING_ID);
    GoogleAnalytics.enable();
    GoogleAnalytics.disable();
    GoogleAnalytics.enable();

    expect(gtagScripts()).toHaveLength(1);
    expect(calls().filter((c) => c[0] === 'config')).toHaveLength(1);
  });

  it('stops sending after disable and revokes consent', () => {
    GoogleAnalytics.setTrackingId(TRACKING_ID);
    GoogleAnalytics.enable();
    GoogleAnalytics.disable();

    GoogleAnalytics.trackEvent('after_disable');

    expect(GoogleAnalytics.isAnalyticsEnabled()).toBe(false);
    expect(eventsNamed('after_disable')).toHaveLength(0);
    const updates = calls().filter((c) => c[0] === 'consent' && c[1] === 'update');
    expect(updates[updates.length - 1][2]).toMatchObject({ analytics_storage: 'denied' });
  });

  it('deletes Google Analytics cookies when consent is withdrawn', () => {
    Cookies.set('_ga', 'GA1.1.123.456', { path: '/' });
    Cookies.set(`_ga_${TRACKING_ID.replace('G-', '')}`, 'GS1.1.abc', { path: '/' });
    Cookies.set('user-consent', 'true', { path: '/' });

    GoogleAnalytics.setTrackingId(TRACKING_ID);
    GoogleAnalytics.enable();
    GoogleAnalytics.disable();

    expect(Cookies.get('_ga')).toBeUndefined();
    expect(Cookies.get(`_ga_${TRACKING_ID.replace('G-', '')}`)).toBeUndefined();
    // Unrelated cookies must survive.
    expect(Cookies.get('user-consent')).toBe('true');
  });

  it('honours Global Privacy Control, the legally binding successor to DNT', () => {
    Object.defineProperty(navigator, 'globalPrivacyControl', {
      value: true,
      configurable: true,
    });
    GoogleAnalytics.setTrackingId(TRACKING_ID);

    expect(GoogleAnalytics.init()).toBe(false);
    expect(GoogleAnalytics.isSuppressedByPrivacySignal()).toBe(true);

    GoogleAnalytics.enable();
    expect(gtagScripts()).toHaveLength(0);
    expect(GoogleAnalytics.isAnalyticsEnabled()).toBe(false);
  });

  it('clears analytics cookies left over from before the opt-out was turned on', () => {
    Cookies.set('_ga', 'GA1.1.123.456', { path: '/' });
    Object.defineProperty(navigator, 'globalPrivacyControl', {
      value: true,
      configurable: true,
    });

    GoogleAnalytics.setTrackingId(TRACKING_ID);
    GoogleAnalytics.init();

    expect(Cookies.get('_ga')).toBeUndefined();
  });

  it('reports no privacy signal when the browser sends none', () => {
    expect(GoogleAnalytics.isSuppressedByPrivacySignal()).toBe(false);
  });

  it('honours Do Not Track and never throws when enable/disable are still called', () => {
    Object.defineProperty(navigator, 'doNotTrack', { value: '1', configurable: true });
    GoogleAnalytics.setTrackingId(TRACKING_ID);

    expect(GoogleAnalytics.init()).toBe(false);
    expect(() => GoogleAnalytics.enable()).not.toThrow();
    expect(() => GoogleAnalytics.disable()).not.toThrow();

    expect(gtagScripts()).toHaveLength(0);
    expect(window.gtag).toBeUndefined();
    expect(GoogleAnalytics.isAnalyticsEnabled()).toBe(false);
  });

  it('reports the hash route in the page path, not just "/"', () => {
    window.location.hash = '#/timeline';
    GoogleAnalytics.setTrackingId(TRACKING_ID);
    GoogleAnalytics.enable();

    const [pageView] = eventsNamed('page_view');
    expect(pageView[2]).toMatchObject({ page_path: expect.stringContaining('/timeline') });

    window.location.hash = '';
  });

  it('sends a page view per route change without duplicating the path separator', () => {
    window.location.hash = '#/';
    GoogleAnalytics.setTrackingId(TRACKING_ID);
    GoogleAnalytics.enable();
    GoogleAnalytics.trackPageView();

    const views = eventsNamed('page_view');
    expect(views).toHaveLength(2);
    expect((views[0][2] as { page_path: string }).page_path).not.toContain('//');

    window.location.hash = '';
  });
});
