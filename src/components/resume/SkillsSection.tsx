import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Users, Lightbulb, MessageSquare, TrendingUp, Mic, Award, Code, Globe } from "lucide-react";
import { useYamlData } from "@/hooks/useYamlData";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skills } from "@/types/data";

const iconMap = {
  Target,
  Users,
  Lightbulb,
  MessageSquare,
  TrendingUp,
  Mic,
};

export const SkillsSection = () => {
  const { data: skills, loading } = useYamlData<Skills>('/data/skills.yaml');
  const { t } = useLanguage();

  if (loading || !skills) {
    return <div className="py-24 text-center">{t('loading')}</div>;
  }

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            {t('skills.coreCompetencies').split(' ')[0]}{" "}
            <span className="text-gradient">{t('skills.coreCompetencies').split(' ').slice(1).join(' ')}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('skills.competenciesDescription')}
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Core Competencies */}
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-center lg:text-left">{t('skills.technicalExcellence')}</h3>
              <div className="grid gap-6">
                {skills.core_competencies.map((skill, index) => (
                  <Card key={index} className="p-6 bg-card backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold">{skill.name}</h4>
                        <span className="text-sm font-mono text-primary">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                      <p className="text-sm text-muted-foreground">{skill.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Leadership & Technical Skills */}
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-center lg:text-left">{t('skills.leadershipSoft')}</h3>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {skills.leadership_skills.map((skill, index) => {
                  const IconComponent = iconMap[skill.icon as keyof typeof iconMap];
                  return (
                    <Card key={index} className="p-4 text-center hover:shadow-lg transition-all duration-300 bg-card backdrop-blur-sm border-border hover:scale-105">
                      <div className="space-y-3">
                        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <h4 className="font-semibold text-sm">{skill.name}</h4>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Technical Skills */}
              <Card className="p-6 bg-card backdrop-blur-sm border-border shadow-lg">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Code className="w-5 h-5 text-primary" />
                    <h4 className="text-lg font-bold">{t('skills.technicalSkills')}</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-sm font-semibold mb-2 text-muted-foreground">Programming</h5>
                      <div className="flex flex-wrap gap-2">
                        {skills.technical_skills.programming.map((tech, i) => (
                          <Badge key={i} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-semibold mb-2 text-muted-foreground">Frameworks</h5>
                      <div className="flex flex-wrap gap-2">
                        {skills.technical_skills.frameworks.map((tech, i) => (
                          <Badge key={i} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-semibold mb-2 text-muted-foreground">Cloud Platforms</h5>
                      <div className="flex flex-wrap gap-2">
                        {skills.technical_skills.cloud_platforms.map((tech, i) => (
                          <Badge key={i} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Certifications and Languages */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Certifications */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-bold">{t('skills.certifications')}</h3>
              </div>
              <div className="grid gap-4">
                {skills.certifications.map((cert, index) => (
                  <Card key={index} className="p-4 bg-card backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="space-y-2">
                      <h4 className="font-semibold">{cert.name}</h4>
                      <p className="text-sm text-muted-foreground">{cert.issuer} • {cert.date}</p>
                      <p className="text-xs text-muted-foreground font-mono">ID: {cert.credential_id}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Globe className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-bold">{t('skills.languages')}</h3>
              </div>
              <div className="grid gap-4">
                {skills.languages.map((lang, index) => (
                  <Card key={index} className="p-4 bg-card backdrop-blur-sm border-border shadow-lg">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{lang.name}</h4>
                        <span className="text-sm text-muted-foreground">{lang.level}</span>
                      </div>
                      <Progress value={lang.proficiency} className="h-2" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};