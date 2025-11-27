import Cookies from 'js-cookie';

// Cookie consent and tracking utilities
export class CookieManager {
  private static readonly CONSENT_COOKIE = 'user-consent';
  private static readonly TRACKING_COOKIE = 'user-tracking';
  private static readonly PREFERENCES_COOKIE = 'user-preferences';

  // Check if user has given consent
  static hasConsent(): boolean {
    return Cookies.get(this.CONSENT_COOKIE) === 'true';
  }

  // Set user consent
  static setConsent(consent: boolean): void {
    Cookies.set(this.CONSENT_COOKIE, consent.toString(), { 
      expires: 365, // 1 year
      sameSite: 'Strict',
      secure: true 
    });
  }

  // Track user interactions (integrates with Google Analytics)
  static trackInteraction(action: string, data?: Record<string, any>): void {
    if (!this.hasConsent()) return;
    
    // Check if analytics is enabled in preferences
    const preferences = this.getPreferences();
    if (!preferences.analytics) return;

    // Track to Google Analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, data);
    }
  }

  // Get or create session ID
  private static getSessionId(): string {
    let sessionId = Cookies.get(this.TRACKING_COOKIE);
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      Cookies.set(this.TRACKING_COOKIE, sessionId, { 
        expires: 1, // 1 day session
        sameSite: 'Strict',
        secure: true 
      });
    }
    return sessionId;
  }

  // Set user preferences
  static setPreferences(preferences: Record<string, any>): void {
    Cookies.set(this.PREFERENCES_COOKIE, JSON.stringify(preferences), {
      expires: 365,
      sameSite: 'Strict',
      secure: true
    });
  }

  // Get user preferences
  static getPreferences(): Record<string, any> {
    const prefs = Cookies.get(this.PREFERENCES_COOKIE);
    return prefs ? JSON.parse(prefs) : {};
  }

  // Clear all tracking data
  static clearTrackingData(): void {
    Cookies.remove(this.CONSENT_COOKIE);
    Cookies.remove(this.TRACKING_COOKIE);
    Cookies.remove(this.PREFERENCES_COOKIE);
  }
}
