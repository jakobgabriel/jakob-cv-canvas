import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useConfig } from "@/hooks/useConfig";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { useState } from "react";

export const ContactSection = () => {
  const { config, loading } = useConfig();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!config?.features.contactForm.enabled) {
      toast({
        title: t('contact.form.disabledTitle'),
        description: t('contact.form.disabledDescription'),
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(config.features.contactForm.formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      if (response.ok) {
        toast({
          title: t('contact.form.successTitle'),
          description: t('contact.form.successDescription'),
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
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
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (loading) {
    return <div className="py-24 text-center">{t('loading')}</div>;
  }

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-display font-medium tracking-tight mb-4">
            {t('contact.getInTouch')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('contact.contactDescription')}
          </p>
        </div>
        
        <div className="max-w-xl mx-auto">
          <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50 shadow-professional">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">{t('contact.form.name')}</label>
                  <Input 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={t('contact.form.namePlaceholder')} 
                    className="bg-background/50 border-border/50 transition-smooth focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">{t('contact.form.email')}</label>
                  <Input 
                    name="email"
                    type="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t('contact.form.emailPlaceholder')} 
                    className="bg-background/50 border-border/50 transition-smooth focus:border-primary"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block text-foreground">{t('contact.form.subject')}</label>
                <Input 
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder={t('contact.form.subjectPlaceholder')} 
                  className="bg-background/50 border-border/50 transition-smooth focus:border-primary"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block text-foreground">{t('contact.form.message')}</label>
                <Textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={t('contact.form.messagePlaceholder')}
                  rows={4}
                  className="bg-background/50 border-border/50 resize-none transition-smooth focus:border-primary"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full shadow-professional transition-smooth hover:shadow-dramatic" 
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
    </section>
  );
};