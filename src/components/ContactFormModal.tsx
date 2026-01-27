import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { config } from "@/data/config";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Mail, Send, Loader2, User, MessageSquare, FileText,
  X, Building2, Phone, CheckCircle2
} from "lucide-react";
import { useState, useCallback } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";

let openContactFormFn: (() => void) | null = null;

export const openContactForm = () => {
  openContactFormFn?.();
};

export const ContactFormModal = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { trackFormInteraction } = useAnalytics();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: ''
  });

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setIsSuccess(false);
  }, []);

  // Register the open function globally
  openContactFormFn = open;

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
          message: formData.message,
          _template: 'table'
        }),
      });

      const result = await response.json();

      if (result.success) {
        trackFormInteraction('success', 'contact');
        setIsSuccess(true);
        setFormData({ name: '', email: '', company: '', phone: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 transition-all duration-300 opacity-100 pointer-events-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={close}
      />

      {/* Modal Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-card border-l shadow-dramatic transform transition-transform duration-300 translate-x-0 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">
                {language === 'de' ? 'Nachricht senden' : 'Send a Message'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === 'de' ? 'Antwort innerhalb von 24h' : 'Response within 24h'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={close}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-medium">{t('contact.form.successTitle')}</h3>
              <p className="text-muted-foreground max-w-xs">
                {t('contact.form.successDescription')}
              </p>
              <Button variant="outline" onClick={close} className="mt-4">
                {language === 'de' ? 'Schließen' : 'Close'}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('contact.form.name')} *</label>
                  <div className="relative">
                    <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedField === 'name' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      placeholder={t('contact.form.namePlaceholder')}
                      className="pl-10 bg-background/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('contact.form.email')} *</label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedField === 'email' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder={t('contact.form.emailPlaceholder')}
                      className="pl-10 bg-background/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Company */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {language === 'de' ? 'Unternehmen' : 'Company'}
                  </label>
                  <div className="relative">
                    <Building2 className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedField === 'company' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <Input
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('company')}
                      onBlur={() => setFocusedField(null)}
                      placeholder={language === 'de' ? 'Ihr Unternehmen' : 'Your company'}
                      className="pl-10 bg-background/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
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
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="+49 123 456789"
                      className="pl-10 bg-background/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="text-sm font-medium mb-2 block">{t('contact.form.subject')} *</label>
                <div className="relative">
                  <FileText className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedField === 'subject' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('subject')}
                    onBlur={() => setFocusedField(null)}
                    placeholder={t('contact.form.subjectPlaceholder')}
                    className="pl-10 bg-background/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-sm font-medium mb-2 block">{t('contact.form.message')} *</label>
                <div className="relative">
                  <MessageSquare className={`absolute left-3 top-3 w-4 h-4 transition-colors ${focusedField === 'message' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    placeholder={t('contact.form.messagePlaceholder')}
                    rows={5}
                    className="pl-10 bg-background/50 border-border/50 resize-none focus:border-primary focus:ring-2 focus:ring-primary/20"
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
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
