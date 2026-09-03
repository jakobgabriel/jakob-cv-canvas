import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarDays, ExternalLink } from "lucide-react";
import { useCalendlyConsent } from "@/contexts/CalendlyContext";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * The second click of the two-click flow. Names who receives the data, where
 * they are, and what is transmitted — that is what makes the confirmation
 * informed rather than a formality.
 */
export const CalendlyConsentDialog = () => {
  const { isPromptOpen, confirmCalendly, cancelCalendly } = useCalendlyConsent();
  const { t } = useLanguage();

  return (
    <Dialog open={isPromptOpen} onOpenChange={(open) => !open && cancelCalendly()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" aria-hidden="true" />
            {t('calendly.title')}
          </DialogTitle>
          <DialogDescription className="text-left">
            {t('calendly.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <Button variant="outline" onClick={cancelCalendly} className="flex-1">
            {t('common.cancel')}
          </Button>
          <Button onClick={confirmCalendly} className="flex-1">
            <ExternalLink className="w-4 h-4 mr-2" aria-hidden="true" />
            {t('calendly.confirm')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
