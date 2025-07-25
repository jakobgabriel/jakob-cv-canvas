import { Button } from "@/components/ui/button";
import { LinkedinIcon, Github, Mail, FileText } from "lucide-react";
import jakobPortrait from "@/assets/jakob-portrait.jpeg";
import { useYamlData } from "@/hooks/useYamlData";
import { PersonalInfo } from "@/types/data";

export const HeroSection = () => {
  const { data: personalInfo, loading } = useYamlData<PersonalInfo>('/data/personal.yaml');

  if (loading || !personalInfo) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

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
                  alt={personalInfo.image.alt} 
                  className="w-full h-full object-cover transition-smooth hover:scale-110"
                />
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="space-y-8 max-w-4xl">
            <div className="space-y-4">
              <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                {personalInfo.name.first}{" "}
                <span className="text-gradient">{personalInfo.name.last}</span>
              </h1>
              <h2 className="text-2xl lg:text-3xl font-light text-muted-foreground">
                {personalInfo.title}
              </h2>
            </div>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {personalInfo.bio}
            </p>
            
            {/* Social Links */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                variant="social" 
                size="lg"
                className="group"
                asChild
              >
                <a 
                  href={personalInfo.contact.linkedin}
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
                  href={personalInfo.contact.github}
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
                  href={`mailto:${personalInfo.contact.email}`}
                  className="flex items-center gap-2"
                >
                  <Mail className="w-5 h-5 group-hover:scale-110 transition-smooth" />
                  Email
                </a>
              </Button>
            </div>
            
            <Button size="lg" className="group text-lg px-8 py-6">
              <FileText className="w-5 h-5 mr-2 group-hover:scale-110 transition-smooth" />
              Download Resume
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};