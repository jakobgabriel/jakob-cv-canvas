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

          {/* Technical Skills - Enhanced Grid */}
          <Card className="p-8 bg-gradient-subtle backdrop-blur-sm border-border/50 shadow-professional overflow-hidden relative">
            {/* Decorative accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
            
            <div className="flex items-center gap-3 mb-8 relative z-10">
              <div className="p-2 rounded-lg bg-primary/10">
                <Code className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-medium">{t('skills.technicalSkills')}</h3>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {skills.map((skill, index) => (
                <div 
                  key={index} 
                  className="group space-y-4 p-4 rounded-lg bg-card/50 border border-border/50 hover:border-border hover:shadow-minimal transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Skill header with level indicator */}
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium text-foreground flex-1 group-hover:text-primary transition-smooth">
                      {skill.name}
                    </h4>
                    <div className="flex gap-1 mt-0.5">
                      {[...Array(3)].map((_, i) => (
                        <div 
                          key={i}
                          className={`w-1 h-3 rounded-full transition-all duration-500 ${
                            i < (skill.level === 'Expert' ? 3 : skill.level === 'Advanced' ? 2 : 1)
                              ? 'bg-primary' 
                              : 'bg-border'
                          }`}
                          style={{ transitionDelay: `${i * 100}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Keywords with staggered animation */}
                  <div className="flex flex-wrap gap-1.5">
                    {skill.keywords.map((keyword, i) => (
                      <Badge 
                        key={i} 
                        variant="secondary" 
                        className="text-xs px-2.5 py-0.5 bg-secondary/70 hover:bg-primary hover:text-primary-foreground transition-all duration-300 cursor-default border border-transparent hover:border-primary/20 font-medium"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
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