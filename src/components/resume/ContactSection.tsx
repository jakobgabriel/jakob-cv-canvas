import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Calendar, Linkedin, MessageSquare, ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getResumeData } from "@/data/resume";
import { Link } from "react-router-dom";
import { useCalendly } from "@/hooks/useCalendly";

export const ContactSection = () => {
  const { t, language } = useLanguage();
  const { openCalendly } = useCalendly();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const resumeData = getResumeData(language);
  const linkedinProfile = resumeData.basics?.profiles?.find(p => p.network?.toLowerCase() === 'linkedin');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const contactMethods = [
    {
      icon: Mail,
      label: 'Email',
      value: resumeData.basics?.email || '',
      href: `mailto:${resumeData.basics?.email}`,
      color: 'text-blue-500 bg-blue-500/10',
      onClick: undefined as (() => void) | undefined
    },
    {
      icon: Calendar,
      label: language === 'de' ? 'Termin buchen' : 'Book a Call',
      value: 'Calendly',
      href: undefined as string | undefined,
      color: 'text-emerald-500 bg-emerald-500/10',
      onClick: openCalendly
    },
    ...(linkedinProfile ? [{
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'Connect',
      href: linkedinProfile.url,
      color: 'text-sky-500 bg-sky-500/10',
      onClick: undefined as (() => void) | undefined
    }] : [])
  ];

  return (
    <section ref={sectionRef} id="contact" className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative">
        <div className={`text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl lg:text-4xl font-display font-medium tracking-tight mb-4">
            {t('contact.getInTouch')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            {t('contact.contactDescription')}
          </p>

          {/* Contact options in a row */}
          <div className={`flex flex-wrap justify-center gap-3 mb-10 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {contactMethods.map((method) => (
              method.onClick ? (
                <button
                  key={method.label}
                  onClick={method.onClick}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-professional transition-all duration-300 group cursor-pointer"
                >
                  <div className={`p-1.5 rounded-full ${method.color}`}>
                    <method.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{method.label}</span>
                </button>
              ) : (
                <a
                  key={method.label}
                  href={method.href}
                  target={method.href?.startsWith('http') ? '_blank' : undefined}
                  rel={method.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-professional transition-all duration-300 group"
                >
                  <div className={`p-1.5 rounded-full ${method.color}`}>
                    <method.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{method.label}</span>
                </a>
              )
            ))}
          </div>

          {/* Main CTA button */}
          <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Button
              asChild
              size="lg"
              className="px-8 py-6 text-base shadow-professional hover:shadow-dramatic transition-all duration-300 hover:-translate-y-0.5 group"
            >
              <Link to="/contact" className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                {language === 'de' ? 'Nachricht senden' : 'Send a Message'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            {/* Response time indicator */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-sm text-muted-foreground">
                {t('contact.responseTime')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
