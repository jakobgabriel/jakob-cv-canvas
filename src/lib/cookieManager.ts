import Cookies from "js-cookie";

// Cookie consent and tracking utilities
export class CookieManager {
  private static readonly CONSENT_COOKIE = "user-consent";
  private static readonly TRACKING_COOKIE = "user-tracking";
  private static readonly PREFERENCES_COOKIE = "user-preferences";

  /**
   * Shared cookie attributes. `secure` is conditional: a secure cookie is
   * silently dropped over plain http, so hard-coding it meant consent never
   * persisted on localhost and the banner reappeared on every dev reload.
   */
  private static attributes(days: number): Cookies.CookieAttributes {
    return {
      expires: days,
      sameSite: "Strict",
      secure: typeof window !== "undefined" && window.location.protocol === "https:",
    };
  }

  // Check if user has given consent
  static hasConsent(): boolean {
    return Cookies.get(this.CONSENT_COOKIE) === "true";
  }

  // Set user consent
  static setConsent(consent: boolean): void {
    Cookies.set(this.CONSENT_COOKIE, consent.toString(), this.attributes(365));
  }

  // Initialize tracking session (only call after consent)
  static initializeSession(): string {
    let sessionId = Cookies.get(this.TRACKING_COOKIE);
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      Cookies.set(this.TRACKING_COOKIE, sessionId, this.attributes(1));
    }
    return sessionId;
  }

  // Check if user has made any consent decision (accept/decline)
  static hasConsentDecision(): boolean {
    return Cookies.get(this.CONSENT_COOKIE) !== undefined;
  }

  // Set user preferences
  static setPreferences(preferences: Record<string, any>): void {
    Cookies.set(this.PREFERENCES_COOKIE, JSON.stringify(preferences), this.attributes(365));
  }

  // Get user preferences
  static getPreferences(): Record<string, any> {
    const prefs = Cookies.get(this.PREFERENCES_COOKIE);
    if (!prefs) return {};
    try {
      const parsed = JSON.parse(prefs);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      // A truncated or hand-edited cookie must not throw: this is read on
      // every tracked interaction, so it would take the page down with it.
      return {};
    }
  }

  // Clear all tracking data
  static clearTrackingData(): void {
    Cookies.remove(this.CONSENT_COOKIE);
    Cookies.remove(this.TRACKING_COOKIE);
    Cookies.remove(this.PREFERENCES_COOKIE);
  }
}
