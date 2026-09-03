import { HeroSection } from "@/components/resume/HeroSection";
import { Navigation } from "@/components/Navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
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
import { Mail, CalendarDays, MessageSquare } from "lucide-react";
import { useContactForm } from "@/contexts/ContactFormContext";
import { profileConfigs, getAvailableProfiles } from "@/lib/profileConfig";
import { NAV_SCROLL_OFFSET } from "@/lib/constants";
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
  const { trackSocialClick, trackSectionView, trackScrollDepth, trackSessionDuration } =
    useAnalytics();
  const { openCalendly } = useCalendly();
  const { open: openContactForm } = useContactForm();
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
          const offsetTop = element.offsetTop - NAV_SCROLL_OFFSET;
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

  // Track session duration when the page goes away. `pagehide` plus a hidden
  // `visibilitychange` covers mobile, where `beforeunload` often never fires —
  // and unlike `beforeunload` it does not disqualify the page from bfcache.
  // Goes through useAnalytics so the consent gate applies, rather than poking
  // window.gtag directly.
  useEffect(() => {
    const sessionStart = Date.now();
    let sent = false;

    const reportDuration = () => {
      if (sent) return;
      sent = true;
      trackSessionDuration(Math.round((Date.now() - sessionStart) / 1000));
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') reportDuration();
    };

    window.addEventListener('pagehide', reportDuration);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('pagehide', reportDuration);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [trackSessionDuration]);

  // Social/profile networks that have a known icon + colour configuration
  const availableProfiles = getAvailableProfiles(basics);

  return (
    <div className="min-h-screen scroll-smooth">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:shadow-professional focus:ring-2 focus:ring-primary"
      >
        Skip to main content
      </a>
      <ScrollProgress />
      <Navigation />
      <ThemeToggle />
      <CookieSettings />
      <BackToTop />
      <main id="main-content" tabIndex={-1} className="outline-none">
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
      </main>
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
                  const IconComponent = profileConfigs[profile.network].icon;

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
                        <IconComponent className="w-4 h-4" aria-hidden="true" />
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
                      <Mail className="w-4 h-4" aria-hidden="true" />
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
                  <MessageSquare className="w-4 h-4 mr-2" aria-hidden="true" />
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
                  <CalendarDays className="w-4 h-4 mr-2" aria-hidden="true" />
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
