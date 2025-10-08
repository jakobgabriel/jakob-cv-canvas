import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Users, Lightbulb, MessageSquare, TrendingUp, Mic, Award, Code, Globe } from "lucide-react";
import { getResumeData } from "@/data/resume";
import { useLanguage } from "@/contexts/LanguageContext";

const iconMap = {
  Target,
  Users,
  Lightbulb,
  MessageSquare,
  TrendingUp,
  Mic,
};

export const SkillsSection = () => {
  const { language, t } = useLanguage();
  const resumeData = getResumeData(language);

  if (!resumeData) {
    return <div className="py-24 text-center">{t('loading')}</div>;
  }

  const { skills, languages, certificates } = resumeData;

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-display font-medium tracking-tight mb-4">
            {t('skills.skillsAndExpertise')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('skills.skillsDescription')}
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Core Skills Grid */}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
            {/* Core Competencies */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-minimal">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-medium">{t('skills.coreCompetencies')}</h3>
              </div>
              <div className="space-y-4">
                {skills.slice(0, 4).map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className="text-xs text-primary font-mono">{skill.level}</span>
                    </div>
                    <div className="w-full bg-secondary/50 rounded-full h-1.5">
                      <div 
                        className="bg-primary h-1.5 rounded-full transition-all duration-1000" 
                        style={{ width: skill.level === 'Expert' ? '95%' : skill.level === 'Advanced' ? '80%' : '60%' }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Languages */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-minimal">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-medium">{t('skills.languages')}</h3>
              </div>
              <div className="space-y-4">
                {languages.map((lang, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{lang.language}</span>
                      <span className="text-xs text-muted-foreground">{lang.fluency}</span>
                    </div>
                    <div className="w-full bg-secondary/50 rounded-full h-1.5">
                      <div 
                        className="bg-primary h-1.5 rounded-full transition-all duration-1000" 
                        style={{ 
                          width: lang.fluency === 'Native speaker' || lang.fluency === 'Muttersprache' ? '100%' : 
                                 lang.fluency === 'Fluent' || lang.fluency === 'Fließend' ? '95%' : 
                                 lang.fluency === 'Intermediate' || lang.fluency === 'Mittelstufe' ? '70%' : '40%' 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Certifications */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-minimal">
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-medium">{t('skills.certifications')}</h3>
              </div>
              <div className="space-y-4">
                {certificates.slice(0, 4).map((cert, index) => (
                  <div key={index} className="space-y-1">
                    <h4 className="text-sm font-medium leading-tight">{cert.name}</h4>
                    <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                    <p className="text-xs text-primary font-mono">{cert.date}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Technical Skills - Clean Grid */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-minimal">
            <div className="flex items-center gap-3 mb-6">
              <Code className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-medium">{t('skills.technicalSkills')}</h3>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {skills.map((skill, index) => (
                <div key={index} className="space-y-3">
                  <h4 className="text-sm font-medium text-foreground border-b border-border/50 pb-2">{skill.name}</h4>
                  <div className="flex flex-wrap gap-2">
                    {skill.keywords.map((keyword, i) => (
                      <Badge key={i} variant="secondary" className="text-xs px-2 py-1 bg-secondary/50 hover:bg-secondary transition-smooth">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};