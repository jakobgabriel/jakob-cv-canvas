import { HeroSection } from "@/components/resume/HeroSection";
import { TimelineSection } from "@/components/resume/TimelineSection";
import { SkillsSection } from "@/components/resume/SkillsSection";
import { ContactSection } from "@/components/resume/ContactSection";
import { ThemeLanguageToggle } from "@/components/ThemeLanguageToggle";
import { CookieConsent } from "@/components/CookieConsent";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { Toaster } from "@/components/ui/toaster";
import { useAnalytics } from "@/hooks/useAnalytics";

const Index = () => {
  const { trackEvent } = useAnalytics();
  return (
    <div className="min-h-screen">
      <ThemeLanguageToggle />
      <HeroSection />
      <TimelineSection />
      <SkillsSection />
      <ContactSection />
      
      {/* Footer */}
      <footer className="py-12 border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Jakob Gabriel. All rights reserved.
          </p>
        </div>
      </footer>
      
      <CookieConsent 
        onAccept={() => trackEvent('cookie_consent_accepted')}
        onDecline={() => trackEvent('cookie_consent_declined')}
      />
      <AnalyticsDashboard />
      <Toaster />
    </div>
  );
};

export default Index;
