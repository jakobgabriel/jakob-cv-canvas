import { HeroSection } from "@/components/resume/HeroSection";
import { Navigation } from "@/components/Navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ScrollProgress } from "@/components/ScrollProgress";
import { CookieSettings } from "@/components/CookieSettings";
import { BackToTop } from "@/components/BackToTop";
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
import { useBooking } from "@/hooks/useBooking";
import { TimelineSkeleton } from "@/components/skeletons/TimelineSkeleton";
import { SkillsSkeleton } from "@/components/skeletons/SkillsSkeleton";

// Lazy load below-fold sections for better performance
const TimelineSection = lazy(() =>
  import("@/components/resume/TimelineSection").then((module) => ({
    default: module.TimelineSection,
  })),
);
const SkillsSection = lazy(() =>
  import("@/components/resume/SkillsSection").then((module) => ({ default: module.SkillsSection })),
);

const Index = () => {
  const { language, t } = useLanguage();
  const { trackSocialClick, trackSectionView, trackScrollDepth } = useAnalytics();
  const { openBooking, isBookingEnabled } = useBooking();
  const { open: openContactForm } = useContactForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const resumeData = getResumeData(language);
  const basics = resumeData?.basics;

  // Scroll to section from URL param (e.g. /?section=hero)
  useEffect(() => {
    const section = searchParams.get("section");
    if (section) {
      // Remove the param so it doesn't persist on refresh
      setSearchParams({}, { replace: true });
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop - NAV_SCROLL_OFFSET;
          window.scrollTo({ top: offsetTop, behavior: "smooth" });
        }
      }, 100);
    }
  }, [searchParams, setSearchParams]);

  // Track section views
  useSectionTracking(["hero", "timeline", "skills"], {
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
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "session_duration", {
          event_category: "engagement",
          duration_seconds: duration,
        });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

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
      {/* Closing call to action — the page used to end on four small outline
          buttons; this gives the scroll somewhere to land. */}
      <footer className="relative py-20 border-t border-border/50 bg-gradient-accent backdrop-blur-sm overflow-hidden">
        {/* Decorative elements */}
        <div
          className="absolute top-0 left-1/4 w-48 h-48 bg-primary/5 rounded-full blur-3xl"
          aria-hidden="true"
        ></div>
        <div
          className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary-glow/5 rounded-full blur-3xl"
          aria-hidden="true"
        ></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-display font-medium tracking-tight">
              {t("cta.heading")}
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">{t("cta.description")}</p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              {isBookingEnabled && (
                <Button
                  size="lg"
                  className="px-8 shadow-professional"
                  onClick={() => {
                    openBooking();
                    trackSocialClick("booking", "booking_page");
                  }}
                >
                  <CalendarDays className="w-5 h-5 mr-2" aria-hidden="true" />
                  {t("hero.bookCall")}
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                className="px-8 border-border/60 hover:border-primary hover:text-primary"
                onClick={() => {
                  openContactForm();
                  trackSocialClick("contact", "contact_form_popup");
                }}
              >
                <MessageSquare className="w-5 h-5 mr-2" aria-hidden="true" />
                {t("contact.letsTalk")}
              </Button>
            </div>

            {/* Secondary links, demoted to a quiet row */}
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 justify-center text-sm">
              {availableProfiles.map((profile) => {
                const IconComponent = profileConfigs[profile.network].icon;

                return (
                  <a
                    key={profile.network}
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-sm text-muted-foreground hover:text-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    onClick={() => trackSocialClick(profile.network, profile.url)}
                  >
                    <IconComponent className="w-4 h-4" aria-hidden="true" />
                    {profile.network}
                  </a>
                );
              })}

              {basics?.email && (
                <a
                  href={`mailto:${basics.email}`}
                  className="flex items-center gap-2 rounded-sm text-muted-foreground hover:text-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  onClick={() => trackSocialClick("email", basics.email)}
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  Email
                </a>
              )}
            </div>

            <p className="mt-8 text-muted-foreground text-sm">
              © {new Date().getFullYear()} Jakob Gabriel. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
