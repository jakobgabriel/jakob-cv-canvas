import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { config } from "@/data/config";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Mail, Send, Loader2, User, MessageSquare, FileText,
  Calendar, Linkedin, CheckCircle2, ArrowLeft, Building2,
  Phone, Globe, Briefcase, Target, Clock
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { getResumeData } from "@/data/resume";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

const Contact = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { trackFormInteraction } = useAnalytics();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: ''
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const resumeData = getResumeData(language);
  const linkedinProfile = resumeData.basics?.profiles?.find(p => p.network?.toLowerCase() === 'linkedin');

  useEffect(() => {
    setIsVisible(true);
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
          company: formData.company || 'Not provided',
          phone: formData.phone || 'Not provided',
          _subject: formData.subject || 'New contact form submission',
          'Project Type': formData.projectType || 'Not specified',
          'Budget Range': formData.budget || 'Not specified',
          'Timeline': formData.timeline || 'Not specified',
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
        setFormData({
          name: '', email: '', company: '', phone: '',
          subject: '', projectType: '', budget: '', timeline: '', message: ''
        });
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const projectTypes = [
    { value: '', label: language === 'de' ? 'Projektart auswählen' : 'Select project type' },
    { value: 'consulting', label: language === 'de' ? 'Beratung' : 'Consulting' },
    { value: 'digital-transformation', label: language === 'de' ? 'Digitale Transformation' : 'Digital Transformation' },
    { value: 'process-optimization', label: language === 'de' ? 'Prozessoptimierung' : 'Process Optimization' },
    { value: 'data-analytics', label: language === 'de' ? 'Datenanalyse' : 'Data Analytics' },
    { value: 'industry-4.0', label: language === 'de' ? 'Industrie 4.0' : 'Industry 4.0' },
    { value: 'other', label: language === 'de' ? 'Sonstiges' : 'Other' }
  ];

  const budgetRanges = [
    { value: '', label: language === 'de' ? 'Budget auswählen' : 'Select budget range' },
    { value: 'under-10k', label: language === 'de' ? 'Unter 10.000€' : 'Under €10,000' },
    { value: '10k-25k', label: '€10,000 - €25,000' },
    { value: '25k-50k', label: '€25,000 - €50,000' },
    { value: '50k-100k', label: '€50,000 - €100,000' },
    { value: 'over-100k', label: language === 'de' ? 'Über 100.000€' : 'Over €100,000' },
    { value: 'discuss', label: language === 'de' ? 'Besprechen' : 'To be discussed' }
  ];

  const timelines = [
    { value: '', label: language === 'de' ? 'Zeitrahmen auswählen' : 'Select timeline' },
    { value: 'asap', label: language === 'de' ? 'So bald wie möglich' : 'As soon as possible' },
    { value: '1-3-months', label: language === 'de' ? '1-3 Monate' : '1-3 months' },
    { value: '3-6-months', label: language === 'de' ? '3-6 Monate' : '3-6 months' },
    { value: '6-12-months', label: language === 'de' ? '6-12 Monate' : '6-12 months' },
    { value: 'flexible', label: language === 'de' ? 'Flexibel' : 'Flexible' }
  ];

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
      label: language === 'de' ? 'Termin buchen' : 'Schedule a Call',
      value: 'Calendly',
      href: 'https://calendly.com/jakob-gabriel',
      color: 'text-emerald-500'
    },
    ...(linkedinProfile ? [{
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'Connect',
      href: linkedinProfile.url,
      color: 'text-sky-500'
    }] : [])
  ];

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-6 animate-in fade-in duration-500">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-display font-medium">{t('contact.form.successTitle')}</h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              {t('contact.form.successDescription')}
            </p>
          </div>
          <div className="pt-4">
            <Button asChild variant="outline" size="lg">
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                {language === 'de' ? 'Zurück zur Startseite' : 'Back to Home'}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">{language === 'de' ? 'Zurück' : 'Back'}</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-4xl lg:text-5xl font-display font-medium tracking-tight mb-4">
              {t('contact.getInTouch')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('contact.contactDescription')}
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Sidebar - Contact Methods */}
              <div className={`space-y-4 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <h3 className="text-lg font-medium mb-4">{t('contact.otherWays')}</h3>

                {contactMethods.map((method, index) => (
                  <a
                    key={method.label}
                    href={method.href}
                    target={method.href.startsWith('http') ? '_blank' : undefined}
                    rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-3 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 hover:shadow-professional transition-all duration-300 group"
                  >
                    <div className={`p-2.5 rounded-lg bg-background/80 ${method.color} group-hover:scale-110 transition-transform duration-300`}>
                      <method.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground">{method.label}</p>
                      <p className="font-medium text-sm truncate">{method.value}</p>
                    </div>
                  </a>
                ))}

                {/* Response time */}
                <div className="mt-6 p-4 rounded-xl bg-gradient-accent border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-sm text-muted-foreground">
                      {t('contact.responseTime')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className={`lg:col-span-2 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <Card className="p-6 sm:p-8 bg-card/50 backdrop-blur-sm border-border/50 shadow-professional">
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Info */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        {language === 'de' ? 'Ihre Informationen' : 'Your Information'}
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {/* Name */}
                        <div className={`relative transition-all duration-300 ${focusedField === 'name' ? 'scale-[1.02]' : ''}`}>
                          <label className="text-sm font-medium mb-2 block">{t('contact.form.name')} *</label>
                          <div className="relative">
                            <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedField === 'name' ? 'text-primary' : 'text-muted-foreground'}`} />
                            <Input
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              onFocus={() => handleFieldFocus('name')}
                              onBlur={handleFieldBlur}
                              placeholder={t('contact.form.namePlaceholder')}
                              className="pl-10 bg-background/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                              required
                            />
                          </div>
                        </div>

                        {/* Email */}
                        <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.02]' : ''}`}>
                          <label className="text-sm font-medium mb-2 block">{t('contact.form.email')} *</label>
                          <div className="relative">
                            <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedField === 'email' ? 'text-primary' : 'text-muted-foreground'}`} />
                            <Input
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              onFocus={() => handleFieldFocus('email')}
                              onBlur={handleFieldBlur}
                              placeholder={t('contact.form.emailPlaceholder')}
                              className="pl-10 bg-background/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                              required
                            />
                          </div>
                        </div>

                        {/* Company */}
                        <div className={`relative transition-all duration-300 ${focusedField === 'company' ? 'scale-[1.02]' : ''}`}>
                          <label className="text-sm font-medium mb-2 block">
                            {language === 'de' ? 'Unternehmen' : 'Company'}
                          </label>
                          <div className="relative">
                            <Building2 className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedField === 'company' ? 'text-primary' : 'text-muted-foreground'}`} />
                            <Input
                              name="company"
                              value={formData.company}
                              onChange={handleInputChange}
                              onFocus={() => handleFieldFocus('company')}
                              onBlur={handleFieldBlur}
                              placeholder={language === 'de' ? 'Ihr Unternehmen' : 'Your company'}
                              className="pl-10 bg-background/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        </div>

                        {/* Phone */}
                        <div className={`relative transition-all duration-300 ${focusedField === 'phone' ? 'scale-[1.02]' : ''}`}>
                          <label className="text-sm font-medium mb-2 block">
                            {language === 'de' ? 'Telefon' : 'Phone'}
                          </label>
                          <div className="relative">
                            <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedField === 'phone' ? 'text-primary' : 'text-muted-foreground'}`} />
                            <Input
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleInputChange}
                              onFocus={() => handleFieldFocus('phone')}
                              onBlur={handleFieldBlur}
                              placeholder={language === 'de' ? '+49 123 456789' : '+1 (555) 000-0000'}
                              className="pl-10 bg-background/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="space-y-4 pt-4 border-t border-border/50">
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        {language === 'de' ? 'Projektdetails' : 'Project Details'}
                      </h4>

                      {/* Subject */}
                      <div className={`relative transition-all duration-300 ${focusedField === 'subject' ? 'scale-[1.02]' : ''}`}>
                        <label className="text-sm font-medium mb-2 block">{t('contact.form.subject')} *</label>
                        <div className="relative">
                          <FileText className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedField === 'subject' ? 'text-primary' : 'text-muted-foreground'}`} />
                          <Input
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            onFocus={() => handleFieldFocus('subject')}
                            onBlur={handleFieldBlur}
                            placeholder={t('contact.form.subjectPlaceholder')}
                            className="pl-10 bg-background/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-4">
                        {/* Project Type */}
                        <div className={`relative transition-all duration-300 ${focusedField === 'projectType' ? 'scale-[1.02]' : ''}`}>
                          <label className="text-sm font-medium mb-2 block">
                            {language === 'de' ? 'Projektart' : 'Project Type'}
                          </label>
                          <div className="relative">
                            <Briefcase className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors pointer-events-none ${focusedField === 'projectType' ? 'text-primary' : 'text-muted-foreground'}`} />
                            <select
                              name="projectType"
                              value={formData.projectType}
                              onChange={handleInputChange}
                              onFocus={() => handleFieldFocus('projectType')}
                              onBlur={handleFieldBlur}
                              className="w-full h-10 pl-10 pr-4 rounded-md bg-background/50 border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm appearance-none cursor-pointer"
                            >
                              {projectTypes.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Budget */}
                        <div className={`relative transition-all duration-300 ${focusedField === 'budget' ? 'scale-[1.02]' : ''}`}>
                          <label className="text-sm font-medium mb-2 block">
                            {language === 'de' ? 'Budget' : 'Budget'}
                          </label>
                          <div className="relative">
                            <Target className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors pointer-events-none ${focusedField === 'budget' ? 'text-primary' : 'text-muted-foreground'}`} />
                            <select
                              name="budget"
                              value={formData.budget}
                              onChange={handleInputChange}
                              onFocus={() => handleFieldFocus('budget')}
                              onBlur={handleFieldBlur}
                              className="w-full h-10 pl-10 pr-4 rounded-md bg-background/50 border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm appearance-none cursor-pointer"
                            >
                              {budgetRanges.map(range => (
                                <option key={range.value} value={range.value}>{range.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className={`relative transition-all duration-300 ${focusedField === 'timeline' ? 'scale-[1.02]' : ''}`}>
                          <label className="text-sm font-medium mb-2 block">
                            {language === 'de' ? 'Zeitrahmen' : 'Timeline'}
                          </label>
                          <div className="relative">
                            <Clock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors pointer-events-none ${focusedField === 'timeline' ? 'text-primary' : 'text-muted-foreground'}`} />
                            <select
                              name="timeline"
                              value={formData.timeline}
                              onChange={handleInputChange}
                              onFocus={() => handleFieldFocus('timeline')}
                              onBlur={handleFieldBlur}
                              className="w-full h-10 pl-10 pr-4 rounded-md bg-background/50 border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm appearance-none cursor-pointer"
                            >
                              {timelines.map(tl => (
                                <option key={tl.value} value={tl.value}>{tl.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Message */}
                      <div className={`relative transition-all duration-300 ${focusedField === 'message' ? 'scale-[1.02]' : ''}`}>
                        <label className="text-sm font-medium mb-2 block">{t('contact.form.message')} *</label>
                        <div className="relative">
                          <MessageSquare className={`absolute left-3 top-3 w-4 h-4 transition-colors ${focusedField === 'message' ? 'text-primary' : 'text-muted-foreground'}`} />
                          <Textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            onFocus={() => handleFieldFocus('message')}
                            onBlur={handleFieldBlur}
                            placeholder={t('contact.form.messagePlaceholder')}
                            rows={5}
                            className="pl-10 bg-background/50 border-border/50 resize-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            required
                          />
                        </div>
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
                  </form>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
