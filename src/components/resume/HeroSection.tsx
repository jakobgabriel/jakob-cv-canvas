import { Button } from "@/components/ui/button";
import { FileText, MapPin, Globe, ChevronDown, CalendarDays } from "lucide-react";
import jakobPortrait from "@/assets/jakob-portrait.jpeg";
import { config } from "@/data/config";
import { getResumeData } from "@/data/resume";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useBooking } from "@/hooks/useBooking";
import { LazyImage } from "@/components/LazyImage";
import { useEffect, useState, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatedTitle } from "@/components/AnimatedTitle";

/**
 * Three claims, strongest first. This replaces the flat row of five equally
 * weighted pills — those read as tags, this reads as a position.
 */
const CREDENTIALS = [
  { valueKey: "hero.stat.yearsValue", labelKey: "hero.stat.yearsLabel" },
  { valueKey: "hero.stat.domainValue", labelKey: "hero.stat.domainLabel" },
  { valueKey: "hero.stat.focusValue", labelKey: "hero.stat.focusLabel" },
] as const;

export const HeroSection = () => {
  const { language, t } = useLanguage();
  const { trackDownload, trackExternalLink } = useAnalytics();
  const { openBooking, isBookingEnabled } = useBooking();
  const resumeData = getResumeData(language);
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  // Parallax effect for background blobs — skipped on mobile and when the user
  // prefers reduced motion, to keep scrolling smooth and battery-friendly.
  // Reads are batched into a single rAF so a fast scroll cannot queue one
  // setState per scroll event.
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isMobile || prefersReducedMotion) return;

    let frame = 0;

    const handleScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = sectionRef.current?.getBoundingClientRect();
        if (rect && rect.bottom > 0) {
          setScrollY(window.scrollY);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [isMobile]);

  const scrollToTimeline = () => {
    document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" });
  };

  if (!resumeData || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-lg text-muted-foreground">{t("loading")}</div>
      </div>
    );
  }

  const { basics } = resumeData;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] flex items-center justify-center bg-gradient-hero pt-16 pb-16 overflow-hidden"
    >
      {/* Subtle decorative accents with parallax effect */}
      <div className="absolute inset-0 overflow-hidden will-change-transform pointer-events-none">
        <div
          className="absolute top-1/4 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-float parallax-blob"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        ></div>
        <div
          className="hidden sm:block absolute bottom-1/4 right-20 w-40 h-40 bg-primary-glow/5 rounded-full blur-3xl animate-float parallax-blob"
          style={{ animationDelay: "2s", transform: `translateY(${scrollY * -0.05}px)` }}
        ></div>
        <div
          className="hidden sm:block absolute top-1/2 right-1/3 w-24 h-24 bg-primary/3 rounded-full blur-2xl parallax-blob"
          style={{ transform: `translateY(${scrollY * 0.08}px) translateX(${scrollY * 0.02}px)` }}
        ></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Portrait — smaller on phones so the call to action stays above the fold */}
          <div className="flex justify-center">
            <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden shadow-professional border border-border/50">
              <LazyImage
                src={jakobPortrait}
                alt={`${basics.name} - Professional headshot`}
                className="w-full h-full object-cover gpu-accelerated rounded-full"
                loading="eager"
                decoding="sync"
                width="144"
                height="144"
              />
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <AnimatedTitle
              text={basics.name}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight"
            />
            {/* Starts as the last word of the name lands, so the two read as
                one gesture rather than two separate animations. */}
            <h2
              className="text-lg sm:text-xl lg:text-2xl text-muted-foreground font-normal animate-fade-in"
              style={{ animationDelay: "0.35s" }}
            >
              {basics.label}
            </h2>
          </div>

          {/* Credentials strip — the three things worth knowing before scrolling */}
          <dl
            className="mt-7 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-border/60 bg-border/60 animate-fade-in"
            style={{ animationDelay: "0.45s" }}
          >
            {CREDENTIALS.map(({ valueKey, labelKey }) => (
              <div
                key={valueKey}
                className="bg-background/70 backdrop-blur-sm px-2 py-3 sm:px-4 sm:py-4"
              >
                <dt className="sr-only">{t(labelKey)}</dt>
                <dd>
                  <span className="block font-display text-sm sm:text-base lg:text-lg font-medium text-foreground leading-tight">
                    {t(valueKey)}
                  </span>
                  <span className="mt-1 block text-[10px] sm:text-xs uppercase tracking-[0.08em] text-muted-foreground leading-tight">
                    {t(labelKey)}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <p
            className="mt-7 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in"
            style={{ animationDelay: "0.55s" }}
          >
            {basics.summary}
          </p>

          {/* Primary actions, paired so neither reads as an afterthought */}
          <div
            className="mt-8 flex flex-col sm:flex-row gap-3 justify-center animate-fade-in"
            style={{ animationDelay: "0.62s" }}
          >
            {config.features.downloadResume.enabled && (
              <Button size="lg" className="px-8 shadow-professional" asChild>
                <a
                  href={`${import.meta.env.BASE_URL}resume.pdf`}
                  download="Jakob_Gabriel_Resume.pdf"
                  onClick={() => trackDownload("resume.pdf", "pdf")}
                >
                  <FileText className="w-5 h-5 mr-2" aria-hidden="true" />
                  {t("hero.downloadResume")}
                </a>
              </Button>
            )}
            {isBookingEnabled && (
              <Button
                size="lg"
                variant="outline"
                className="px-8 border-border/60 hover:border-primary hover:text-primary"
                onClick={() => {
                  openBooking();
                  trackExternalLink("booking", "booking_page");
                }}
              >
                <CalendarDays className="w-5 h-5 mr-2" aria-hidden="true" />
                {t("hero.bookCall")}
              </Button>
            )}
          </div>

          {/* Secondary detail — demoted to plain text so it does not compete with the CTAs */}
          <div className="mt-6 flex flex-wrap justify-center items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" aria-hidden="true" />
              {basics.location.city} {basics.location.region}
            </span>
            {basics.url && (
              <a
                href={basics.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-sm hover:text-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                onClick={() => trackExternalLink(basics.url, "website")}
              >
                <Globe className="w-4 h-4" aria-hidden="true" />
                jakobgabriel.github.io
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Scroll down indicator */}
      <button
        onClick={scrollToTimeline}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer group scroll-indicator hidden sm:block"
        aria-label="Scroll to experience section"
      >
        <div className="p-2 rounded-full border border-border/50 bg-background/50 backdrop-blur-sm group-hover:border-primary group-hover:bg-primary/5 transition-[border-color,background-color] duration-200 flex items-center justify-center">
          <ChevronDown
            className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-200"
            aria-hidden="true"
          />
        </div>
      </button>
    </section>
  );
};
