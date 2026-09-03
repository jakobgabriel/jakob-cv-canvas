import Cookies from 'js-cookie';

/**
 * Bump when the cookie categories change (a new vendor, a new purpose).
 * Consent recorded under an older version is treated as no decision at all,
 * so visitors are asked again rather than silently opted into something new.
 */
export const CONSENT_VERSION = 1;

/** How long a recorded decision stays valid before we ask again. */
const CONSENT_EXPIRY_DAYS = 365;

export interface ConsentRecord {
  /** Schema version this decision was recorded under. */
  version: number;
  /** Whether Google Analytics may run. */
  analytics: boolean;
  /** When the visitor decided, as epoch milliseconds. */
  timestamp: number;
}

/**
 * Dispatched on `window` whenever the stored decision changes, so UI mounted
 * elsewhere (the settings gear) can react without a reload.
 */
export const CONSENT_CHANGE_EVENT = 'cookie-consent-change';

const CONSENT_COOKIE = 'cookie-consent';

/** Cookies written by earlier versions of this app, cleaned up on read. */
const LEGACY_COOKIES = ['user-consent', 'user-preferences', 'user-tracking'];

export class CookieManager {
  /**
   * Browsers silently drop `Secure` cookies on plain http, which would throw
   * away the decision on local and LAN previews (and in jsdom). Ask for
   * `Secure` only where it can actually be honoured.
   */
  private static attributes(): Cookies.CookieAttributes {
    return {
      expires: CONSENT_EXPIRY_DAYS,
      path: '/',
      sameSite: 'Strict',
      secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
    };
  }

  private static notifyChange(): void {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT));
  }

  /**
   * Earlier builds split the decision across `user-consent` and
   * `user-preferences`, and wrote a `user-tracking` session id that nothing
   * ever read. Carry the real choice over once, then drop all three so
   * returning visitors are not re-prompted and are not left holding cookies
   * the site no longer uses.
   */
  private static migrateLegacyCookies(): ConsentRecord | null {
    const legacyConsent = Cookies.get('user-consent');
    const legacyPreferences = Cookies.get('user-preferences');

    const clearLegacy = () =>
      LEGACY_COOKIES.forEach((name) => Cookies.remove(name, { path: '/' }));

    if (legacyConsent === undefined) {
      // Nothing to carry over, but a stray session cookie may still be around.
      if (legacyPreferences !== undefined || Cookies.get('user-tracking') !== undefined) {
        clearLegacy();
      }
      return null;
    }

    let analytics = false;
    try {
      analytics =
        legacyConsent === 'true' &&
        (JSON.parse(legacyPreferences ?? '{}') as { analytics?: boolean })?.analytics === true;
    } catch {
      analytics = false;
    }

    clearLegacy();
    const record = this.write(analytics);
    return record;
  }

  private static write(analytics: boolean): ConsentRecord {
    const record: ConsentRecord = {
      version: CONSENT_VERSION,
      analytics,
      timestamp: Date.now(),
    };
    Cookies.set(CONSENT_COOKIE, JSON.stringify(record), this.attributes());
    return record;
  }

  /**
   * The visitor's stored decision, or `null` when there is none to honour —
   * never asked, cookie corrupted, or recorded under a superseded version.
   */
  static getConsent(): ConsentRecord | null {
    const raw = Cookies.get(CONSENT_COOKIE);
    if (raw === undefined) return this.migrateLegacyCookies();

    let parsed: Partial<ConsentRecord> | null;
    try {
      parsed = JSON.parse(raw) as Partial<ConsentRecord> | null;
    } catch {
      // A hand-edited or truncated cookie must not take the whole app down.
      Cookies.remove(CONSENT_COOKIE, { path: '/' });
      return null;
    }

    if (!parsed || parsed.version !== CONSENT_VERSION) {
      // Superseded schema: ask again rather than guessing what was agreed to.
      return null;
    }

    return {
      version: CONSENT_VERSION,
      analytics: parsed.analytics === true,
      timestamp: typeof parsed.timestamp === 'number' ? parsed.timestamp : 0,
    };
  }

  /** Whether the visitor has answered the current version of the banner. */
  static hasConsentDecision(): boolean {
    return this.getConsent() !== null;
  }

  /** Single source of truth for "may we run analytics?". */
  static analyticsAllowed(): boolean {
    return this.getConsent()?.analytics === true;
  }

  /** Record a decision. `analytics: false` is still a decision, not an absence. */
  static saveConsent(analytics: boolean): ConsentRecord {
    const record = this.write(analytics);
    this.notifyChange();
    return record;
  }

  /** Forget the decision entirely; the banner will be shown again. */
  static clearConsent(): void {
    Cookies.remove(CONSENT_COOKIE, { path: '/' });
    LEGACY_COOKIES.forEach((name) => Cookies.remove(name, { path: '/' }));
    this.notifyChange();
  }
}
