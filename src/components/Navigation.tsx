import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, User, Briefcase, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_SCROLL_OFFSET } from "@/lib/constants";
import { useAnalytics } from "@/hooks/useAnalytics";

interface NavigationProps {
  className?: string;
}

const navigationItems = [
  { id: 'hero', label: 'About', icon: User },
  { id: 'timeline', label: 'Experience', icon: Briefcase },
  { id: 'skills', label: 'Skills', icon: Award },
];

export const Navigation = ({ className }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const { trackNavigation } = useAnalytics();

  useEffect(() => {
    // Handle initial section param on page load (e.g. /#/?section=hero)
    const handleInitialSection = () => {
      const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
      const section = params.get('section');
      if (section && navigationItems.some(item => item.id === section)) {
        setActiveSection(section);
        // Delay scroll to ensure DOM is ready
        setTimeout(() => {
          const element = document.getElementById(section);
          if (element) {
            const offsetTop = element.offsetTop - NAV_SCROLL_OFFSET;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
          }
        }, 100);
      }
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Skip section detection during programmatic scrolling
      if (isScrolling) return;

      // Simplified active section detection
      const sections = ['hero', 'timeline', 'skills'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    handleInitialSection();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    // Track navigation
    trackNavigation(activeSection, sectionId);
    
    setIsScrolling(true);
    setActiveSection(sectionId);
    
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - NAV_SCROLL_OFFSET;

      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });

      // Re-enable scroll detection after smooth scrolling completes
      setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Fixed Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-200",
        isScrolled 
          ? "bg-background/80 backdrop-blur-lg border-b border-border/50 shadow-minimal" 
          : "bg-transparent",
        className
      )}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center h-16 relative">
            {/* Logo/Brand - Positioned absolutely to the left */}
            <button 
              onClick={() => scrollToSection('hero')}
              className="absolute left-0 font-display font-medium text-lg hover:text-primary transition-smooth"
            >
              Jakob Gabriel
            </button>

            {/* Desktop Navigation - Centered with better spacing */}
            <div className="hidden md:flex items-center justify-center space-x-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => scrollToSection(item.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 transition-smooth text-sm",
                      activeSection === item.id 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </Button>
                );
              })}
            </div>

            {/* Mobile Menu Button - Positioned absolutely to the right */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 md:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div id="mobile-navigation" className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border/50">
            <div className="container mx-auto px-6 py-4">
              <div className="flex flex-col space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      onClick={() => scrollToSection(item.id)}
                      className={cn(
                        "flex items-center gap-3 justify-start px-4 py-3 w-full transition-smooth text-base",
                        activeSection === item.id 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Floating Navigation Indicators (Desktop) */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
        <div className="bg-background/80 backdrop-blur-lg rounded-full border border-border/50 p-2 shadow-professional">
          <div className="flex flex-col space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  "w-3 h-3 rounded-full transition duration-200",
                  activeSection === item.id
                    ? "bg-primary scale-125"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
                title={item.label}
                aria-label={`Navigate to ${item.label} section`}
                aria-current={activeSection === item.id ? 'true' : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};