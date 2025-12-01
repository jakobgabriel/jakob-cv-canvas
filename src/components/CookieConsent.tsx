import { useState, useEffect } from 'react';
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
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const { t } = useLanguage();
  const { trackConsentAction } = useAnalytics();

  useEffect(() => {
    // Show consent banner if user hasn't made a choice yet
    const hasExistingConsent = CookieManager.hasConsent();
    const preferences = CookieManager.getPreferences();
    
    // Only show if no consent decision has been made
    if (!hasExistingConsent && !preferences.analytics && !preferences.essential) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    trackConsentAction('accept');
    CookieManager.setConsent(true);
    CookieManager.setPreferences({ 
      essential: true, 
      analytics: analyticsEnabled 
    });
    
    // Enable Google Analytics if analytics is enabled
    if (analyticsEnabled) {
      GoogleAnalytics.enable();
    }
    
    setIsVisible(false);
    onAccept?.();
  };

  const handleDecline = () => {
    trackConsentAction('decline');
    CookieManager.setConsent(false);
    CookieManager.setPreferences({ 
      essential: true, 
      analytics: false 
    });
    
    // Disable Google Analytics
    GoogleAnalytics.disable();
    
    setIsVisible(false);
    onDecline?.();
  };

  const handleCustomize = () => {
    trackConsentAction('customize');
    CookieManager.setConsent(true);
    CookieManager.setPreferences({ 
      essential: true, 
      analytics: analyticsEnabled 
    });
    
    // Enable/disable Google Analytics based on user choice
    if (analyticsEnabled) {
      GoogleAnalytics.enable();
    } else {
      GoogleAnalytics.disable();
    }
    
    setIsVisible(false);
    onAccept?.();
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <Card className="p-4 border shadow-professional bg-card/95 backdrop-blur-sm">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Cookie className="w-5 h-5 text-primary" />
            <h3 className="font-medium text-sm">{t('cookies.title')}</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {t('cookies.description')}
          {!showDetails && (
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="text-primary hover:underline ml-1"
            >
              {t('cookies.learnMore')}
            </button>
          )}
        </p>

        {showDetails && (
          <div className="mb-4 space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-medium">{t('cookies.essential.title')}</div>
                <div className="text-muted-foreground text-xs">
                  {t('cookies.essential.description')}
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">{t('cookies.required')}</Badge>
            </div>
            
            <div className="flex items-start gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-medium">{t('cookies.analytics.title')}</div>
                <div className="text-muted-foreground text-xs">
                  {t('cookies.analytics.description')}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch 
                  checked={analyticsEnabled}
                  onCheckedChange={setAnalyticsEnabled}
                  className="scale-75"
                />
                <Badge variant="outline" className="text-xs">{t('cookies.optional')}</Badge>
              </div>
            </div>

            <button 
              onClick={() => setShowDetails(false)}
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
            {t('cookies.acceptAll')}
          </Button>
          {showDetails && (
            <Button
              onClick={handleCustomize}
              variant="outline"
              size="sm"
              className="flex-1 h-8"
            >
              <Settings className="w-3 h-3 mr-1" />
              Save
            </Button>
          )}
          <Button
            onClick={handleDecline}
            variant="outline"
            size="sm"
            className="flex-1 h-8"
          >
            {t('cookies.decline')}
          </Button>
        </div>
      </Card>
    </div>
  );
};