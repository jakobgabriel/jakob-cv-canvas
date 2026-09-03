import { useCalendlyConsent } from '@/contexts/CalendlyContext';
import { CALENDLY_URL } from '@/lib/calendly';

/**
 * Booking entry point for the UI.
 *
 * `requestCalendly` opens a confirmation prompt; it does not contact Calendly.
 * Nothing is requested from Calendly until the visitor confirms — see
 * `src/contexts/CalendlyContext.tsx` for why.
 */
export const useCalendly = () => {
  const { requestCalendly } = useCalendlyConsent();
  return { requestCalendly, calendlyUrl: CALENDLY_URL };
};
