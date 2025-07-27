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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Diagonal geometric shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-br from-primary/20 to-transparent transform skew-x-12 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-2/3 bg-gradient-to-tr from-primary/10 to-transparent transform -skew-x-12 -translate-x-1/4"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-12">
          {/* Portrait */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-geometric-accent rounded-full blur-lg opacity-20"></div>
              <div className="relative w-40 h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden shadow-dramatic border-4 border-primary">
                <img 
                  src={jakobPortrait} 
                  alt={basics.name} 
                  className="w-full h-full object-cover transition-smooth hover:scale-110"
                />
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="space-y-8 max-w-4xl">
            <div className="space-y-4">
              <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                {basics.name.split(' ')[0]}{" "}
                <span className="text-gradient">{basics.name.split(' ').slice(1).join(' ')}</span>
              </h1>
              <h2 className="text-2xl lg:text-3xl font-light text-muted-foreground">
                {basics.label}
              </h2>
            </div>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {basics.summary}
            </p>

            {/* Contact Info */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {basics.location.city}, {basics.location.region}
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {basics.url}
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                variant="social" 
                size="lg"
                className="group"
                asChild
              >
                <a 
                  href={linkedinProfile?.url}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <LinkedinIcon className="w-5 h-5 group-hover:scale-110 transition-smooth" />
                  LinkedIn
                </a>
              </Button>
              
              <Button 
                variant="social" 
                size="lg"
                className="group"
                asChild
              >
                <a 
                  href={githubProfile?.url}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github className="w-5 h-5 group-hover:scale-110 transition-smooth" />
                  GitHub
                </a>
              </Button>
              
              <Button 
                variant="social" 
                size="lg"
                className="group"
                asChild
              >
                <a 
                  href={`mailto:${basics.email}`}
                  className="flex items-center gap-2"
                >
                  <Mail className="w-5 h-5 group-hover:scale-110 transition-smooth" />
                  Email
                </a>
              </Button>
            </div>
            
            {config.features.downloadResume.enabled && (
              <Button size="lg" className="group text-lg px-8 py-6">
                <FileText className="w-5 h-5 mr-2 group-hover:scale-110 transition-smooth" />
                {t('hero.downloadResume')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};