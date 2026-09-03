import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Cookie, Shield, BarChart3 } from 'lucide-react';
import { CookieManager, CONSENT_CHANGE_EVENT } from '@/lib/cookieManager';
import { GoogleAnalytics } from '@/lib/googleAnalytics';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAnalytics } from '@/hooks/useAnalytics';

export const CookieSettings = () => {
  const { t } = useLanguage();
  const { trackConsentAction } = useAnalytics();
  const [analyticsEnabled, setAnalyticsEnabled] = useState(
    () => CookieManager.analyticsAllowed()
  );
  const [isOpen, setIsOpen] = useState(false);
  const [showIcon, setShowIcon] = useState(false);

  // The browser may already have opted the visitor out, in which case the
  // analytics switch cannot do anything and should not pretend otherwise.
  const suppressedByBrowser = GoogleAnalytics.isSuppressedByPrivacySignal();

  // Only show the floating icon after user has made a consent decision. The
  // banner dismissing is a consent change, so listen rather than checking once
  // on mount — otherwise the gear stays hidden until the next page load.
  useEffect(() => {
    const sync = () => setShowIcon(CookieManager.hasConsentDecision());
    sync();
    window.addEventListener(CONSENT_CHANGE_EVENT, sync);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, sync);
  }, []);

  // Re-read the stored choice each time the dialog opens, so a decision made
  // in the banner (or in another tab) is reflected rather than a stale default.
  const handleOpenChange = (open: boolean) => {
    if (open) setAnalyticsEnabled(CookieManager.analyticsAllowed());
    setIsOpen(open);
  };

  const handleSave = () => {
    // Saving always records a decision, so switching analytics off keeps the
    // banner away rather than resetting the visitor to "never asked".
    CookieManager.saveConsent(analyticsEnabled);

    if (analyticsEnabled) {
      GoogleAnalytics.enable();
    } else {
      GoogleAnalytics.disable();
    }

    // Recorded after the new preference is live, or the event is dropped.
    trackConsentAction('customize');
    setIsOpen(false);
  };

  if (!showIcon) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full shadow-elegant opacity-50 hover:opacity-100 transition-all duration-300 hover:scale-110 border-border/50 hover:border-primary bg-background/80 backdrop-blur-sm"
          aria-label={t('cookies.settings') || 'Cookie Settings'}
        >
          <Cookie className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cookie className="w-5 h-5 text-primary" />
            {t('cookies.title')}
          </DialogTitle>
          <DialogDescription>
            {t('cookies.description')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Shield className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-medium text-sm">{t('cookies.essential.title')}</div>
              <div className="text-muted-foreground text-xs mt-1">
                {t('cookies.essential.description')}
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">{t('cookies.required')}</Badge>
          </div>
          
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-medium text-sm">{t('cookies.analytics.title')}</div>
              <div className="text-muted-foreground text-xs mt-1">
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
              />
              <Badge variant="outline" className="text-xs">{t('cookies.optional')}</Badge>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex-1">
            {t('cookies.savePreferences') || 'Save Preferences'}
          </Button>
          <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
            {t('common.cancel') || 'Cancel'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
