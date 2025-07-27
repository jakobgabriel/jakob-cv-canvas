import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Cookie, Shield, BarChart3 } from 'lucide-react';
import { CookieManager } from '@/lib/cookieManager';

interface CookieConsentProps {
  onAccept?: () => void;
  onDecline?: () => void;
}

export const CookieConsent = ({ onAccept, onDecline }: CookieConsentProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Show consent banner if user hasn't made a choice
    if (!CookieManager.hasConsent() && localStorage.getItem('cookie-choice') !== 'declined') {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    CookieManager.setConsent(true);
    setIsVisible(false);
    onAccept?.();
    
    // Track the consent action
    CookieManager.trackInteraction('cookie_consent_accepted');
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-choice', 'declined');
    setIsVisible(false);
    onDecline?.();
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
            <h3 className="font-medium text-sm">Cookie Preferences</h3>
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
          We use cookies to enhance your experience and analyze site usage. 
          {!showDetails && (
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="text-primary hover:underline ml-1"
            >
              Learn more
            </button>
          )}
        </p>

        {showDetails && (
          <div className="mb-4 space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">Essential Cookies</div>
                <div className="text-muted-foreground text-xs">
                  Required for basic site functionality and user preferences.
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">Required</Badge>
            </div>
            
            <div className="flex items-start gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">Analytics Cookies</div>
                <div className="text-muted-foreground text-xs">
                  Help us understand how you interact with our site.
                </div>
              </div>
              <Badge variant="outline" className="text-xs">Optional</Badge>
            </div>

            <button 
              onClick={() => setShowDetails(false)}
              className="text-primary hover:underline text-xs"
            >
              Show less
            </button>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleAccept}
            size="sm"
            className="flex-1 h-8"
          >
            Accept All
          </Button>
          <Button
            onClick={handleDecline}
            variant="outline"
            size="sm"
            className="flex-1 h-8"
          >
            Decline
          </Button>
        </div>
      </Card>
    </div>
  );
};