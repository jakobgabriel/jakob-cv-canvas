import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Cookies from 'js-cookie';
import { CookieManager, CONSENT_CHANGE_EVENT, CONSENT_VERSION } from './cookieManager';

const clearAllCookies = () => {
  Object.keys(Cookies.get()).forEach((name) => Cookies.remove(name, { path: '/' }));
};

describe('CookieManager', () => {
  beforeEach(clearAllCookies);
  afterEach(clearAllCookies);

  it('reports no decision before the visitor chooses', () => {
    expect(CookieManager.getConsent()).toBeNull();
    expect(CookieManager.hasConsentDecision()).toBe(false);
    expect(CookieManager.analyticsAllowed()).toBe(false);
  });

  it('persists a decision (jsdom runs on http, so Secure must not be forced)', () => {
    CookieManager.saveConsent(true);

    expect(CookieManager.hasConsentDecision()).toBe(true);
    expect(CookieManager.analyticsAllowed()).toBe(true);
  });

  it('treats a refusal as a decision, not as an absence', () => {
    CookieManager.saveConsent(false);

    // The banner must not come back just because analytics was declined.
    expect(CookieManager.hasConsentDecision()).toBe(true);
    expect(CookieManager.analyticsAllowed()).toBe(false);
  });

  it('stamps the decision with the current version and a timestamp', () => {
    const before = Date.now();
    const record = CookieManager.saveConsent(true);

    expect(record.version).toBe(CONSENT_VERSION);
    expect(record.timestamp).toBeGreaterThanOrEqual(before);
    expect(CookieManager.getConsent()).toEqual(record);
  });

  it('re-asks when the stored decision predates a category change', () => {
    Cookies.set(
      'cookie-consent',
      JSON.stringify({ version: CONSENT_VERSION - 1, analytics: true, timestamp: Date.now() }),
      { path: '/' }
    );

    // Old consent must not silently cover a newly added purpose.
    expect(CookieManager.getConsent()).toBeNull();
    expect(CookieManager.analyticsAllowed()).toBe(false);
    expect(CookieManager.hasConsentDecision()).toBe(false);
  });

  it('recovers from a malformed cookie instead of throwing', () => {
    Cookies.set('cookie-consent', '{not json', { path: '/' });

    expect(() => CookieManager.getConsent()).not.toThrow();
    expect(CookieManager.getConsent()).toBeNull();
    expect(Cookies.get('cookie-consent')).toBeUndefined();
  });

  it('coerces a missing analytics flag to denied rather than allowed', () => {
    Cookies.set(
      'cookie-consent',
      JSON.stringify({ version: CONSENT_VERSION, timestamp: Date.now() }),
      { path: '/' }
    );

    expect(CookieManager.analyticsAllowed()).toBe(false);
  });

  it('clearConsent forgets the decision so the banner returns', () => {
    CookieManager.saveConsent(true);
    CookieManager.clearConsent();

    expect(CookieManager.hasConsentDecision()).toBe(false);
  });

  it('announces changes so other UI can react without a reload', () => {
    const listener = vi.fn();
    window.addEventListener(CONSENT_CHANGE_EVENT, listener);

    CookieManager.saveConsent(true);
    CookieManager.clearConsent();

    expect(listener).toHaveBeenCalledTimes(2);
    window.removeEventListener(CONSENT_CHANGE_EVENT, listener);
  });

  describe('migration from the previous cookie layout', () => {
    it('carries an accepted decision over without re-prompting', () => {
      Cookies.set('user-consent', 'true', { path: '/' });
      Cookies.set('user-preferences', JSON.stringify({ essential: true, analytics: true }), {
        path: '/',
      });
      Cookies.set('user-tracking', 'session_123', { path: '/' });

      expect(CookieManager.analyticsAllowed()).toBe(true);
      expect(CookieManager.hasConsentDecision()).toBe(true);
    });

    it('carries a decline over as a decline', () => {
      Cookies.set('user-consent', 'true', { path: '/' });
      Cookies.set('user-preferences', JSON.stringify({ essential: true, analytics: false }), {
        path: '/',
      });

      expect(CookieManager.hasConsentDecision()).toBe(true);
      expect(CookieManager.analyticsAllowed()).toBe(false);
    });

    it('removes the legacy cookies, including the session id nothing read', () => {
      Cookies.set('user-consent', 'true', { path: '/' });
      Cookies.set('user-preferences', JSON.stringify({ analytics: true }), { path: '/' });
      Cookies.set('user-tracking', 'session_123', { path: '/' });

      CookieManager.getConsent();

      expect(Cookies.get('user-consent')).toBeUndefined();
      expect(Cookies.get('user-preferences')).toBeUndefined();
      expect(Cookies.get('user-tracking')).toBeUndefined();
    });

    it('cleans up stray legacy cookies even with no decision to carry over', () => {
      Cookies.set('user-tracking', 'session_123', { path: '/' });

      expect(CookieManager.getConsent()).toBeNull();
      expect(Cookies.get('user-tracking')).toBeUndefined();
    });

    it('falls back to denied when the legacy preferences cookie is corrupt', () => {
      Cookies.set('user-consent', 'true', { path: '/' });
      Cookies.set('user-preferences', 'not json', { path: '/' });

      expect(CookieManager.analyticsAllowed()).toBe(false);
      expect(CookieManager.hasConsentDecision()).toBe(true);
    });
  });
});
