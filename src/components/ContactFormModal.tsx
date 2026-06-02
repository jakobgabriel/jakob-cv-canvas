import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { config } from "@/data/config";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Mail, Send, Loader2, User, MessageSquare, FileText,
  X, Building2, Phone, CheckCircle2, AlertCircle
} from "lucide-react";
import { useState, useCallback, useEffect, useRef } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useContactForm } from "@/contexts/ContactFormContext";

interface ValidationErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const ContactFormModal = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { trackFormInteraction } = useAnalytics();
  const { isOpen, close: closeModal } = useContactForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: ''
  });

  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Reset transient form state and restore focus (via the context) on close.
  const close = useCallback(() => {
    setIsSuccess(false);
    setErrors({});
    setTouched({});
    closeModal();
  }, [closeModal]);

  // Body scroll lock when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Focus trap and keyboard handling
  useEffect(() => {
    if (!isOpen) return;

    // Focus the close button when modal opens
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 100);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close
      if (e.key === 'Escape') {
        close();
        return;
      }

      // Tab trap
      if (e.key === 'Tab' && panelRef.current) {
        const focusableElements = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close]);

  const validate = (data: typeof formData): ValidationErrors => {
    const errs: ValidationErrors = {};
    if (!data.name.trim()) {
      errs.name = language === 'de' ? 'Name ist erforderlich' : 'Name is required';
    }
    if (!data.email.trim()) {
      errs.email = language === 'de' ? 'E-Mail ist erforderlich' : 'Email is required';
    } else if (!validateEmail(data.email)) {
      errs.email = language === 'de' ? 'Ungültige E-Mail-Adresse' : 'Invalid email address';
    }
    if (!data.subject.trim()) {
      errs.subject = language === 'de' ? 'Betreff ist erforderlich' : 'Subject is required';
    }
    if (!data.message.trim()) {
      errs.message = language === 'de' ? 'Nachricht ist erforderlich' : 'Message is required';
    } else if (data.message.trim().length < 10) {
      errs.message = language === 'de' ? 'Nachricht muss mindestens 10 Zeichen lang sein' : 'Message must be at least 10 characters';
    }
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    trackFormInteraction('submit', 'contact');

    // Mark all required fields as touched
    setTouched({ name: true, email: true, subject: true, message: true });

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // Focus the first field with an error
      const firstErrorField = Object.keys(validationErrors)[0];
      const errorInput = panelRef.current?.querySelector<HTMLElement>(`[name="${firstErrorField}"]`);
      errorInput?.focus();
      return;
    }

    if (!config?.features.contactForm.enabled || !config?.features.contactForm.recipientEmail) {
      toast({
        title: t('contact.form.disabledTitle'),
        description: t('contact.form.disabledDescription'),
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Abort the request if it hangs so the button can't get stuck in "Sending…".
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

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
        signal: controller.signal,
      });

      const result = await response.json();

      if (result.success) {
        trackFormInteraction('success', 'contact');
        setIsSuccess(true);
        setFormData({ name: '', email: '', company: '', phone: '', subject: '', message: '' });
        setErrors({});
        setTouched({});
      } else {
        throw new Error('Failed to send message');
      }
    } catch {
      // Covers network failures, non-success responses and aborts (timeout).
      trackFormInteraction('error', 'contact');
      toast({
        title: t('contact.form.errorTitle'),
        description: t('contact.form.errorDescription'),
        variant: "destructive"
      });
    } finally {
      clearTimeout(timeoutId);
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    // Re-validate touched fields on change
    if (touched[name]) {
      const fieldErrors = validate(updated);
      setErrors(prev => ({
        ...prev,
        [name]: fieldErrors[name as keyof ValidationErrors]
      }));
    }
  };

  const handleBlur = (fieldName: string) => {
    setFocusedField(null);
    setTouched(prev => ({ ...prev, [fieldName]: true }));

    // Validate the field on blur
    const fieldErrors = validate(formData);
    setErrors(prev => ({
      ...prev,
      [fieldName]: fieldErrors[fieldName as keyof ValidationErrors]
    }));
  };

  if (!isOpen) return null;

  const fieldError = (name: keyof ValidationErrors) => {
    if (!touched[name] || !errors[name]) return null;
    return (
      <p className="flex items-center gap-1 text-xs text-destructive mt-1" role="alert">
        <AlertCircle className="w-3 h-3 flex-shrink-0" />
        {errors[name]}
      </p>
    );
  };

  const fieldBorderClass = (name: keyof ValidationErrors) => {
    if (touched[name] && errors[name]) {
      return 'border-destructive focus:border-destructive focus:ring-destructive/20';
    }
    return 'border-border/50 focus:border-primary focus:ring-primary/20';
  };

  return (
    <div
      className="fixed inset-0 z-50 transition-all duration-300 opacity-100 pointer-events-auto"
      role="dialog"
      aria-modal="true"
      aria-label={language === 'de' ? 'Kontaktformular' : 'Contact form'}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />

      {/* Modal Panel */}
      <div
        ref={panelRef}
        className="absolute right-0 top-0 h-full w-full max-w-lg bg-card border-l shadow-dramatic transform transition-transform duration-300 translate-x-0 overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium" id="contact-modal-title">
                {language === 'de' ? 'Nachricht senden' : 'Send a Message'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === 'de' ? 'Antwort innerhalb von 24h' : 'Response within 24h'}
              </p>
            </div>
          </div>
          <Button
            ref={closeButtonRef}
            variant="ghost"
            size="sm"
            onClick={close}
            aria-label={language === 'de' ? 'Schließen' : 'Close'}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4" role="status">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
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
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label htmlFor="contact-name" className="text-sm font-medium mb-2 block">
                    {t('contact.form.name')} <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedField === 'name' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <Input
                      id="contact-name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => handleBlur('name')}
                      placeholder={t('contact.form.namePlaceholder')}
                      className={`pl-10 bg-background/50 focus:ring-2 ${fieldBorderClass('name')}`}
                      aria-required="true"
                      aria-invalid={touched.name && !!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                  </div>
                  {fieldError('name')}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="contact-email" className="text-sm font-medium mb-2 block">
                    {t('contact.form.email')} <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedField === 'email' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <Input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => handleBlur('email')}
                      placeholder={t('contact.form.emailPlaceholder')}
                      className={`pl-10 bg-background/50 focus:ring-2 ${fieldBorderClass('email')}`}
                      aria-required="true"
                      aria-invalid={touched.email && !!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                  </div>
                  {fieldError('email')}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Company */}
                <div>
                  <label htmlFor="contact-company" className="text-sm font-medium mb-2 block">
                    {language === 'de' ? 'Unternehmen' : 'Company'}
                  </label>
                  <div className="relative">
                    <Building2 className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedField === 'company' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <Input
                      id="contact-company"
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
                  <label htmlFor="contact-phone" className="text-sm font-medium mb-2 block">
                    {language === 'de' ? 'Telefon' : 'Phone'}
                  </label>
                  <div className="relative">
                    <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedField === 'phone' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <Input
                      id="contact-phone"
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
                <label htmlFor="contact-subject" className="text-sm font-medium mb-2 block">
                  {t('contact.form.subject')} <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <FileText className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedField === 'subject' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <Input
                    id="contact-subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('subject')}
                    onBlur={() => handleBlur('subject')}
                    placeholder={t('contact.form.subjectPlaceholder')}
                    className={`pl-10 bg-background/50 focus:ring-2 ${fieldBorderClass('subject')}`}
                    aria-required="true"
                    aria-invalid={touched.subject && !!errors.subject}
                    aria-describedby={errors.subject ? 'subject-error' : undefined}
                  />
                </div>
                {fieldError('subject')}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="contact-message" className="text-sm font-medium mb-2 block">
                  {t('contact.form.message')} <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <MessageSquare className={`absolute left-3 top-3 w-4 h-4 transition-colors ${focusedField === 'message' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <Textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => handleBlur('message')}
                    placeholder={t('contact.form.messagePlaceholder')}
                    rows={5}
                    className={`pl-10 bg-background/50 resize-none focus:ring-2 ${fieldBorderClass('message')}`}
                    aria-required="true"
                    aria-invalid={touched.message && !!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  />
                </div>
                {fieldError('message')}
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
