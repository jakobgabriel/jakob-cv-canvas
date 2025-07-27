import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Users, Lightbulb, MessageSquare, TrendingUp, Mic, Award, Code, Globe } from "lucide-react";
import { useJsonResume } from "@/hooks/useJsonResume";
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
  const { data: resumeData, loading } = useJsonResume();
  const { t } = useLanguage();

  if (loading || !resumeData) {
    return <div className="py-24 text-center">{t('loading')}</div>;
  }

  const { skills, languages, certificates } = resumeData;

  return (
    <section className="py-12 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">
            {t('skills.coreCompetencies').split(' ')[0]}{" "}
            <span className="text-gradient">{t('skills.coreCompetencies').split(' ').slice(1).join(' ')}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('skills.competenciesDescription')}
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Compact Skills Overview */}
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-6">
            {/* Core Competencies */}
            <Card className="p-4 bg-card backdrop-blur-sm border-border shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-primary" />
                <h3 className="text-lg font-bold">{t('skills.technicalExcellence')}</h3>
              </div>
              <div className="space-y-3">
                {skills.slice(0, 4).map((skill, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className="text-xs text-primary font-mono">{skill.level}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div 
                        className="bg-primary h-1.5 rounded-full transition-all duration-1000" 
                        style={{ width: skill.level === 'Expert' ? '95%' : skill.level === 'Advanced' ? '80%' : '60%' }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Leadership Skills */}
            <Card className="p-4 bg-card backdrop-blur-sm border-border shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-primary" />
                <h3 className="text-lg font-bold">{t('skills.leadershipSoft')}</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {skills.slice(4, 8).map((skill, index) => {
                  return (
                    <div key={index} className="flex items-center gap-1 p-2 rounded bg-muted/30">
                      <Users className="w-3 h-3 text-primary" />
                      <span className="text-xs">{skill.name}</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Languages */}
            <Card className="p-4 bg-card backdrop-blur-sm border-border shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-primary" />
                <h3 className="text-lg font-bold">{t('skills.languages')}</h3>
              </div>
              <div className="space-y-3">
                {languages.map((lang, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{lang.language}</span>
                      <span className="text-xs text-muted-foreground">{lang.fluency}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
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
            <Card className="p-4 bg-card backdrop-blur-sm border-border shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-primary" />
                <h3 className="text-lg font-bold">{t('skills.certifications')}</h3>
              </div>
              <div className="space-y-3">
                {certificates.slice(0, 3).map((cert, index) => (
                  <div key={index} className="space-y-1">
                    <h4 className="text-sm font-medium">{cert.name}</h4>
                    <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                    <p className="text-xs text-muted-foreground">{cert.date}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Technical Skills - Compact */}
          <Card className="p-4 bg-card backdrop-blur-sm border-border shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Code className="w-4 h-4 text-primary" />
              <h3 className="text-lg font-bold">{t('skills.technicalSkills')}</h3>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              {skills.map((skill, index) => (
                <div key={index}>
                  <h4 className="text-sm font-semibold mb-2 text-muted-foreground">{skill.name}</h4>
                  <div className="flex flex-wrap gap-1">
                    {skill.keywords.map((keyword, i) => (
                      <Badge key={i} variant="secondary" className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/20">
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