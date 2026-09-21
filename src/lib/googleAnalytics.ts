// GDPR/CCPA Compliant Google Analytics Integration with Consent Mode v2
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export class GoogleAnalytics {
  private static trackingId: string | null = null;
  private static isInitialized = false;
  private static isEnabled = false;
  /**
   * Set when the visitor sends Do Not Track. init() used to simply return in
   * that case without recording why, so enable() saw isInitialized === false,
   * re-ran init(), and then carried on to inject the GA script and call
   * window.gtag — which init() had never defined. DNT users who accepted
   * cookies were tracked anyway and got an uncaught TypeError.
   */
  private static isDoNotTrack = false;

  // Set the tracking ID from config
  static setTrackingId(id: string): void {
    this.trackingId = id;
  }

  // Initialize Google Analytics with consent mode v2 (before consent)
  static init(): void {
    if (this.isInitialized || typeof window === "undefined" || !this.trackingId) return;

    // Check for Do Not Track
    if (navigator.doNotTrack === "1" || (window as any).doNotTrack === "1") {
      this.isDoNotTrack = true;
      return;
    }

    // Initialize dataLayer and gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };

    // Set default consent to denied (GDPR compliant)
    window.gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
      functionality_storage: "denied",
      personalization_storage: "denied",
      security_storage: "granted", // Always granted for security
      wait_for_update: 500, // Wait 500ms for consent update
    });

    this.isInitialized = true;
  }

  // Enable Google Analytics after user consent
  static enable(): void {
    if (!this.isInitialized) this.init();
    // Consent cannot override Do Not Track: the visitor asked not to be
    // tracked at the browser level, so nothing is loaded or sent.
    if (this.isDoNotTrack || !this.isInitialized) return;
    if (this.isEnabled || !this.trackingId) return;

    // Load Google Analytics script only after consent
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`;
    document.head.appendChild(script);

    // Update consent to granted
    window.gtag("consent", "update", {
      analytics_storage: "granted",
      functionality_storage: "granted",
      personalization_storage: "granted",
    });

    // Configure GA with privacy-friendly settings
    window.gtag("js", new Date());
    window.gtag("config", this.trackingId, {
      // anonymize_ip is deliberately absent: GA4 ignores it and anonymises
      // by default, so setting it only implied a protection it did not add.
      allow_google_signals: false, // Disable Google signals
      allow_ad_personalization_signals: false, // Disable ad personalization
      // Lax, not None. A first-party analytics cookie has no reason to be
      // sent on cross-site requests, and None widened that unnecessarily.
      cookie_flags: "SameSite=Lax;Secure",
      cookie_expires: 31536000, // 1 year — was 2, beyond usual GDPR guidance
      send_page_view: true, // GA sends the initial page view itself
    });

    this.isEnabled = true;

    // No explicit trackPageView() here: send_page_view above already sends
    // one, and calling both double-counted every visit.
  }

  // Disable Google Analytics and revoke consent
  static disable(): void {
    if (!this.isInitialized) this.init();
    if (!this.isInitialized || typeof window.gtag !== "function") {
      this.isEnabled = false;
      return;
    }

    window.gtag("consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
      functionality_storage: "denied",
      personalization_storage: "denied",
    });

    this.isEnabled = false;
  }

  // Track page views (only if enabled)
  static trackPageView(path?: string): void {
    if (!this.canSend()) return;

    window.gtag("event", "page_view", {
      page_title: document.title,
      page_location: path || window.location.href,
      page_path: path || window.location.pathname,
    });
  }

  // Track custom events (only if enabled)
  static trackEvent(action: string, category?: string, label?: string, value?: number): void {
    if (!this.canSend()) return;

    window.gtag("event", action, {
      event_category: category || "engagement",
      event_label: label,
      value: value,
    });
  }

  // Track social interactions (only if enabled)
  static trackSocial(network: string, action: string, target: string): void {
    if (!this.canSend()) return;

    window.gtag("event", "social", {
      social_network: network,
      social_action: action,
      social_target: target,
    });
  }

  // Track downloads (only if enabled)
  static trackDownload(fileName: string, fileType: string): void {
    if (!this.canSend()) return;

    window.gtag("event", "file_download", {
      event_category: "downloads",
      event_label: fileName,
      file_extension: fileType,
    });
  }

  // Track language changes (only if enabled)
  static trackLanguageChange(from: string, to: string): void {
    if (!this.canSend()) return;

    window.gtag("event", "language_change", {
      event_category: "user_preferences",
      previous_language: from,
      new_language: to,
    });
  }

  // Track theme changes (only if enabled)
  static trackThemeChange(theme: string): void {
    if (!this.canSend()) return;

    window.gtag("event", "theme_change", {
      event_category: "user_preferences",
      theme_mode: theme,
    });
  }

  // Track scroll depth (only if enabled)
  static trackScrollDepth(percentage: number): void {
    if (!this.canSend()) return;

    window.gtag("event", "scroll_depth", {
      event_category: "engagement",
      scroll_percentage: percentage,
    });
  }

  // Track section views (only if enabled)
  static trackSectionView(sectionId: string): void {
    if (!this.canSend()) return;

    window.gtag("event", "section_view", {
      event_category: "engagement",
      section_name: sectionId,
    });
  }

  // Track navigation clicks (only if enabled)
  static trackNavigationClick(from: string, to: string): void {
    if (!this.canSend()) return;

    window.gtag("event", "navigation_click", {
      event_category: "navigation",
      from_section: from,
      to_section: to,
    });
  }

  // Track form events (only if enabled)
  static trackFormEvent(action: string, formName: string, success?: boolean): void {
    if (!this.canSend()) return;

    window.gtag("event", "form_interaction", {
      event_category: "forms",
      form_name: formName,
      action: action,
      success: success,
    });
  }

  // Track outbound links (only if enabled)
  static trackOutboundLink(url: string, label: string): void {
    if (!this.canSend()) return;

    window.gtag("event", "outbound_click", {
      event_category: "outbound_links",
      link_url: url,
      link_label: label,
    });
  }

  // Track user engagement (only if enabled)
  static trackUserEngagement(type: string, details?: Record<string, any>): void {
    if (!this.canSend()) return;

    window.gtag("event", "user_engagement", {
      event_category: "engagement",
      engagement_type: type,
      ...details,
    });
  }

  // Track detail views (only if enabled)
  static trackDetailView(type: string, title: string): void {
    if (!this.canSend()) return;

    window.gtag("event", "detail_view", {
      event_category: "content_interaction",
      content_type: type,
      content_title: title,
    });
  }

  // Track session duration (only if enabled)
  static trackSessionDuration(duration: number): void {
    if (!this.canSend()) return;

    window.gtag("event", "session_duration", {
      event_category: "engagement",
      duration_seconds: duration,
    });
  }

  /** Guards every send: enabled, initialised, and gtag actually present. */
  private static canSend(): boolean {
    return (
      this.isEnabled &&
      this.isInitialized &&
      !this.isDoNotTrack &&
      typeof window !== "undefined" &&
      typeof window.gtag === "function"
    );
  }

  // Check if analytics is enabled
  static isAnalyticsEnabled(): boolean {
    return this.canSend();
  }
}
