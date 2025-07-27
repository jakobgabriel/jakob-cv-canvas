import { HeroSection } from "@/components/resume/HeroSection";
import { TimelineSection } from "@/components/resume/TimelineSection";
import { SkillsSection } from "@/components/resume/SkillsSection";
import { ContactSection } from "@/components/resume/ContactSection";
import { ThemeLanguageToggle } from "@/components/ThemeLanguageToggle";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
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
      <Toaster />
    </div>
  );
};

export default Index;
