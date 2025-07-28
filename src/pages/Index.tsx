import { HeroSection } from "@/components/resume/HeroSection";
import { TimelineSection } from "@/components/resume/TimelineSection";
import { SkillsSection } from "@/components/resume/SkillsSection";
import { ContactSection } from "@/components/resume/ContactSection";
import { Navigation } from "@/components/Navigation";
import { ThemeLanguageToggle } from "@/components/ThemeLanguageToggle";
import { CookieConsent } from "@/components/CookieConsent";
import { Toaster } from "@/components/ui/toaster";
import { useAnalytics } from "@/hooks/useAnalytics";

const Index = () => {
  const { trackEvent } = useAnalytics();
  return (
    <div className="min-h-screen scroll-smooth">
      <Navigation />
      <ThemeLanguageToggle />
      <div id="hero">
        <HeroSection />
      </div>
      <div id="timeline">
        <TimelineSection />
      </div>
      <div id="education">
        {/* Education is part of TimelineSection but gets its own ID */}
      </div>
      <div id="skills">
        <SkillsSection />
      </div>
      <div id="contact">
        <ContactSection />
      </div>
      
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
      <Toaster />
    </div>
  );
};

export default Index;
