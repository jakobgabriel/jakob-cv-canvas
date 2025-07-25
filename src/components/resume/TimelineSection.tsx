import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, Award, Briefcase, Calendar, MapPin, ArrowRight, X } from "lucide-react";
import { useState } from "react";
import { useYamlData } from "@/hooks/useYamlData";
import { useLanguage } from "@/contexts/LanguageContext";

import { Experience, Education } from "@/types/data";

export const TimelineSection = () => {
  const { data: experiences, loading: expLoading } = useYamlData<Experience[]>('/data/experience.yaml');
  const { data: education, loading: eduLoading } = useYamlData<Education[]>('/data/education.yaml');
  const { t } = useLanguage();
  
  const [selectedItem, setSelectedItem] = useState<Experience | Education | null>(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  const handleItemClick = (item: Experience | Education) => {
    setSelectedItem(item);
    setIsDetailsVisible(true);
  };

  const closeDetails = () => {
    setIsDetailsVisible(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  if (expLoading || eduLoading || !experiences || !education) {
    return <div className="py-24 text-center">{t('loading')}</div>;
  }

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            {t('timeline.professionalJourney').split(' ')[0]}{" "}
            <span className="text-gradient">{t('timeline.professionalJourney').split(' ').slice(1).join(' ')}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('timeline.journeyDescription')}
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Experience Section */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h3 className="text-3xl font-bold mb-4 flex items-center gap-3 justify-center lg:justify-start">
                <Briefcase className="w-8 h-8 text-primary" />
                {t('timeline.experience')}
              </h3>
            </div>
            
            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <Card 
                  key={index} 
                  className="bg-card backdrop-blur-sm border-border shadow-dramatic animate-fade-in cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  onClick={() => handleItemClick(exp)}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4 w-full">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Briefcase className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-primary mb-1">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm font-mono">{exp.period}</span>
                        </div>
                        <h4 className="text-lg font-bold leading-tight">{exp.title}</h4>
                        <div className="text-muted-foreground font-medium flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {exp.company}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{exp.description}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Education Section */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h3 className="text-3xl font-bold mb-4 flex items-center gap-3 justify-center lg:justify-start">
                <GraduationCap className="w-8 h-8 text-primary" />
                {t('timeline.education')}
              </h3>
            </div>
            
            <div className="space-y-6">
              {education.map((edu, index) => (
                <Card 
                  key={index} 
                  className="bg-card backdrop-blur-sm border-border shadow-dramatic animate-fade-in cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  onClick={() => handleItemClick(edu)}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4 w-full">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <GraduationCap className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-primary mb-1">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm font-mono">{edu.period}</span>
                        </div>
                        <h4 className="text-lg font-bold leading-tight">{edu.degree}</h4>
                        <div className="text-muted-foreground font-medium flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {edu.institution}
                        </div>
                        {'gpa' in edu && (
                          <div className="text-sm text-primary font-semibold mt-1">GPA: {edu.gpa}</div>
                        )}
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{edu.description}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Details Slide Panel */}
        <div className={`fixed inset-0 z-50 transition-all duration-500 ${isDetailsVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeDetails}
          />
          
          {/* Slide Panel */}
          <div className={`absolute right-0 top-0 h-full w-full max-w-2xl bg-card border-l shadow-2xl transform transition-transform duration-500 ${isDetailsVisible ? 'translate-x-0' : 'translate-x-full'}`}>
            {selectedItem && (
              <div className="h-full overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      {'company' in selectedItem ? (
                        <Briefcase className="w-6 h-6 text-primary" />
                      ) : (
                        <GraduationCap className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{'title' in selectedItem ? selectedItem.title : selectedItem.degree}</h3>
                      <p className="text-muted-foreground">{'company' in selectedItem ? selectedItem.company : selectedItem.institution}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={closeDetails}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-2 text-primary">
                    <Calendar className="w-4 h-4" />
                    <span className="font-mono">{selectedItem.period}</span>
                  </div>

                  {'gpa' in selectedItem && (
                    <div className="text-primary font-semibold">
                      GPA: {selectedItem.gpa}
                    </div>
                  )}

                  <p className="text-muted-foreground leading-relaxed text-lg">{selectedItem.description}</p>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary" />
                      {t('timeline.achievements')}
                    </h4>
                    <ul className="space-y-3 text-muted-foreground">
                      {selectedItem.achievements.map((achievement: string, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-primary mt-1.5 text-sm">▸</span>
                          <span className="leading-relaxed">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-foreground">
                      {'company' in selectedItem ? t('timeline.technologies') : t('timeline.subjects')}
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {('technologies' in selectedItem ? selectedItem.technologies : selectedItem.subjects).map((item: string, i: number) => (
                        <Badge key={i} variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};