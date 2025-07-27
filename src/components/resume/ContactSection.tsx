import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useConfig } from "@/hooks/useConfig";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { useState } from "react";

export const ContactSection = () => {
  const { config, loading } = useConfig();
  const { toast } = useToast();
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
        title: "Contact form disabled",
        description: "The contact form is currently disabled. Please use the email link instead.",
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
          title: "Message sent successfully!",
          description: "Thank you for your message. I'll get back to you soon.",
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "There was an error sending your message. Please try again or contact me directly via email.",
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
    return <div className="py-24 text-center">Loading...</div>;
  }

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-display font-medium tracking-tight mb-4">
            Get In Touch
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Interested in discussing digital transformation opportunities?
          </p>
        </div>
        
        <div className="max-w-xl mx-auto">
          <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50 shadow-professional">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">Name</label>
                  <Input 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your name" 
                    className="bg-background/50 border-border/50 transition-smooth focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">Email</label>
                  <Input 
                    name="email"
                    type="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@company.com" 
                    className="bg-background/50 border-border/50 transition-smooth focus:border-primary"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block text-foreground">Subject</label>
                <Input 
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Partnership opportunity" 
                  className="bg-background/50 border-border/50 transition-smooth focus:border-primary"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block text-foreground">Message</label>
                <Textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell me about your digital transformation needs..."
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
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
              
              {!config?.features.contactForm.enabled && (
                <p className="text-sm text-muted-foreground text-center">
                  Contact form is currently disabled. Please use the email link above.
                </p>
              )}
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};