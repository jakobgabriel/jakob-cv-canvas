import { Button } from "@/components/ui/button";
import { LinkedinIcon, Github, Mail, FileText, MapPin, Phone, Globe } from "lucide-react";
import jakobPortrait from "@/assets/jakob-portrait.jpeg";
import { useJsonResume } from "@/hooks/useJsonResume";
import { useConfig } from "@/hooks/useConfig";
import { useLanguage } from "@/contexts/LanguageContext";

export const HeroSection = () => {
  const { data: resumeData, loading: resumeLoading } = useJsonResume();
  const { config, loading: configLoading } = useConfig();
  const { t } = useLanguage();

  if (resumeLoading || configLoading || !resumeData || !config) {
    return <div className="min-h-screen flex items-center justify-center">{t('loading')}</div>;
  }

  const { basics } = resumeData;
  const linkedinProfile = basics.profiles.find(p => p.network === 'LinkedIn');
  const githubProfile = basics.profiles.find(p => p.network === 'GitHub');

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-subtle">
      {/* Minimal geometric accent */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-px h-40 bg-gradient-to-b from-primary/20 to-transparent"></div>
        <div className="absolute bottom-20 left-20 w-40 h-px bg-gradient-to-r from-primary/20 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Portrait - Minimal and Professional */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden shadow-professional border border-border/50">
                <img 
                  src={jakobPortrait} 
                  alt={basics.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
          {/* Content - Clean Typography */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-display font-medium tracking-tight">
                {basics.name}
              </h1>
              <h2 className="text-xl lg:text-2xl text-muted-foreground font-light">
                {basics.label}
              </h2>
            </div>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {basics.summary}
            </p>

            {/* Contact Info - Minimal */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {basics.location.city}, {basics.location.region}
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {basics.url}
              </div>
            </div>
            
            {/* Social Links - Professional Style */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                variant="outline" 
                size="sm"
                className="border-border/50 hover:border-primary transition-smooth"
                asChild
              >
                <a 
                  href={linkedinProfile?.url}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <LinkedinIcon className="w-4 h-4" />
                  LinkedIn
                </a>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="border-border/50 hover:border-primary transition-smooth"
                asChild
              >
                <a 
                  href={githubProfile?.url}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="border-border/50 hover:border-primary transition-smooth"
                asChild
              >
                <a 
                  href={`mailto:${basics.email}`}
                  className="flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </a>
              </Button>
            </div>
            
            {config.features.downloadResume.enabled && (
              <Button 
                size="lg" 
                className="px-8 py-3 shadow-professional transition-smooth hover:shadow-dramatic"
              >
                <FileText className="w-4 h-4 mr-2" />
                {t('hero.downloadResume')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};