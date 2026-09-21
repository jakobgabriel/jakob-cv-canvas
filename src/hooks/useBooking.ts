import { useCallback } from "react";
import { config } from "@/data/config";

/**
 * Opens the scheduling page in a new tab.
 *
 * Deliberately loads no third-party script. The previous Calendly integration
 * injected widget.js and widget.css from assets.calendly.com in a mount
 * effect, so every visitor's IP reached a third party on page load — before
 * they had answered the cookie banner. Linking out means nothing leaves the
 * page until someone actually clicks.
 *
 * The provider is configured in public/data/config.json, so switching
 * scheduling tools is a config edit rather than a code change.
 */
export const useBooking = () => {
  const bookingUrl = config?.features?.booking?.url ?? "";
  // Both must hold: a flag with no URL would render a button that goes
  // nowhere, and a URL with the flag off should stay switched off.
  const isBookingEnabled = Boolean(config?.features?.booking?.enabled && bookingUrl);

  const openBooking = useCallback(() => {
    if (!isBookingEnabled) return;

    let target = bookingUrl;
    try {
      // Hand the booking page the current theme so it opens light or dark to
      // match. An unrecognised parameter is simply ignored by the provider.
      const url = new URL(bookingUrl);
      const isDark = document.documentElement.classList.contains("dark");
      url.searchParams.set("theme", isDark ? "dark" : "light");
      target = url.toString();
    } catch {
      // A malformed URL in config should still open rather than throw.
    }

    window.open(target, "_blank", "noopener,noreferrer");
  }, [bookingUrl, isBookingEnabled]);

  return { openBooking, bookingUrl, isBookingEnabled };
};
