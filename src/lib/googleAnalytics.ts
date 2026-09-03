import Cookies from 'js-cookie';

// GDPR/CCPA Compliant Google Analytics Integration with Consent Mode v2
declare global {
  interface Window {
    // Optional: nothing exists until `init()` has run, and `init()` deliberately
    // does nothing when Do Not Track is set or no tracking ID is configured.
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

type EventParams = Record<string, unknown>;

export class GoogleAnalytics {
  private static trackingId: string | null = null;
  /** Consent Mode bootstrap has run and `window.gtag` exists. */
  private static isInitialized = false;
  /** Do Not Track (or no browser) — never load anything. */
  private static isBlocked = false;
  /** The gtag.js script has been injected and `config` sent. Never redo this. */
  private static isConfigured = false;
  /** Analytics consent is currently granted. */
  private static isEnabled = false;

  // Set the tracking ID from config
  static setTrackingId(id: string): void {
    this.trackingId = id || null;
  }

  /**
   * Browser-level opt-outs. Global Privacy Control is the successor to Do Not
   * Track and, unlike DNT, carries legal weight (CPRA and several US state
   * laws treat it as a binding opt-out), so both are honoured before any
   * banner is even shown.
   */
  private static privacySignalEnabled(): boolean {
    if (typeof navigator === 'undefined') return false;

    const gpc = (navigator as unknown as { globalPrivacyControl?: boolean })
      .globalPrivacyControl;
    if (gpc === true) return true;

    const dnt =
      navigator.doNotTrack ??
      (window as unknown as { doNotTrack?: string }).doNotTrack ??
      (navigator as unknown as { msDoNotTrack?: string }).msDoNotTrack;
    return dnt === '1' || dnt === 'yes';
  }

  /** Whether a browser-level opt-out is suppressing analytics entirely. */
  static isSuppressedByPrivacySignal(): boolean {
    return this.isBlocked || this.privacySignalEnabled();
  }

  /**
   * Initialize Google Analytics with consent mode v2 (before consent).
   * Returns whether analytics may be used at all — callers must respect a
   * `false` here, otherwise a Do Not Track visitor gets tracked and every
   * `window.gtag(...)` call throws.
   */
  static init(): boolean {
    if (this.isInitialized) return true;
    if (this.isBlocked) return false;

    if (typeof window === 'undefined' || !this.trackingId) return false;

    if (this.privacySignalEnabled()) {
      this.isBlocked = true;
      // Honour the signal retroactively too: cookies from a previous visit,
      // before the opt-out was turned on, should not survive it.
      this.clearAnalyticsCookies();
      return false;
    }

    // Initialize dataLayer and gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };

    // Set default consent to denied (GDPR compliant)
    window.gtag('consent', 'default', {
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied',
      'analytics_storage': 'denied',
      'functionality_storage': 'denied',
      'personalization_storage': 'denied',
      'security_storage': 'granted', // Always granted for security
      'wait_for_update': 500 // Wait 500ms for consent update
    });

    this.isInitialized = true;
    return true;
  }

  /**
   * GA's own cookies can only carry `Secure` over https; on a plain-http
   * preview that flag would make the browser discard them outright. And
   * `SameSite=None` is for cross-site embedding — this is a first-party site,
   * so `Lax` keeps the cookie from riding along on unrelated cross-site requests.
   */
  private static cookieFlags(): string {
    const secure = window.location.protocol === 'https:' ? ';Secure' : '';
    return `SameSite=Lax${secure}`;
  }

  // Enable Google Analytics after user consent
  static enable(): void {
    if (!this.init()) return;
    if (this.isEnabled) return;

    // Update consent before anything is sent, so the first hit is compliant.
    window.gtag!('consent', 'update', {
      'analytics_storage': 'granted',
      'functionality_storage': 'granted',
      'personalization_storage': 'granted'
    });

    // Load and configure gtag.js exactly once per page, even across a
    // disable/enable round trip — a second script tag would double every hit.
    if (!this.isConfigured) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`;
      document.head.appendChild(script);

      // Configure GA with privacy-friendly settings
      window.gtag!('js', new Date());
      window.gtag!('config', this.trackingId, {
        'anonymize_ip': true, // IP anonymization
        'allow_google_signals': false, // Disable Google signals
        'allow_ad_personalization_signals': false, // Disable ad personalization
        'cookie_flags': this.cookieFlags(),
        'cookie_expires': 34128000, // 13 months, the GDPR-recommended maximum
        // Page views are sent explicitly by `trackPageView()` so the hash
        // route is included and each view is counted exactly once.
        'send_page_view': false
      });

      this.isConfigured = true;
    }

    this.isEnabled = true;

    // Send initial page view
    this.trackPageView();
  }

  // Disable Google Analytics and revoke consent
  static disable(): void {
    this.isEnabled = false;

    if (this.isInitialized) {
      window.gtag!('consent', 'update', {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'analytics_storage': 'denied',
        'functionality_storage': 'denied',
        'personalization_storage': 'denied'
      });
    }

    // Consent mode stops new cookies, but any already written must go too.
    this.clearAnalyticsCookies();
  }

  /** Remove the `_ga*` / `_gid` / `_gat*` cookies GA may already have written. */
  private static clearAnalyticsCookies(): void {
    if (typeof document === 'undefined') return;

    const names = Object.keys(Cookies.get()).filter((name) =>
      /^(_ga(_.+)?|_gid|_gat.*)$/.test(name)
    );
    if (names.length === 0) return;

    // GA writes on the registrable domain, so try the host and each parent.
    const host = window.location.hostname;
    const labels = host.split('.');
    const domains: (string | undefined)[] = [undefined, host, `.${host}`];
    for (let i = 1; i < labels.length - 1; i++) {
      domains.push(`.${labels.slice(i).join('.')}`);
    }

    for (const name of names) {
      for (const domain of domains) {
        Cookies.remove(name, domain ? { path: '/', domain } : { path: '/' });
      }
    }
  }

  /**
   * The app uses a HashRouter, so the real route lives in the fragment, which
   * GA ignores. Fold it into the reported path instead of reporting `/` for
   * every page.
   */
  private static currentPath(): string {
    const { pathname, search, hash } = window.location;
    if (!hash) return `${pathname}${search}`;
    const route = hash.replace(/^#/, '') || '/';
    return `${pathname.replace(/\/$/, '')}${route}`;
  }

  /** Every hit funnels through here so the consent check can never be skipped. */
  private static send(name: string, params: EventParams): void {
    if (!this.isEnabled || !this.isInitialized || !window.gtag) return;
    window.gtag('event', name, params);
  }

  // Track page views (only if enabled)
  static trackPageView(path?: string): void {
    if (!this.isEnabled || !this.isInitialized) return;

    const pagePath = path || this.currentPath();
    this.send('page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: pagePath
    });
  }

  // Track custom events (only if enabled)
  static trackEvent(action: string, category?: string, label?: string, value?: number): void {
    this.send(action, {
      event_category: category || 'engagement',
      event_label: label,
      value: value,
    });
  }

  // Track social interactions (only if enabled)
  static trackSocial(network: string, action: string, target: string): void {
    this.send('social', {
      social_network: network,
      social_action: action,
      social_target: target,
    });
  }

  // Track downloads (only if enabled)
  static trackDownload(fileName: string, fileType: string): void {
    this.send('file_download', {
      event_category: 'downloads',
      event_label: fileName,
      file_extension: fileType,
    });
  }

  // Track language changes (only if enabled)
  static trackLanguageChange(from: string, to: string): void {
    this.send('language_change', {
      event_category: 'user_preferences',
      previous_language: from,
      new_language: to,
    });
  }

  // Track theme changes (only if enabled)
  static trackThemeChange(theme: string): void {
    this.send('theme_change', {
      event_category: 'user_preferences',
      theme_mode: theme,
    });
  }

  // Track scroll depth (only if enabled)
  static trackScrollDepth(percentage: number): void {
    this.send('scroll_depth', {
      event_category: 'engagement',
      scroll_percentage: percentage,
    });
  }

  // Track section views (only if enabled)
  static trackSectionView(sectionId: string): void {
    this.send('section_view', {
      event_category: 'engagement',
      section_name: sectionId,
    });
  }

  // Track navigation clicks (only if enabled)
  static trackNavigationClick(from: string, to: string): void {
    this.send('navigation_click', {
      event_category: 'navigation',
      from_section: from,
      to_section: to,
    });
  }

  // Track form events (only if enabled)
  static trackFormEvent(action: string, formName: string, success?: boolean): void {
    this.send('form_interaction', {
      event_category: 'forms',
      form_name: formName,
      action: action,
      success: success,
    });
  }

  // Track outbound links (only if enabled)
  static trackOutboundLink(url: string, label: string): void {
    this.send('outbound_click', {
      event_category: 'outbound_links',
      link_url: url,
      link_label: label,
    });
  }

  // Track user engagement (only if enabled)
  static trackUserEngagement(type: string, details?: EventParams): void {
    this.send('user_engagement', {
      event_category: 'engagement',
      engagement_type: type,
      ...details,
    });
  }

  // Track detail views (only if enabled)
  static trackDetailView(type: string, title: string): void {
    this.send('detail_view', {
      event_category: 'content_interaction',
      content_type: type,
      content_title: title,
    });
  }

  // Track session duration (only if enabled)
  static trackSessionDuration(duration: number): void {
    this.send('session_duration', {
      event_category: 'engagement',
      duration_seconds: duration,
    });
  }

  // Check if analytics is enabled
  static isAnalyticsEnabled(): boolean {
    return this.isEnabled && this.isInitialized;
  }

  /** Reset all module state. Test helper — not used by the app. */
  static reset(): void {
    this.trackingId = null;
    this.isInitialized = false;
    this.isBlocked = false;
    this.isConfigured = false;
    this.isEnabled = false;
  }
}
