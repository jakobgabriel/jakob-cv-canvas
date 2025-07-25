import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export const ContactSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            Let's{" "}
            <span className="text-gradient">Connect</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to discuss your next digital transformation project?
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border shadow-dramatic">
              <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Email</div>
                    <a 
                      href="mailto:jakob.gabriel5@googlemail.com" 
                      className="text-primary hover:underline"
                    >
                      jakob.gabriel5@googlemail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Phone</div>
                    <span className="text-muted-foreground">Available upon request</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Location</div>
                    <span className="text-muted-foreground">Germany</span>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border shadow-dramatic">
              <h3 className="text-xl font-bold mb-4">Professional Focus</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">▸</span>
                  Digital Transformation Strategy
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">▸</span>
                  Business Value Engineering
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">▸</span>
                  Technology Leadership
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">▸</span>
                  Process Optimization
                </li>
              </ul>
            </Card>
          </div>
          
          {/* Contact Form */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border shadow-dramatic">
            <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Name</label>
                  <Input 
                    placeholder="Your name" 
                    className="bg-background/50 border-border"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input 
                    type="email" 
                    placeholder="your.email@example.com" 
                    className="bg-background/50 border-border"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Subject</label>
                <Input 
                  placeholder="Project discussion" 
                  className="bg-background/50 border-border"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Message</label>
                <Textarea 
                  placeholder="Tell me about your project or how I can help..."
                  rows={5}
                  className="bg-background/50 border-border resize-none"
                />
              </div>
              
              <Button className="w-full group" size="lg">
                <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-smooth" />
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};