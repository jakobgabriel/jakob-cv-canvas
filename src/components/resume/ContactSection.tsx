import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { config } from "@/data/config";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Send, Loader2, User, MessageSquare, FileText, Calendar, Linkedin, CheckCircle2, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { getResumeData } from "@/data/resume";

export const ContactSection = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { trackFormInteraction } = useAnalytics();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    trackFormInteraction('submit', 'contact');

    if (!config?.features.contactForm.enabled || !config?.features.contactForm.recipientEmail) {
      toast({
        title: t('contact.form.disabledTitle'),
        description: t('contact.form.disabledDescription'),
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${config.features.contactForm.recipientEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          _subject: formData.subject || 'New contact form submission',
          message: formData.message,
          _template: 'table'
        }),
      });

      const result = await response.json();

      if (result.success) {
        trackFormInteraction('success', 'contact');
        setIsSuccess(true);
        toast({
          title: t('contact.form.successTitle'),
          description: t('contact.form.successDescription'),
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      trackFormInteraction('error', 'contact');
      toast({
        title: t('contact.form.errorTitle'),
        description: t('contact.form.errorDescription'),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldFocus = (fieldName: string) => {
    setFocusedField(fieldName);
    trackFormInteraction('focus', 'contact');
  };

  const handleFieldBlur = () => {
    setFocusedField(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactMethods = [
    {
      icon: Mail,
      label: 'Email',
      value: resumeData.basics?.email || 'Contact via email',
      href: `mailto:${resumeData.basics?.email}`,
      color: 'text-blue-500'
    },
    {
      icon: Calendar,
      label: 'Schedule a Call',
      value: 'Book via Calendly',
      href: 'https://calendly.com/jakob-gabriel',
      color: 'text-emerald-500'
    },
    ...(linkedinProfile ? [{
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'Connect on LinkedIn',
      href: linkedinProfile.url,
      color: 'text-sky-500'
    }] : [])
  ];

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            {t('contact.letsTalk') || "Let's Talk"}
          </div>
          <h2 className="text-3xl lg:text-4xl font-display font-medium tracking-tight mb-4">
            {t('contact.getInTouch')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('contact.contactDescription')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Contact Methods Sidebar */}
            <div className={`lg:col-span-2 space-y-4 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h3 className="text-lg font-medium mb-6">{t('contact.otherWays') || 'Other ways to connect'}</h3>

              {contactMethods.map((method, index) => (
                <a
                  key={method.label}
                  href={method.href}
                  target={method.href.startsWith('http') ? '_blank' : undefined}
                  rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={`flex items-center gap-4 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 hover:shadow-professional transition-all duration-300 group stagger-item`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`p-3 rounded-lg bg-background/80 ${method.color} group-hover:scale-110 transition-transform duration-300`}>
                    <method.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground">{method.label}</p>
                    <p className="font-medium truncate">{method.value}</p>
                  </div>
                </a>
              ))}

              {/* Quick response badge */}
              <div className="mt-6 p-4 rounded-xl bg-gradient-accent border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-sm text-muted-foreground">
                    {t('contact.responseTime') || 'Usually responds within 24 hours'}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className={`lg:col-span-3 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <Card className="p-6 sm:p-8 bg-card/50 backdrop-blur-sm border-border/50 shadow-professional relative overflow-hidden">
                {/* Success overlay */}
                {isSuccess && (
                  <div className="absolute inset-0 bg-card/95 backdrop-blur-sm flex flex-col items-center justify-center z-10 animate-in fade-in duration-300">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">{t('contact.form.successTitle')}</h3>
                    <p className="text-muted-foreground text-center max-w-xs">
                      {t('contact.form.successDescription')}
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Name Field */}
                    <div className={`relative transition-all duration-300 ${focusedField === 'name' ? 'scale-[1.02]' : ''}`}>
                      <label className="text-sm font-medium mb-2 block text-foreground">
                        {t('contact.form.name')}
                      </label>
                      <div className="relative">
                        <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${focusedField === 'name' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          onFocus={() => handleFieldFocus('name')}
                          onBlur={handleFieldBlur}
                          placeholder={t('contact.form.namePlaceholder')}
                          className="pl-10 bg-background/50 border-border/50 transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                          required
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.02]' : ''}`}>
                      <label className="text-sm font-medium mb-2 block text-foreground">
                        {t('contact.form.email')}
                      </label>
                      <div className="relative">
                        <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${focusedField === 'email' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          onFocus={() => handleFieldFocus('email')}
                          onBlur={handleFieldBlur}
                          placeholder={t('contact.form.emailPlaceholder')}
                          className="pl-10 bg-background/50 border-border/50 transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subject Field */}
                  <div className={`relative transition-all duration-300 ${focusedField === 'subject' ? 'scale-[1.02]' : ''}`}>
                    <label className="text-sm font-medium mb-2 block text-foreground">
                      {t('contact.form.subject')}
                    </label>
                    <div className="relative">
                      <FileText className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${focusedField === 'subject' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        onFocus={() => handleFieldFocus('subject')}
                        onBlur={handleFieldBlur}
                        placeholder={t('contact.form.subjectPlaceholder')}
                        className="pl-10 bg-background/50 border-border/50 transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className={`relative transition-all duration-300 ${focusedField === 'message' ? 'scale-[1.02]' : ''}`}>
                    <label className="text-sm font-medium mb-2 block text-foreground">
                      {t('contact.form.message')}
                    </label>
                    <div className="relative">
                      <MessageSquare className={`absolute left-3 top-3 w-4 h-4 transition-colors duration-300 ${focusedField === 'message' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        onFocus={() => handleFieldFocus('message')}
                        onBlur={handleFieldBlur}
                        placeholder={t('contact.form.messagePlaceholder')}
                        rows={5}
                        className="pl-10 bg-background/50 border-border/50 resize-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full shadow-professional transition-all duration-300 hover:shadow-dramatic hover:scale-[1.02] active:scale-[0.98]"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    {isSubmitting ? t('contact.form.sending') : t('contact.form.sendMessage')}
                  </Button>

                  {!config?.features.contactForm.enabled && (
                    <p className="text-sm text-muted-foreground text-center">
                      {t('contact.form.disabledNotice')}
                    </p>
                  )}
                </form>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};