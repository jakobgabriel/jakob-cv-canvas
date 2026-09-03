import Cookies from 'js-cookie';

export interface CookiePreferences {
  /** Always on: needed for the site to work at all. */
  essential: boolean;
  /** Google Analytics. Off unless the visitor opts in. */
  analytics: boolean;
}

/**
 * Dispatched on `window` whenever the stored consent decision or preferences
 * change, so UI mounted elsewhere (the settings gear) can react without a reload.
 */
export const CONSENT_CHANGE_EVENT = 'cookie-consent-change';

const DEFAULT_PREFERENCES: CookiePreferences = { essential: true, analytics: false };

// Cookie consent and tracking utilities
export class CookieManager {
  private static readonly CONSENT_COOKIE = 'user-consent';
  private static readonly TRACKING_COOKIE = 'user-tracking';
  private static readonly PREFERENCES_COOKIE = 'user-preferences';

  /**
   * Browsers silently drop `Secure` cookies on plain http, which would throw
   * away the consent decision on local and LAN previews (and in jsdom). Ask
   * for `Secure` only where it can actually be honoured.
   */
  private static attributes(expires: number): Cookies.CookieAttributes {
    return {
      expires,
      path: '/',
      sameSite: 'Strict',
      secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
    };
  }

  private static notifyChange(): void {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT));
  }

  // Check if user has given consent
  static hasConsent(): boolean {
    return Cookies.get(this.CONSENT_COOKIE) === 'true';
  }

  // Check if user has made any consent decision (accept/decline)
  static hasConsentDecision(): boolean {
    return Cookies.get(this.CONSENT_COOKIE) !== undefined;
  }

  // Set user consent
  static setConsent(consent: boolean): void {
    Cookies.set(this.CONSENT_COOKIE, consent.toString(), this.attributes(365));
    this.notifyChange();
  }

  // Set user preferences
  static setPreferences(preferences: CookiePreferences): void {
    Cookies.set(this.PREFERENCES_COOKIE, JSON.stringify(preferences), this.attributes(365));
    this.notifyChange();
  }

  // Get user preferences
  static getPreferences(): CookiePreferences {
    const raw = Cookies.get(this.PREFERENCES_COOKIE);
    if (!raw) return { ...DEFAULT_PREFERENCES };

    try {
      const parsed = JSON.parse(raw) as Partial<CookiePreferences> | null;
      return { essential: true, analytics: parsed?.analytics === true };
    } catch {
      // A hand-edited or truncated cookie must not take the whole app down.
      // Drop it and fall back to the privacy-preserving defaults.
      Cookies.remove(this.PREFERENCES_COOKIE, { path: '/' });
      return { ...DEFAULT_PREFERENCES };
    }
  }

  /** Single source of truth for "may we run analytics?". */
  static analyticsAllowed(): boolean {
    return this.hasConsent() && this.getPreferences().analytics;
  }

  // Initialize tracking session (no-op without analytics consent)
  static initializeSession(): string | null {
    if (!this.analyticsAllowed()) return null;

    let sessionId = Cookies.get(this.TRACKING_COOKIE);
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
      Cookies.set(this.TRACKING_COOKIE, sessionId, this.attributes(1));
    }
    return sessionId;
  }

  /**
   * Drop the session cookie only. Used when analytics is switched off but the
   * consent decision itself must be remembered.
   */
  static clearSessionData(): void {
    Cookies.remove(this.TRACKING_COOKIE, { path: '/' });
  }

  // Clear all tracking data, including the consent decision itself
  static clearTrackingData(): void {
    Cookies.remove(this.CONSENT_COOKIE, { path: '/' });
    Cookies.remove(this.TRACKING_COOKIE, { path: '/' });
    Cookies.remove(this.PREFERENCES_COOKIE, { path: '/' });
    this.notifyChange();
  }
}
