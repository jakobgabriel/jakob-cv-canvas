import { useState, useEffect, useRef, useId } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { X, Cookie, Shield, BarChart3, Settings } from 'lucide-react';
import { CookieManager } from '@/lib/cookieManager';
import { GoogleAnalytics } from '@/lib/googleAnalytics';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAnalytics } from '@/hooks/useAnalytics';

interface CookieConsentProps {
  onAccept?: () => void;
  onDecline?: () => void;
}

export const CookieConsent = ({ onAccept, onDecline }: CookieConsentProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  // Off by default: a pre-ticked analytics switch is not valid consent.
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const { t } = useLanguage();
  const { trackConsentAction } = useAnalytics();
  const headingId = useId();
  const descriptionId = useId();
  const bannerRef = useRef<HTMLDivElement>(null);

  // The browser may already have opted the visitor out, in which case the
  // analytics switch cannot do anything and should not pretend otherwise.
  const suppressedByBrowser = GoogleAnalytics.isSuppressedByPrivacySignal();

  useEffect(() => {
    // Show consent banner if user hasn't made ANY decision yet
    if (!CookieManager.hasConsentDecision()) {
      setIsVisible(true);
    }
  }, []);

  // Move focus to the banner once it appears. Without this a keyboard or
  // screen-reader user has to tab through the whole page to reach a choice
  // that is blocking their consent decision.
  useEffect(() => {
    if (isVisible) bannerRef.current?.focus();
  }, [isVisible]);

  /**
   * Store the decision, then bring Google Analytics in line with it. Order
   * matters: the consent event can only be recorded once consent is stored and
   * analytics is running, otherwise it is dropped by its own consent gate.
   */
  const applyConsent = (
    analytics: boolean,
    action: 'accept' | 'decline' | 'customize'
  ) => {
    CookieManager.saveConsent(analytics);

    if (analytics) {
      GoogleAnalytics.enable();
    } else {
      GoogleAnalytics.disable();
    }

    trackConsentAction(action);
    setIsVisible(false);
  };

  const handleAccept = () => {
    // "Accept All" means all — independent of the details toggle.
    setAnalyticsEnabled(true);
    applyConsent(true, 'accept');
    onAccept?.();
  };

  const handleDecline = () => {
    setAnalyticsEnabled(false);
    applyConsent(false, 'decline');
    onDecline?.();
  };

  const handleCustomize = () => {
    applyConsent(analyticsEnabled, 'customize');
    onAccept?.();
  };

  const handleClose = () => {
    // Close button acts as decline (GDPR best practice)
    handleDecline();
  };

  if (!isVisible) return null;

  return (
    <div
      ref={bannerRef}
      role="dialog"
      // Non-modal on purpose: the page stays readable and usable while the
      // visitor decides, so focus must not be trapped here.
      aria-modal="false"
      aria-labelledby={headingId}
      aria-describedby={descriptionId}
      tabIndex={-1}
      className="fixed bottom-4 left-4 right-4 z-50 outline-none md:left-auto md:right-4 md:w-96"
    >
      <Card className="p-4 border shadow-professional bg-card/95 backdrop-blur-sm">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Cookie className="w-5 h-5 text-primary" aria-hidden="true" />
            <h2 id={headingId} className="font-medium text-sm">{t('cookies.title')}</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0"
            aria-label={t('cookies.decline') || 'Essential Only'}
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>

        <p id={descriptionId} className="text-sm text-muted-foreground mb-4">
          {t('cookies.description')}
          {!showDetails && (
            <button
              onClick={() => setShowDetails(true)}
              aria-expanded={showDetails}
              className="text-primary hover:underline ml-1"
            >
              {t('cookies.learnMore')}
            </button>
          )}
        </p>

        {showDetails && (
          <div className="mb-4 space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Shield
                className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              <div className="flex-1">
                <div className="font-medium">{t('cookies.essential.title')}</div>
                <div className="text-muted-foreground text-xs">
                  {t('cookies.essential.description')}
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">{t('cookies.required')}</Badge>
            </div>

            <div className="flex items-start gap-2">
              <BarChart3
                className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              <div className="flex-1">
                <div className="font-medium">{t('cookies.analytics.title')}</div>
                <div className="text-muted-foreground text-xs">
                  {suppressedByBrowser
                    ? t('cookies.privacySignal')
                    : t('cookies.analytics.description')}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={analyticsEnabled && !suppressedByBrowser}
                  onCheckedChange={setAnalyticsEnabled}
                  disabled={suppressedByBrowser}
                  aria-label={t('cookies.analytics.title')}
                  className="scale-75"
                />
                <Badge variant="outline" className="text-xs">{t('cookies.optional')}</Badge>
              </div>
            </div>

            <button
              onClick={() => setShowDetails(false)}
              aria-expanded={showDetails}
              className="text-primary hover:underline text-xs"
            >
              {t('cookies.showLess')}
            </button>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleAccept}
            size="sm"
            className="flex-1 h-8"
          >
            {t('cookies.acceptAll') || 'Accept All'}
          </Button>
          {showDetails && (
            <Button
              onClick={handleCustomize}
              variant="outline"
              size="sm"
              className="flex-1 h-8"
            >
              <Settings className="w-3 h-3 mr-1" aria-hidden="true" />
              {t('cookies.savePreferences') || 'Save Choices'}
            </Button>
          )}
          <Button
            onClick={handleDecline}
            variant="outline"
            size="sm"
            className="flex-1 h-8"
          >
            {t('cookies.decline') || 'Essential Only'}
          </Button>
        </div>
      </Card>
    </div>
  );
};
