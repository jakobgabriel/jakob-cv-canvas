declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
      initBadgeWidget: (options: {
        url: string;
        text: string;
        color: string;
        textColor: string;
        branding?: boolean;
      }) => void;
    };
  }
}

export const CALENDLY_URL = 'https://calendly.com/jakob-gabriel/30min';

const CALENDLY_CSS = 'https://assets.calendly.com/assets/external/widget.css';
const CALENDLY_JS = 'https://assets.calendly.com/assets/external/widget.js';

// Brand colors (hex without the leading '#') so the Calendly widget matches the
// app's teal theme instead of Calendly's default blue. The primary/accent teal
// mirrors `--primary` in src/index.css for each theme.
const CALENDLY_COLORS = {
  light: { primary_color: '246b65', text_color: '1a1a1a', background_color: 'ffffff' },
  dark: { primary_color: '6ecfc6', text_color: 'ffffff', background_color: '1a1a1a' },
} as const;

/**
 * Builds the Calendly URL with color query params matching the current theme.
 * `next-themes` is configured with `attribute="class"` (see src/App.tsx), so the
 * active theme is read from the `dark` class on the document element.
 */
export const buildCalendlyUrl = (): string => {
  const isDark =
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark');
  const params = new URLSearchParams(CALENDLY_COLORS[isDark ? 'dark' : 'light']);
  return `${CALENDLY_URL}?${params.toString()}`;
};

let loadPromise: Promise<boolean> | null = null;

/**
 * Fetch Calendly's widget assets.
 *
 * Never call this on mount. Calendly is a US service, and merely requesting
 * these files discloses the visitor's IP address to it — so the request may
 * only follow an explicit, informed action by the visitor. Resolves to whether
 * the widget is actually usable.
 */
export const loadCalendlyWidget = (): Promise<boolean> => {
  if (typeof document === 'undefined') return Promise.resolve(false);
  if (window.Calendly) return Promise.resolve(true);
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<boolean>((resolve) => {
    if (!document.querySelector('link[href*="calendly"]')) {
      const link = document.createElement('link');
      link.href = CALENDLY_CSS;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }

    const settle = () => resolve(Boolean(window.Calendly));

    const existing = document.querySelector<HTMLScriptElement>('script[src*="calendly"]');
    if (existing) {
      existing.addEventListener('load', settle);
      existing.addEventListener('error', settle);
      return;
    }

    const script = document.createElement('script');
    script.src = CALENDLY_JS;
    script.async = true;
    script.addEventListener('load', settle);
    script.addEventListener('error', () => {
      // Allow a later attempt to retry rather than caching the failure.
      loadPromise = null;
      resolve(false);
    });
    document.body.appendChild(script);
  });

  return loadPromise;
};

/**
 * Load the widget and open the booking popup. Falls back to a new tab if the
 * script is blocked or fails, so the visitor can still book.
 */
export const openCalendlyPopup = async (): Promise<void> => {
  // Resolved at open time so it reflects the theme as it is right now.
  const url = buildCalendlyUrl();
  const ready = await loadCalendlyWidget();

  if (ready && window.Calendly) {
    window.Calendly.initPopupWidget({ url });
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};
