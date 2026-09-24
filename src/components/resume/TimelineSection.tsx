import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  GraduationCap,
  Award,
  Briefcase,
  Calendar,
  ArrowRight,
  X,
  CheckCircle,
  Clock,
  Info,
  FolderGit2,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { getResumeData } from "@/data/resume";
import type { JsonResumeWorkProject } from "@/types/jsonResume";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  calculateDuration,
  calculateDurationGerman,
  effectiveEndDate,
  formatDateRange,
  hasStarted,
} from "@/lib/dateUtils";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

export const TimelineSection = () => {
  const { language, t } = useLanguage();
  const resumeData = getResumeData(language);
  const { trackDetailView } = useAnalytics();

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const headingRef = useRevealOnScroll<HTMLDivElement>();
  const experienceListRef = useRevealOnScroll<HTMLOListElement>();
  const educationListRef = useRevealOnScroll<HTMLOListElement>();

  const handleItemClick = (item: any, event: React.MouseEvent) => {
    triggerRef.current = event.currentTarget as HTMLElement;
    setSelectedItem(item);
    setIsDetailsVisible(true);

    // Track detail view
    if ("position" in item) {
      trackDetailView("experience", item.position);
    } else {
      trackDetailView("education", `${item.studyType} in ${item.area}`);
    }
  };

  const closeDetails = useCallback(() => {
    setIsDetailsVisible(false);
    triggerRef.current?.focus();

    const panel = panelRef.current;
    if (!panel) {
      setSelectedItem(null);
      return;
    }

    // Clear the content when the slide-out actually finishes, so the panel
    // never blanks mid-animation and never lingers if the transition is
    // skipped (reduced motion, background tab).
    const done = (event?: TransitionEvent) => {
      if (event && event.propertyName !== "transform") return;
      panel.removeEventListener("transitionend", done);
      clearTimeout(fallback);
      setSelectedItem(null);
    };
    const fallback = setTimeout(done, 400);
    panel.addEventListener("transitionend", done);
  }, []);

  // Escape key handler
  useEffect(() => {
    if (!isDetailsVisible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDetails();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isDetailsVisible, closeDetails]);

  // Focus trap
  useEffect(() => {
    if (!isDetailsVisible || !panelRef.current) return;

    const panel = panelRef.current;
    const focusableSelector =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

    // Focus the panel on open
    const firstFocusable = panel.querySelector<HTMLElement>(focusableSelector);
    firstFocusable?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusables = panel.querySelectorAll<HTMLElement>(focusableSelector);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [isDetailsVisible, selectedItem]);

  if (!resumeData) {
    return <div className="py-24 text-center">{t("loading")}</div>;
  }

  const { work, education } = resumeData;
  // A role that has not begun is not shown at all. It appears on its own, on
  // the day it starts, without anything needing to be edited or redeployed —
  // the filter runs at render time in the browser.
  const experiences = work.filter((entry: { startDate?: string }) => hasStarted(entry.startDate));

  return (
    <section className="py-20 relative bg-gradient-subtle" id="experience">
      <div className="container mx-auto px-4 sm:px-6">
        {/* The heading reveals with the section instead of sitting already
            landed while the cards animate beneath it. */}
        <div ref={headingRef} data-reveal className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-medium tracking-tight mb-4">
            {t("timeline.professionalJourney")}
          </h2>
          <p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            style={{ animationDelay: "0.06s" }}
          >
            {t("timeline.journeyDescription")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Experience Section */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-display font-medium mb-6 flex items-center gap-3 justify-center lg:justify-start">
                <Briefcase className="w-6 h-6 text-primary" />
                {t("timeline.experience")}
              </h3>
            </div>

            <ol
              ref={experienceListRef}
              data-reveal
              className="relative ml-[5px] space-y-4 border-l border-border pl-7"
            >
              {experiences.map((exp, index) => (
                <li
                  key={index}
                  className="relative"
                  style={{ animationDelay: `${0.12 + index * 0.06}s` }}
                >
                  <span
                    className="absolute -left-[33px] top-7 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background"
                    aria-hidden="true"
                  />
                  <Card
                    className="pressable relative bg-card/50 backdrop-blur-sm border-border/50 shadow-minimal hover:shadow-professional hover:border-primary/30 cursor-pointer group has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background"
                    data-open={isDetailsVisible && selectedItem === exp ? "" : undefined}
                  >
                    {/* The card's action is a real button stretched over it,
                        instead of a div with role="button". Native Enter and
                        Space come for free, and — the reason it changed — the
                        grading-scale tooltip below is now a sibling rather
                        than a button nested inside a button, which axe flags
                        as a serious violation and screen readers announce as
                        a control inside a control. */}
                    <button
                      type="button"
                      className="absolute inset-0 z-0 rounded-[inherit] focus:outline-none"
                      aria-label={`View details for ${exp.position} at ${exp.name}`}
                      onClick={(e) => handleItemClick(exp, e)}
                    />
                    <div className="p-5 sm:p-6">
                      <div className="flex items-start gap-4 w-full">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-primary mb-2">
                            <Calendar className="w-3 h-3" aria-hidden="true" />
                            <span className="text-xs font-medium tracking-wide">
                              {formatDateRange(exp.startDate, exp.endDate, language)}
                            </span>
                          </div>
                          <h4 className="text-lg font-medium leading-tight mb-1 group-hover:text-primary transition-colors duration-200">
                            {exp.position}
                          </h4>
                          <div className="text-muted-foreground font-medium mb-2">{exp.name}</div>
                          {exp.summary && (
                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                              {exp.summary}
                            </p>
                          )}
                        </div>
                        <ArrowRight
                          className="w-4 h-4 shrink-0 mt-1 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-[color,transform] duration-200"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </Card>
                </li>
              ))}
            </ol>
          </div>

          {/* Education Section */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-display font-medium mb-6 flex items-center gap-3 justify-center lg:justify-start">
                <GraduationCap className="w-6 h-6 text-primary" />
                {t("timeline.education")}
              </h3>
            </div>

            <ol
              ref={educationListRef}
              data-reveal
              className="relative ml-[5px] space-y-4 border-l border-border pl-7"
            >
              {education.map((edu, index) => (
                <li
                  key={index}
                  className="relative"
                  style={{ animationDelay: `${0.12 + index * 0.06}s` }}
                >
                  <span
                    className="absolute -left-[33px] top-7 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background"
                    aria-hidden="true"
                  />
                  <Card
                    className="pressable relative bg-card/50 backdrop-blur-sm border-border/50 shadow-minimal hover:shadow-professional hover:border-primary/30 cursor-pointer group has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background"
                    data-open={isDetailsVisible && selectedItem === edu ? "" : undefined}
                  >
                    {/* The card's action is a real button stretched over it,
                        instead of a div with role="button". Native Enter and
                        Space come for free, and — the reason it changed — the
                        grading-scale tooltip below is now a sibling rather
                        than a button nested inside a button, which axe flags
                        as a serious violation and screen readers announce as
                        a control inside a control. */}
                    <button
                      type="button"
                      className="absolute inset-0 z-0 rounded-[inherit] focus:outline-none"
                      aria-label={`View details for ${edu.studyType} in ${edu.area} at ${edu.institution}`}
                      onClick={(e) => handleItemClick(edu, e)}
                    />
                    <div className="p-5 sm:p-6">
                      <div className="flex items-start gap-4 w-full">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-primary mb-2">
                            <Calendar className="w-3 h-3" aria-hidden="true" />
                            <span className="text-xs font-medium tracking-wide">
                              {formatDateRange(edu.startDate, edu.endDate, language)}
                            </span>
                          </div>
                          <h4 className="text-lg font-medium leading-tight mb-1 group-hover:text-primary transition-colors duration-200">
                            {edu.studyType} in {edu.area}
                          </h4>
                          <div className="text-muted-foreground font-medium mb-2">
                            {edu.institution}
                          </div>
                          {"score" in edu && edu.score && (
                            <div className="text-sm text-primary font-medium mb-2 flex items-center gap-2">
                              <span>
                                {t("timeline.score")}: {edu.score}
                              </span>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    type="button"
                                    onClick={(e) => e.stopPropagation()}
                                    className="relative z-10 rounded-sm text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    aria-label="About the grading scale"
                                  >
                                    <Info className="w-3 h-3" aria-hidden="true" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">German grading system (US equivalent)</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          )}
                          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {edu.summary}
                          </p>
                        </div>
                        <ArrowRight
                          className="w-4 h-4 shrink-0 mt-1 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-[color,transform] duration-200"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </Card>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Details Modal - Clean and Minimal */}
        <div
          className={`fixed inset-0 z-50 transition-opacity ${isDetailsVisible ? "opacity-100 pointer-events-auto duration-200" : "opacity-0 pointer-events-none duration-150"}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="detail-panel-title"
          aria-hidden={!isDetailsVisible}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={closeDetails}
            aria-label="Close details"
          />

          {/* Modal Panel */}
          <div
            ref={panelRef}
            className={`absolute right-0 top-0 h-full w-full max-w-2xl bg-card border-l shadow-dramatic transform transition-transform ease-[var(--ease-drawer)] ${isDetailsVisible ? "translate-x-0 duration-300" : "translate-x-full duration-200"}`}
          >
            {selectedItem && (
              <div className="h-full overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded bg-secondary/50">
                      {"position" in selectedItem ? (
                        <Briefcase className="w-5 h-5 text-primary" />
                      ) : (
                        <GraduationCap className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 id="detail-panel-title" className="text-xl font-medium">
                        {"position" in selectedItem
                          ? selectedItem.position
                          : `${selectedItem.studyType} in ${selectedItem.area}`}
                      </h3>
                      <p className="text-muted-foreground">
                        {"position" in selectedItem ? selectedItem.name : selectedItem.institution}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeDetails}
                    aria-label="Close details panel"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 drawer-content">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-primary">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {formatDateRange(selectedItem.startDate, selectedItem.endDate, language)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">
                        {t("language") === "de"
                          ? calculateDurationGerman(
                              selectedItem.startDate,
                              effectiveEndDate(selectedItem.endDate) || "present",
                            )
                          : calculateDuration(
                              selectedItem.startDate,
                              effectiveEndDate(selectedItem.endDate) || "present",
                            )}
                      </span>
                    </div>
                  </div>

                  {"score" in selectedItem && selectedItem.score && (
                    <div className="text-primary font-medium text-sm flex items-center gap-2">
                      <span>
                        {t("timeline.score")}: {selectedItem.score}
                      </span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="rounded-sm text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            aria-label="About the grading scale"
                          >
                            <Info className="w-3 h-3" aria-hidden="true" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">German grading system (US equivalent)</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  )}

                  {selectedItem.summary && (
                    <p className="text-muted-foreground leading-relaxed">{selectedItem.summary}</p>
                  )}

                  {(() => {
                    // A role that has only just begun has scope, not results.
                    // Listing that scope under "Key Achievements" would claim
                    // things nobody has done yet, so the heading follows the
                    // data: highlights are achievements, responsibilities are
                    // the brief.
                    const achievements = selectedItem.highlights ?? [];
                    const responsibilities =
                      "responsibilities" in selectedItem
                        ? ((selectedItem.responsibilities as string[] | undefined) ?? [])
                        : [];
                    const items = achievements.length > 0 ? achievements : responsibilities;
                    if (items.length === 0) return null;
                    const heading =
                      achievements.length > 0
                        ? t("timeline.keyAchievements")
                        : t("timeline.responsibilities");
                    return (
                      <div>
                        <h4 className="font-medium mb-4 text-foreground flex items-center gap-2">
                          <Award className="w-4 h-4 text-primary" />
                          {heading}
                        </h4>
                        <ul className="space-y-2 text-muted-foreground">
                          {items.map((highlight: string, i: number) => (
                            <li key={i} className="flex items-start gap-3">
                              <span className="text-primary mt-1 text-xs">•</span>
                              <span className="leading-relaxed text-sm">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })()}

                  {(() => {
                    // Education entries never carry projects, and a position
                    // without them renders exactly the drawer that shipped
                    // before this section existed.
                    const projects =
                      "projects" in selectedItem
                        ? ((selectedItem.projects as JsonResumeWorkProject[] | undefined) ?? [])
                        : [];
                    if (projects.length === 0) return null;
                    return (
                      <div>
                        <h4 className="font-medium mb-4 text-foreground flex items-center gap-2">
                          <FolderGit2 className="w-4 h-4 text-primary" />
                          {t("timeline.projects")}
                        </h4>
                        <ul className="space-y-3 text-muted-foreground">
                          {projects.map((project, i) => {
                            // Stack and period share one line; either may be
                            // absent, and with both absent the line is gone.
                            const meta = [...(project.keywords ?? []), project.period]
                              .filter(Boolean)
                              .join(" \u00B7 ");
                            return (
                              <li key={i} className="flex items-start gap-3">
                                <span className="text-primary mt-1 text-xs">•</span>
                                <div>
                                  <span className="leading-relaxed text-sm">
                                    <strong className="font-semibold text-foreground">
                                      {project.name}
                                    </strong>
                                    {project.summary ? ` \u2014 ${project.summary}` : null}
                                  </span>
                                  {meta ? (
                                    <div className="mt-0.5 text-xs text-muted-foreground">
                                      {meta}
                                    </div>
                                  ) : null}
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })()}

                  {"courses" in selectedItem &&
                    selectedItem.courses &&
                    selectedItem.courses.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-4 text-foreground flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-primary" />
                          {t("timeline.coursework")}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedItem.courses.map((course: string, i: number) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-xs px-2.5 py-1 font-medium"
                            >
                              {course}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                  {"keywords" in selectedItem &&
                    selectedItem.keywords &&
                    selectedItem.keywords.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-4 text-foreground flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-primary" />
                          {t("timeline.technologies")}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedItem.keywords.map((keyword: string, i: number) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-xs px-2.5 py-1 font-medium"
                            >
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
