import { Button } from "@/components/ui/button";
import { LinkedinIcon, Github, Mail, FileText, MapPin, Phone, Globe, Twitter, Instagram, Facebook, Youtube, Camera, ExternalLink, Briefcase, Loader2 } from "lucide-react";
import jakobPortrait from "@/assets/jakob-portrait.jpeg";
import { config } from "@/data/config";
import { getResumeData } from "@/data/resume";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAnalytics } from "@/hooks/useAnalytics";
import { usePDFDownload } from "@/hooks/usePDFDownload";
import { toast } from "@/hooks/use-toast";

export const HeroSection = () => {
  const { language, t } = useLanguage();
  const { trackSocialClick, trackDownload, trackExternalLink } = useAnalytics();
  const resumeData = getResumeData(language);
  const { generatePDF, isGenerating } = usePDFDownload({ language });

  const handleDownload = async () => {
    trackDownload('resume.pdf', 'pdf');
    await generatePDF();
    toast({
      title: t('hero.downloadSuccess') || 'Download Started',
      description: t('hero.downloadDescription') || 'Your resume PDF is being generated.',
    });
  };

  if (!resumeData || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-lg text-muted-foreground">{t('loading')}</div>
      </div>
    );
  }

  const { basics } = resumeData;
  
  // Define profile configurations for the 10 most common platforms
  const profileConfigs = {
    'LinkedIn': { icon: LinkedinIcon, color: 'text-blue-600' },
    'GitHub': { icon: Github, color: 'text-gray-900 dark:text-gray-100' },
    'Twitter': { icon: Twitter, color: 'text-blue-400' },
    'X': { 
      icon: () => (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ), 
      color: 'text-gray-900 dark:text-gray-100' 
    },
    'Instagram': { icon: Instagram, color: 'text-pink-600' },
    'Facebook': { icon: Facebook, color: 'text-blue-600' },
    'YouTube': { icon: Youtube, color: 'text-red-600' },
    'Portfolio': { icon: ExternalLink, color: 'text-purple-600' },
    'Website': { icon: Globe, color: 'text-green-600' },
    'XING': { 
      icon: () => (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.188 0c-.517 0-.741.325-.927.66 0 0-7.455 13.224-7.702 13.657.284.552 4.727 8.58 4.727 8.58.186.335.517.66.927.66h3.905c.74 0 .927-.558.927-.558 0-.182-.239-.517-.239-.517l-4.683-8.326s7.647-13.567 7.647-13.567c.018-.036.018-.073.018-.11C22.789.29 22.506 0 22.506 0h-4.318zm-14.1 6.429c-.741 0-.927.558-.927.558 0 .181.239.517.239.517l2.623 4.797s-2.987 5.51-2.987 5.51c-.018.036-.018.073-.018.11 0 .558.284.848.284.848h4.318c.517 0 .741-.325.927-.66 0 0 3.041-5.619 3.041-5.619l-2.623-4.797s-.239-.517-.239-.517c-.186-.335-.517-.66-.927-.66H4.088z"/>
        </svg>
      ), 
      color: 'text-teal-600' 
    }
  };

  // Get all available profiles
  const availableProfiles = basics.profiles?.filter(profile => 
    profileConfigs[profile.network as keyof typeof profileConfigs]
  ) || [];

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero pt-16 pb-16 overflow-hidden">
      {/* Subtle decorative accents with animations */}
      <div className="absolute inset-0 overflow-hidden will-change-transform pointer-events-none">
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-20 w-40 h-40 bg-primary-glow/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Portrait - Minimal and Professional */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden shadow-professional border border-border/50">
                <img 
                  src={jakobPortrait} 
                  alt={`${basics.name} - Professional headshot`} 
                  className="w-full h-full object-cover gpu-accelerated"
                  loading="eager"
                  decoding="sync"
                  width="144"
                  height="144"
                />
              </div>
            </div>
          </div>
          
          {/* Content - Enhanced Typography with Animations */}
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-3">
              <h1 className="text-5xl lg:text-6xl font-display font-bold tracking-tight animate-scale-in">
                {basics.name}
              </h1>
              <h2 className="text-xl lg:text-2xl text-muted-foreground font-normal animate-slide-up" style={{ animationDelay: '0.2s' }}>
                {basics.label}
              </h2>
              <div className="flex justify-center">
                <div className="flex flex-wrap gap-2 justify-center items-center max-w-2xl animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                    <Briefcase className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-medium text-primary">7+ Years</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                    <span className="text-xs font-medium text-primary">Automotive</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                    <span className="text-xs font-medium text-primary">Manufacturing</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                    <span className="text-xs font-medium text-primary">Industry 4.0</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                    <span className="text-xs font-medium text-primary">Digital Transformation</span>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {basics.summary}
            </p>

            {/* Contact Info - Minimal */}
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {basics.location.city} {basics.location.region}
              </div>
              {basics.url && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-border/50 hover:border-primary transition-smooth h-auto py-1 px-3"
                  asChild
                >
                  <a 
                    href={basics.url}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm"
                    onClick={() => trackExternalLink(basics.url, 'website')}
                  >
                    <Globe className="w-4 h-4" />
                    jakobgabriel.github.io
                  </a>
                </Button>
              )}
            </div>
            
            {config.features.downloadResume.enabled && (
              <Button 
                size="lg" 
                className="px-8 py-6 text-base shadow-professional hover:shadow-dramatic transition-all duration-300 hover:-translate-y-0.5 bg-primary hover:bg-primary-glow animate-fade-in"
                style={{ animationDelay: '0.4s' }}
                onClick={handleDownload}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <FileText className="w-5 h-5 mr-2" />
                )}
                {isGenerating ? (t('hero.generating') || 'Generating...') : t('hero.downloadResume')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};