import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { openCalendlyPopup } from "@/lib/calendly";

/**
 * Controls the two-click flow in front of the Calendly widget.
 *
 * Calendly is a US service, so loading its widget discloses the visitor's IP
 * address to it. Rather than a site-wide banner, the booking button asks once,
 * at the moment it matters: the visitor's deliberate, informed confirmation is
 * the consent, and nothing is requested before it.
 *
 * Deliberately stores nothing. Remembering the answer would mean writing to the
 * visitor's device, which is exactly what this design avoids.
 */
interface CalendlyContextValue {
  /** Whether the confirmation prompt is showing. */
  isPromptOpen: boolean;
  /** Ask the visitor before loading anything. */
  requestCalendly: () => void;
  /** They agreed — load the widget and open the booking popup. */
  confirmCalendly: () => void;
  /** They declined; nothing has been requested. */
  cancelCalendly: () => void;
}

const CalendlyContext = createContext<CalendlyContextValue | null>(null);

export const CalendlyProvider = ({ children }: { children: ReactNode }) => {
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  // Remember the element that opened the prompt so focus can be restored.
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const requestCalendly = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    setIsPromptOpen(true);
  }, []);

  const restoreFocus = useCallback(() => {
    setTimeout(() => {
      previousFocusRef.current?.focus();
    }, 100);
  }, []);

  const confirmCalendly = useCallback(() => {
    setIsPromptOpen(false);
    void openCalendlyPopup();
  }, []);

  const cancelCalendly = useCallback(() => {
    setIsPromptOpen(false);
    restoreFocus();
  }, [restoreFocus]);

  const value = useMemo(
    () => ({ isPromptOpen, requestCalendly, confirmCalendly, cancelCalendly }),
    [isPromptOpen, requestCalendly, confirmCalendly, cancelCalendly]
  );

  return <CalendlyContext.Provider value={value}>{children}</CalendlyContext.Provider>;
};

export const useCalendlyConsent = () => {
  const context = useContext(CalendlyContext);
  if (!context) {
    throw new Error("useCalendlyConsent must be used within a CalendlyProvider");
  }
  return context;
};
