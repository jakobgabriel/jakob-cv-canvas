import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Cookies from 'js-cookie';
import { CookieManager, CONSENT_CHANGE_EVENT } from './cookieManager';

const clearAllCookies = () => {
  Object.keys(Cookies.get()).forEach((name) => Cookies.remove(name, { path: '/' }));
};

describe('CookieManager', () => {
  beforeEach(clearAllCookies);
  afterEach(clearAllCookies);

  it('reports no consent decision before the visitor chooses', () => {
    expect(CookieManager.hasConsentDecision()).toBe(false);
    expect(CookieManager.hasConsent()).toBe(false);
    expect(CookieManager.analyticsAllowed()).toBe(false);
  });

  it('persists the consent decision (jsdom runs on http, so Secure must not be forced)', () => {
    CookieManager.setConsent(true);

    expect(CookieManager.hasConsentDecision()).toBe(true);
    expect(CookieManager.hasConsent()).toBe(true);
  });

  it('remembers a decline as a decision, not as missing', () => {
    CookieManager.setConsent(false);

    expect(CookieManager.hasConsentDecision()).toBe(true);
    expect(CookieManager.hasConsent()).toBe(false);
  });

  it('defaults analytics off when no preferences are stored', () => {
    expect(CookieManager.getPreferences()).toEqual({ essential: true, analytics: false });
  });

  it('round-trips stored preferences', () => {
    CookieManager.setPreferences({ essential: true, analytics: true });

    expect(CookieManager.getPreferences()).toEqual({ essential: true, analytics: true });
  });

  it('recovers from a malformed preferences cookie instead of throwing', () => {
    Cookies.set('user-preferences', '{not json', { path: '/' });

    expect(() => CookieManager.getPreferences()).not.toThrow();
    expect(CookieManager.getPreferences()).toEqual({ essential: true, analytics: false });
  });

  it('only allows analytics when consent and the preference agree', () => {
    CookieManager.setConsent(true);
    CookieManager.setPreferences({ essential: true, analytics: false });
    expect(CookieManager.analyticsAllowed()).toBe(false);

    CookieManager.setPreferences({ essential: true, analytics: true });
    expect(CookieManager.analyticsAllowed()).toBe(true);

    CookieManager.setConsent(false);
    expect(CookieManager.analyticsAllowed()).toBe(false);
  });

  it('does not start a tracking session without analytics consent', () => {
    CookieManager.setConsent(true);
    CookieManager.setPreferences({ essential: true, analytics: false });

    expect(CookieManager.initializeSession()).toBeNull();
    expect(Cookies.get('user-tracking')).toBeUndefined();
  });

  it('starts and reuses a tracking session once analytics is allowed', () => {
    CookieManager.setConsent(true);
    CookieManager.setPreferences({ essential: true, analytics: true });

    const first = CookieManager.initializeSession();
    expect(first).toMatch(/^session_/);
    expect(CookieManager.initializeSession()).toBe(first);
  });

  it('clearSessionData drops the session but keeps the consent decision', () => {
    CookieManager.setConsent(true);
    CookieManager.setPreferences({ essential: true, analytics: true });
    CookieManager.initializeSession();

    CookieManager.clearSessionData();

    expect(Cookies.get('user-tracking')).toBeUndefined();
    // The banner must not come back just because analytics was switched off.
    expect(CookieManager.hasConsentDecision()).toBe(true);
  });

  it('clearTrackingData removes everything, including the decision', () => {
    CookieManager.setConsent(true);
    CookieManager.setPreferences({ essential: true, analytics: true });
    CookieManager.initializeSession();

    CookieManager.clearTrackingData();

    expect(CookieManager.hasConsentDecision()).toBe(false);
    expect(Cookies.get('user-preferences')).toBeUndefined();
    expect(Cookies.get('user-tracking')).toBeUndefined();
  });

  it('announces consent changes so other UI can react without a reload', () => {
    const listener = vi.fn();
    window.addEventListener(CONSENT_CHANGE_EVENT, listener);

    CookieManager.setConsent(true);
    CookieManager.setPreferences({ essential: true, analytics: true });

    expect(listener).toHaveBeenCalledTimes(2);
    window.removeEventListener(CONSENT_CHANGE_EVENT, listener);
  });
});
