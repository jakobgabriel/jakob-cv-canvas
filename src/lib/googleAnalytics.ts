// Google Analytics Integration
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export class GoogleAnalytics {
  private static readonly GA_TRACKING_ID = 'G-XXXXXXXXXX'; // TODO: Replace with your actual Google Analytics 4 tracking ID
  private static isInitialized = false;

  // Initialize Google Analytics
  static init(): void {
    if (this.isInitialized || typeof window === 'undefined') return;

    // Load Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${this.GA_TRACKING_ID}`;
    document.head.appendChild(script1);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: any[]) {
      window.dataLayer.push(args);
    };

    window.gtag('js', new Date());
    window.gtag('config', this.GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
      send_page_view: false, // We'll send it manually after consent
    });

    this.isInitialized = true;
  }

  // Enable Google Analytics after consent
  static enable(): void {
    if (!this.isInitialized) this.init();
    
    window.gtag('consent', 'update', {
      analytics_storage: 'granted'
    });

    // Send initial page view
    this.trackPageView();
  }

  // Disable Google Analytics
  static disable(): void {
    if (!this.isInitialized) this.init();
    
    window.gtag('consent', 'update', {
      analytics_storage: 'denied'
    });
  }

  // Track page views
  static trackPageView(path?: string): void {
    if (!this.isInitialized) return;

    window.gtag('event', 'page_view', {
      page_title: document.title,
      page_location: path || window.location.href,
    });
  }

  // Track custom events
  static trackEvent(action: string, category?: string, label?: string, value?: number): void {
    if (!this.isInitialized) return;

    window.gtag('event', action, {
      event_category: category || 'engagement',
      event_label: label,
      value: value,
    });
  }

  // Track social interactions
  static trackSocial(network: string, action: string, target: string): void {
    if (!this.isInitialized) return;

    window.gtag('event', 'social', {
      social_network: network,
      social_action: action,
      social_target: target,
    });
  }

  // Track downloads
  static trackDownload(fileName: string, fileType: string): void {
    if (!this.isInitialized) return;

    window.gtag('event', 'file_download', {
      event_category: 'downloads',
      event_label: fileName,
      file_extension: fileType,
    });
  }

  // Track language changes
  static trackLanguageChange(from: string, to: string): void {
    if (!this.isInitialized) return;

    window.gtag('event', 'language_change', {
      event_category: 'user_preferences',
      previous_language: from,
      new_language: to,
    });
  }

  // Track theme changes
  static trackThemeChange(theme: string): void {
    if (!this.isInitialized) return;

    window.gtag('event', 'theme_change', {
      event_category: 'user_preferences',
      theme_mode: theme,
    });
  }
}