import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";

/**
 * Context for controlling the global contact form modal.
 *
 * Replaces the previous module-level mutable function pointer
 * (`openContactFormFn`) with an explicit React context, removing the hidden
 * coupling and making the open/close behaviour testable.
 */
interface ContactFormContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const ContactFormContext = createContext<ContactFormContextValue | null>(null);

export const ContactFormProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  // Remember the element that opened the modal so focus can be restored on close.
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const open = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Restore focus to the element that opened the modal.
    setTimeout(() => {
      previousFocusRef.current?.focus();
    }, 100);
  }, []);

  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);

  return <ContactFormContext.Provider value={value}>{children}</ContactFormContext.Provider>;
};

export const useContactForm = () => {
  const context = useContext(ContactFormContext);
  if (!context) {
    throw new Error("useContactForm must be used within a ContactFormProvider");
  }
  return context;
};
