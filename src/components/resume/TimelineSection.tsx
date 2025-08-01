import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { GraduationCap, Award, Briefcase, Calendar, MapPin, ArrowRight, X, ChevronDown, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";
import { useJsonResume } from "@/hooks/useJsonResume";
import { useLanguage } from "@/contexts/LanguageContext";
import { calculateDuration, calculateDurationGerman } from "@/lib/dateUtils";

export const TimelineSection = () => {
  const { data: resumeData, loading } = useJsonResume();
  const { t } = useLanguage();
  
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setIsDetailsVisible(true);
  };

  const closeDetails = () => {
    setIsDetailsVisible(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  if (loading || !resumeData) {
    return <div className="py-24 text-center">{t('loading')}</div>;
  }

  const { work: experiences, education } = resumeData;

  return (
    <section className="py-20 relative bg-gradient-subtle" id="experience">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-display font-medium tracking-tight mb-4">
            {t('timeline.professionalJourney')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('timeline.journeyDescription')}
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Experience Section */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-display font-medium mb-6 flex items-center gap-3 justify-center lg:justify-start">
                <Briefcase className="w-6 h-6 text-primary" />
                {t('timeline.experience')}
              </h3>
            </div>
            
            <div className="space-y-4">
              {experiences.map((exp, index) => (
                <Card 
                  key={index} 
                  className="bg-card/50 backdrop-blur-sm border-border/50 shadow-minimal hover:shadow-professional transition-smooth cursor-pointer group"
                  onClick={() => handleItemClick(exp)}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4 w-full">
                      <div className="p-2 rounded bg-secondary/50">
                        <Briefcase className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-primary mb-2">
                          <Calendar className="w-3 h-3" />
                          <span className="text-xs font-mono uppercase tracking-wider">{exp.startDate} - {exp.endDate || 'Present'}</span>
                        </div>
                        <h4 className="text-lg font-medium leading-tight mb-1">{exp.position}</h4>
                        <div className="text-muted-foreground font-medium flex items-center gap-1 mb-2">
                          <span>{exp.name}</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{exp.summary}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-smooth" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Education Section */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-display font-medium mb-6 flex items-center gap-3 justify-center lg:justify-start">
                <GraduationCap className="w-6 h-6 text-primary" />
                {t('timeline.education')}
              </h3>
            </div>
            
            <div className="space-y-4">
              {education.map((edu, index) => (
                <Card 
                  key={index} 
                  className="bg-card/50 backdrop-blur-sm border-border/50 shadow-minimal hover:shadow-professional transition-smooth cursor-pointer group"
                  onClick={() => handleItemClick(edu)}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4 w-full">
                      <div className="p-2 rounded bg-secondary/50">
                        <GraduationCap className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-primary mb-2">
                          <Calendar className="w-3 h-3" />
                          <span className="text-xs font-mono uppercase tracking-wider">{edu.startDate} - {edu.endDate}</span>
                        </div>
                        <h4 className="text-lg font-medium leading-tight mb-1">{edu.studyType} in {edu.area}</h4>
                        <div className="text-muted-foreground font-medium flex items-center gap-1 mb-2">
                          <span>{edu.institution}</span>
                        </div>
                        {'score' in edu && edu.score && (
                          <div className="text-sm text-primary font-medium mb-2">Score: {edu.score}</div>
                        )}
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{edu.summary}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-smooth" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Details Modal - Clean and Minimal */}
        <div className={`fixed inset-0 z-50 transition-all duration-300 ${isDetailsVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={closeDetails}
          />
          
          {/* Modal Panel */}
          <div className={`absolute right-0 top-0 h-full w-full max-w-2xl bg-card border-l shadow-dramatic transform transition-transform duration-300 ${isDetailsVisible ? 'translate-x-0' : 'translate-x-full'}`}>
            {selectedItem && (
              <div className="h-full overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded bg-secondary/50">
                      {'position' in selectedItem ? (
                        <Briefcase className="w-5 h-5 text-primary" />
                      ) : (
                        <GraduationCap className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-medium">
                        {'position' in selectedItem ? selectedItem.position : `${selectedItem.studyType} in ${selectedItem.area}`}
                      </h3>
                      <p className="text-muted-foreground">
                        {'position' in selectedItem ? selectedItem.name : selectedItem.institution}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={closeDetails}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-primary">
                      <Calendar className="w-4 h-4" />
                      <span className="font-mono text-sm">{selectedItem.startDate} - {selectedItem.endDate || 'Present'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">
                        {t('language') === 'de' 
                          ? calculateDurationGerman(selectedItem.startDate, selectedItem.endDate || 'present')
                          : calculateDuration(selectedItem.startDate, selectedItem.endDate || 'present')
                        }
                      </span>
                    </div>
                  </div>

                  {'score' in selectedItem && selectedItem.score && (
                    <div className="text-primary font-medium text-sm">
                      <span className="block">{t('timeline.score')}: {selectedItem.score}</span>
                      <span className="text-xs text-muted-foreground mt-1 block">German grading system (US equivalent)</span>
                    </div>
                  )}

                  <p className="text-muted-foreground leading-relaxed">{selectedItem.summary}</p>
                  
                  <div>
                    <h4 className="font-medium mb-4 text-foreground flex items-center gap-2">
                      <Award className="w-4 h-4 text-primary" />
                      {t('timeline.keyAchievements')}
                    </h4>
                    <ul className="space-y-2 text-muted-foreground">
                      {selectedItem.highlights?.map((highlight: string, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-primary mt-1 text-xs">•</span>
                          <span className="leading-relaxed text-sm">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {'courses' in selectedItem && selectedItem.courses && selectedItem.courses.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-4 text-foreground flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        {t('timeline.coursework')}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.courses.map((course: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-xs px-2 py-1">
                            {course}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {'keywords' in selectedItem && selectedItem.keywords && selectedItem.keywords.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-4 text-foreground flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        {t('timeline.technologies')}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.keywords.map((keyword: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-xs px-2 py-1">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};