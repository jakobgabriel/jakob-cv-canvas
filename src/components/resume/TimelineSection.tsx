import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { GraduationCap, Award, Briefcase, Calendar, MapPin, ArrowRight, X, ChevronDown, CheckCircle, Clock, Info, LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import { getResumeData } from "@/data/resume";
import { useLanguage } from "@/contexts/LanguageContext";
import { calculateDuration, calculateDurationGerman } from "@/lib/dateUtils";
import { useAnalytics } from "@/hooks/useAnalytics";

type ViewMode = 'card' | 'compact';

export const TimelineSection = () => {
  const { language, t } = useLanguage();
  const resumeData = getResumeData(language);
  const { trackDetailView } = useAnalytics();

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('card');

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setIsDetailsVisible(true);
    
    // Track detail view
    if ('position' in item) {
      trackDetailView('experience', item.position);
    } else {
      trackDetailView('education', `${item.studyType} in ${item.area}`);
    }
  };

  const closeDetails = () => {
    setIsDetailsVisible(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  if (!resumeData) {
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
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            {t('timeline.journeyDescription')}
          </p>

          {/* View Toggle */}
          <div className="inline-flex items-center gap-1 p-1 bg-secondary/50 rounded-lg border border-border/50">
            <Button
              variant={viewMode === 'card' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('card')}
              className="gap-2"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'de' ? 'Karten' : 'Cards'}</span>
            </Button>
            <Button
              variant={viewMode === 'compact' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('compact')}
              className="gap-2"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'de' ? 'Kompakt' : 'Compact'}</span>
            </Button>
          </div>
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
            
            <div className={`space-y-4 ${viewMode === 'card' ? 'timeline-connector' : ''}`}>
              {experiences.map((exp, index) => (
                viewMode === 'card' ? (
                  <Card
                    key={index}
                    className="bg-card/50 backdrop-blur-sm border-border/50 shadow-minimal hover:shadow-professional transition-all duration-300 cursor-pointer group hover:-translate-y-1 hover:border-primary/30 card-accent stagger-item"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => handleItemClick(exp)}
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4 w-full">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary-glow/10 group-hover:from-primary/20 group-hover:to-primary-glow/20 transition-all duration-300">
                          <Briefcase className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-primary mb-2">
                            <Calendar className="w-3 h-3" />
                            <span className="text-xs font-mono uppercase tracking-wider">{exp.startDate} - {exp.endDate || 'Present'}</span>
                          </div>
                          <h4 className="text-lg font-medium leading-tight mb-1 group-hover:text-primary transition-smooth">{exp.position}</h4>
                          <div className="text-muted-foreground font-medium flex items-center gap-1 mb-2">
                            <span>{exp.name}</span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{exp.summary}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </div>
                  </Card>
                ) : (
                  /* Compact View - Mobile Optimized */
                  <div
                    key={index}
                    className="flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg hover:bg-secondary/50 cursor-pointer group transition-all duration-200 stagger-item border-l-2 border-transparent hover:border-primary active:bg-secondary/70"
                    style={{ animationDelay: `${index * 0.05}s` }}
                    onClick={() => handleItemClick(exp)}
                  >
                    <div className="w-12 sm:w-16 flex-shrink-0 text-xs font-mono text-muted-foreground pt-0.5 sm:pt-0">
                      {exp.startDate.split('-')[0]}
                    </div>
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5 sm:mt-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2 sm:truncate">{exp.position}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">{exp.name}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0 sm:opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 sm:mt-0" />
                  </div>
                )
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
            
            <div className={`space-y-4 ${viewMode === 'card' ? 'timeline-connector' : ''}`}>
              {education.map((edu, index) => (
                viewMode === 'card' ? (
                  <Card
                    key={index}
                    className="bg-card/50 backdrop-blur-sm border-border/50 shadow-minimal hover:shadow-professional transition-all duration-300 cursor-pointer group hover:-translate-y-1 hover:border-primary/30 card-accent stagger-item"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => handleItemClick(edu)}
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4 w-full">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary-glow/10 group-hover:from-primary/20 group-hover:to-primary-glow/20 transition-all duration-300">
                          <GraduationCap className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-primary mb-2">
                            <Calendar className="w-3 h-3" />
                            <span className="text-xs font-mono uppercase tracking-wider">{edu.startDate} - {edu.endDate}</span>
                          </div>
                          <h4 className="text-lg font-medium leading-tight mb-1 group-hover:text-primary transition-smooth">{edu.studyType} in {edu.area}</h4>
                          <div className="text-muted-foreground font-medium flex items-center gap-1 mb-2">
                            <span>{edu.institution}</span>
                          </div>
                          {'score' in edu && edu.score && (
                            <div className="text-sm text-primary font-medium mb-2 flex items-center gap-2">
                              <span>Score: {edu.score}</span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="w-3 h-3 text-muted-foreground hover:text-primary cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">German grading system (US equivalent)</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          )}
                          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{edu.summary}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </div>
                  </Card>
                ) : (
                  /* Compact View - Mobile Optimized */
                  <div
                    key={index}
                    className="flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg hover:bg-secondary/50 cursor-pointer group transition-all duration-200 stagger-item border-l-2 border-transparent hover:border-primary active:bg-secondary/70"
                    style={{ animationDelay: `${index * 0.05}s` }}
                    onClick={() => handleItemClick(edu)}
                  >
                    <div className="w-12 sm:w-16 flex-shrink-0 text-xs font-mono text-muted-foreground pt-0.5 sm:pt-0">
                      {edu.startDate.split('-')[0]}
                    </div>
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5 sm:mt-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2 sm:truncate">{edu.studyType} in {edu.area}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">{edu.institution}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0 sm:opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 sm:mt-0" />
                  </div>
                )
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
                    <div className="text-primary font-medium text-sm flex items-center gap-2">
                      <span>{t('timeline.score')}: {selectedItem.score}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3 h-3 text-muted-foreground hover:text-primary cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">German grading system (US equivalent)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
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