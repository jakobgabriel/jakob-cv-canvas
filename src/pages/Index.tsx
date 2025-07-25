import { HeroSection } from "@/components/resume/HeroSection";
import { ExperienceSection } from "@/components/resume/ExperienceSection";
import { SkillsSection } from "@/components/resume/SkillsSection";
import { ContactSection } from "@/components/resume/ContactSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ExperienceSection />
      <SkillsSection />
      <ContactSection />
      
      {/* Footer */}
      <footer className="py-8 border-t border-border bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground">
            © 2024 Jakob Gabriel. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
