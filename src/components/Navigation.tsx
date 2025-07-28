import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, User, Briefcase, GraduationCap, Award, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  className?: string;
}

const navigationItems = [
  { id: 'hero', label: 'About', icon: User },
  { id: 'timeline', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Award },
  { id: 'contact', label: 'Contact', icon: Mail },
];

export const Navigation = ({ className }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Handle initial hash on page load
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && navigationItems.some(item => item.id === hash)) {
        setActiveSection(hash);
        const element = document.getElementById(hash);
        if (element) {
          const offsetTop = element.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Simplified active section detection
      const sections = ['hero', 'timeline', 'skills', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            // Update URL without triggering scroll
            if (window.location.hash !== `#${section}`) {
              window.history.replaceState(null, '', `#${section}`);
            }
            break;
          }
        }
      }
    };

    // Handle initial hash
    handleHashChange();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      
      // Update URL hash for copyable links
      window.history.pushState(null, '', `#${sectionId}`);
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Fixed Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
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

            {/* Desktop Navigation - Centered */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => scrollToSection(item.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 transition-smooth",
                      activeSection === item.id 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-muted/50"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
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
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border/50">
            <div className="container mx-auto px-6 py-4">
              <div className="flex flex-col space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      onClick={() => scrollToSection(item.id)}
                      className={cn(
                        "flex items-center gap-3 justify-start px-3 py-2 w-full transition-smooth",
                        activeSection === item.id 
                          ? "bg-primary/10 text-primary" 
                          : "hover:bg-muted/50"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
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
                  "w-3 h-3 rounded-full transition-all duration-300",
                  activeSection === item.id 
                    ? "bg-primary scale-125" 
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
                title={item.label}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};