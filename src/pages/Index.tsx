import { HeroSection } from "@/components/resume/HeroSection";
import { TimelineSection } from "@/components/resume/TimelineSection";
import { SkillsSection } from "@/components/resume/SkillsSection";
import { ContactSection } from "@/components/resume/ContactSection";
import { Navigation } from "@/components/Navigation";
import { ThemeLanguageToggle } from "@/components/ThemeLanguageToggle";
import { ScrollProgress } from "@/components/ScrollProgress";
import { config } from "@/data/config";
import { Heart, Github, Linkedin, Mail } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen scroll-smooth">
      <ScrollProgress />
      <Navigation />
      <ThemeLanguageToggle />
      <div id="hero">
        <HeroSection />
      </div>
      <div id="timeline">
        <TimelineSection />
      </div>
      <div id="skills">
        <SkillsSection />
      </div>
      {config?.features.contactForm.enabled !== false && (
        <div id="contact">
          <ContactSection />
        </div>
      )}
      
      {/* Enhanced Footer */}
      <footer className="relative py-16 border-t border-border/50 bg-gradient-accent backdrop-blur-sm overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/4 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary-glow/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Footer content */}
            <div className="text-center space-y-6">
              <div className="flex justify-center items-center gap-2 text-muted-foreground">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-primary fill-primary animate-pulse-slow" />
                <span>by Jakob Gabriel</span>
              </div>
              
              {/* Social links */}
              <div className="flex justify-center gap-4">
                <a 
                  href="https://github.com/jakobgabriel" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:bg-primary/10 transition-all duration-300 hover:-translate-y-1"
                >
                  <Github className="w-5 h-5 text-muted-foreground hover:text-primary transition-smooth" />
                </a>
                <a 
                  href="https://linkedin.com/in/jakob-gabriel" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:bg-primary/10 transition-all duration-300 hover:-translate-y-1"
                >
                  <Linkedin className="w-5 h-5 text-muted-foreground hover:text-primary transition-smooth" />
                </a>
              </div>
              
              <p className="text-muted-foreground text-sm">
                © {new Date().getFullYear()} Jakob Gabriel. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
