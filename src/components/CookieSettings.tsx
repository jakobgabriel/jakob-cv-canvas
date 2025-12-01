import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Cookie, Shield, BarChart3 } from 'lucide-react';
import { CookieManager } from '@/lib/cookieManager';
import { GoogleAnalytics } from '@/lib/googleAnalytics';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAnalytics } from '@/hooks/useAnalytics';

export const CookieSettings = () => {
  const { t } = useLanguage();
  const { trackConsentAction } = useAnalytics();
  const preferences = CookieManager.getPreferences();
  const [analyticsEnabled, setAnalyticsEnabled] = useState(preferences.analytics || false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    trackConsentAction('customize');
    CookieManager.setConsent(true);
    CookieManager.setPreferences({ 
      essential: true, 
      analytics: analyticsEnabled 
    });
    
    // Enable/disable Google Analytics and session based on user choice
    if (analyticsEnabled) {
      GoogleAnalytics.enable();
      CookieManager.initializeSession();
    } else {
      GoogleAnalytics.disable();
      CookieManager.clearTrackingData();
    }
    
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <Cookie className="w-4 h-4 mr-2" />
          {t('cookies.settings') || 'Cookie Settings'}
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
            <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-medium text-sm">{t('cookies.essential.title')}</div>
              <div className="text-muted-foreground text-xs mt-1">
                {t('cookies.essential.description')}
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">{t('cookies.required')}</Badge>
          </div>
          
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <BarChart3 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-medium text-sm">{t('cookies.analytics.title')}</div>
              <div className="text-muted-foreground text-xs mt-1">
                {t('cookies.analytics.description')}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch 
                checked={analyticsEnabled}
                onCheckedChange={setAnalyticsEnabled}
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
