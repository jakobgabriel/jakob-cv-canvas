import { HeroSection } from "@/components/resume/HeroSection";
import { Navigation } from "@/components/Navigation";
import { ThemeLanguageToggle } from "@/components/ThemeLanguageToggle";
import { ScrollProgress } from "@/components/ScrollProgress";
import { CookieSettings } from "@/components/CookieSettings";
import { BackToTop } from "@/components/BackToTop";
import { config } from "@/data/config";
import { getResumeData } from "@/data/resume";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useSectionTracking } from "@/hooks/useSectionTracking";
import { useScrollDepthTracking } from "@/hooks/useScrollDepthTracking";
import { Button } from "@/components/ui/button";
import { LinkedinIcon, Github, Mail, Globe, Twitter, Instagram, Facebook, Youtube, ExternalLink, CalendarDays, MessageSquare } from "lucide-react";
import { openContactForm } from "@/components/ContactFormModal";
import { useEffect, lazy, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import { useCalendly } from "@/hooks/useCalendly";
import { TimelineSkeleton } from "@/components/skeletons/TimelineSkeleton";
import { SkillsSkeleton } from "@/components/skeletons/SkillsSkeleton";

// Lazy load below-fold sections for better performance
const TimelineSection = lazy(() => import("@/components/resume/TimelineSection").then(module => ({ default: module.TimelineSection })));
const SkillsSection = lazy(() => import("@/components/resume/SkillsSection").then(module => ({ default: module.SkillsSection })));

const Index = () => {
  const { language } = useLanguage();
  const { trackSocialClick, trackSectionView, trackScrollDepth } = useAnalytics();
  const { openCalendly } = useCalendly();
  const [searchParams, setSearchParams] = useSearchParams();
  const resumeData = getResumeData(language);
  const basics = resumeData?.basics;

  // Scroll to section from URL param (e.g. /?section=hero)
  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      // Remove the param so it doesn't persist on refresh
      setSearchParams({}, { replace: true });
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop - 80;
          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [searchParams, setSearchParams]);

  // Track section views
  useSectionTracking(['hero', 'timeline', 'skills'], {
    onSectionView: trackSectionView,
  });

  // Track scroll depth
  useScrollDepthTracking({
    onScrollDepth: trackScrollDepth,
  });

  // Track session duration on page unload via Google Analytics
  useEffect(() => {
    const sessionStart = Date.now();

    const handleBeforeUnload = () => {
      const duration = Math.round((Date.now() - sessionStart) / 1000);
      // Use Google Analytics to track session duration instead of non-existent API
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'session_duration', {
          event_category: 'engagement',
          duration_seconds: duration,
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Define profile configurations for the 10 most common platforms
  const profileConfigs = {
    'LinkedIn': { icon: LinkedinIcon, color: 'text-blue-600 dark:text-blue-400' },
    'GitHub': { icon: Github, color: 'text-gray-900 dark:text-gray-100' },
    'Twitter': { icon: Twitter, color: 'text-blue-400 dark:text-blue-300' },
    'X': { 
      icon: () => (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ), 
      color: 'text-gray-900 dark:text-gray-100' 
    },
    'Instagram': { icon: Instagram, color: 'text-pink-600 dark:text-pink-400' },
    'Facebook': { icon: Facebook, color: 'text-blue-600 dark:text-blue-400' },
    'YouTube': { icon: Youtube, color: 'text-red-600 dark:text-red-400' },
    'Portfolio': { icon: ExternalLink, color: 'text-purple-600 dark:text-purple-400' },
    'Website': { icon: Globe, color: 'text-green-600 dark:text-green-400' }
  };

  // Get all available profiles
  const availableProfiles = basics?.profiles?.filter(profile => 
    profileConfigs[profile.network as keyof typeof profileConfigs]
  ) || [];

  return (
    <div className="min-h-screen scroll-smooth">
      <ScrollProgress />
      <Navigation />
      <ThemeLanguageToggle />
      <CookieSettings />
      <BackToTop />
      <div id="hero">
        <HeroSection />
      </div>
      <div id="timeline">
        <Suspense fallback={<TimelineSkeleton />}>
          <TimelineSection />
        </Suspense>
      </div>
      <div id="skills">
        <Suspense fallback={<SkillsSkeleton />}>
          <SkillsSection />
        </Suspense>
      </div>
      {/* Footer */}
      <footer className="relative py-16 border-t border-border/50 bg-gradient-accent backdrop-blur-sm overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/4 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary-glow/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Footer content */}
            <div className="text-center space-y-6">
              {/* Social links */}
              <div className="flex flex-wrap gap-3 justify-center">
                {availableProfiles.map((profile) => {
                  const config = profileConfigs[profile.network as keyof typeof profileConfigs];
                  const IconComponent = config.icon;
                  
                  return (
                    <Button 
                      key={profile.network}
                      variant="outline" 
                      size="sm"
                      className="border-border/50 hover:border-primary transition-smooth"
                      asChild
                    >
                      <a 
                        href={profile.url}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                        onClick={() => trackSocialClick(profile.network, profile.url)}
                      >
                        <IconComponent className="w-4 h-4" />
                        {profile.network}
                      </a>
                    </Button>
                  );
                })}
                
                {/* Email - Always show if available */}
                {basics?.email && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border/50 hover:border-primary transition-smooth"
                    asChild
                  >
                    <a
                      href={`mailto:${basics.email}`}
                      className="flex items-center gap-2"
                      onClick={() => trackSocialClick('email', basics.email)}
                    >
                      <Mail className="w-4 h-4" />
                      Email
                    </a>
                  </Button>
                )}

                {/* Contact Form */}
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border/50 hover:border-primary hover:text-primary transition-smooth"
                  onClick={() => {
                    openContactForm();
                    trackSocialClick('contact', 'contact_form_popup');
                  }}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact
                </Button>

                {/* Calendly - Book a call */}
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border/50 hover:border-primary hover:text-primary transition-smooth"
                  onClick={() => {
                    openCalendly();
                    trackSocialClick('calendly', 'calendly_popup');
                  }}
                >
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Calendly
                </Button>
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
