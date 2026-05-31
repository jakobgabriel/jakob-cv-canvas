import { Button } from "@/components/ui/button";
import { LinkedinIcon, Github, Mail, FileText, MapPin, Phone, Globe, Twitter, Instagram, Facebook, Youtube, Camera, ExternalLink, Briefcase, ChevronDown, CalendarDays } from "lucide-react";
import jakobPortrait from "@/assets/jakob-portrait.jpeg";
import { config } from "@/data/config";
import { getResumeData } from "@/data/resume";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useCalendly } from "@/hooks/useCalendly";
import { LazyImage } from "@/components/LazyImage";
import { useEffect, useState, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export const HeroSection = () => {
  const { language, t } = useLanguage();
  const { trackSocialClick, trackDownload, trackExternalLink } = useAnalytics();
  const { openCalendly } = useCalendly();
  const resumeData = getResumeData(language);
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  // Parallax effect for background blobs — skipped on mobile and when the user
  // prefers reduced motion, to keep scrolling smooth and battery-friendly.
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isMobile || prefersReducedMotion) return;

    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        if (rect.bottom > 0) {
          setScrollY(window.scrollY);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  const scrollToTimeline = () => {
    const timelineSection = document.getElementById('timeline');
    if (timelineSection) {
      timelineSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!resumeData || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-lg text-muted-foreground">{t('loading')}</div>
      </div>
    );
  }

  const { basics } = resumeData;
  
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
    'Website': { icon: Globe, color: 'text-green-600 dark:text-green-400' },
    'Calendly': { icon: CalendarDays, color: 'text-blue-500 dark:text-blue-400' }
  };

  // Get all available profiles
  const availableProfiles = basics.profiles?.filter(profile => 
    profileConfigs[profile.network as keyof typeof profileConfigs]
  ) || [];

  return (
    <section ref={sectionRef} className="relative min-h-[100svh] flex items-center justify-center bg-gradient-hero pt-16 pb-16 overflow-hidden">
      {/* Subtle decorative accents with parallax effect */}
      <div className="absolute inset-0 overflow-hidden will-change-transform pointer-events-none">
        <div
          className="absolute top-1/4 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-float parallax-blob"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        ></div>
        <div
          className="hidden sm:block absolute bottom-1/4 right-20 w-40 h-40 bg-primary-glow/5 rounded-full blur-3xl animate-float parallax-blob"
          style={{ animationDelay: '2s', transform: `translateY(${scrollY * -0.05}px)` }}
        ></div>
        <div
          className="hidden sm:block absolute top-1/2 right-1/3 w-24 h-24 bg-primary/3 rounded-full blur-2xl parallax-blob"
          style={{ transform: `translateY(${scrollY * 0.08}px) translateX(${scrollY * 0.02}px)` }}
        ></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Portrait - Minimal and Professional */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden shadow-professional border border-border/50">
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
          </div>
          
          {/* Content - Enhanced Typography with Animations */}
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight animate-scale-in">
                {basics.name}
              </h1>
              <h2 className="text-lg sm:text-xl lg:text-2xl text-muted-foreground font-normal animate-slide-up" style={{ animationDelay: '0.2s' }}>
                {basics.label}
              </h2>
              <div className="flex justify-center">
                <div className="flex flex-wrap gap-2 justify-center items-center max-w-2xl animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                    <Briefcase className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-medium text-primary">7+ Years</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                    <span className="text-xs font-medium text-primary">Automotive</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                    <span className="text-xs font-medium text-primary">Manufacturing</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                    <span className="text-xs font-medium text-primary">Industry 4.0</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                    <span className="text-xs font-medium text-primary">Digital Transformation</span>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {basics.summary}
            </p>

            {/* Contact Info - Minimal */}
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {basics.location.city} {basics.location.region}
              </div>
              {basics.url && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border/50 hover:border-primary transition-smooth min-h-11 py-2 px-3"
                  asChild
                >
                  <a
                    href={basics.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm"
                    onClick={() => trackExternalLink(basics.url, 'website')}
                  >
                    <Globe className="w-4 h-4" />
                    jakobgabriel.github.io
                  </a>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="border-border/50 hover:border-primary hover:text-primary transition-smooth min-h-11 py-2 px-3"
                onClick={() => {
                  openCalendly();
                  trackExternalLink('calendly', 'calendly_popup');
                }}
              >
                <CalendarDays className="w-4 h-4 mr-2" />
                Book a Call
              </Button>
            </div>
            
            {config.features.downloadResume.enabled && (
              <Button
                size="lg"
                className="px-8 py-6 text-base shadow-professional hover:shadow-dramatic transition-all duration-300 hover:-translate-y-0.5 bg-primary hover:bg-primary-glow animate-fade-in"
                style={{ animationDelay: '0.4s' }}
                asChild
              >
                <a
                  href={`${import.meta.env.BASE_URL}resume.pdf`}
                  download="Jakob_Gabriel_Resume.pdf"
                  onClick={() => trackDownload('resume.pdf', 'pdf')}
                >
                  <FileText className="w-5 h-5 mr-2" />
                  {t('hero.downloadResume')}
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Scroll down indicator */}
      <button
        onClick={scrollToTimeline}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer group animate-bounce-gentle"
        aria-label="Scroll to experience section"
      >
        <div className="p-2 rounded-full border border-border/50 bg-background/50 backdrop-blur-sm group-hover:border-primary group-hover:bg-primary/5 transition-all duration-300 flex items-center justify-center">
          <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
        </div>
      </button>
    </section>
  );
};