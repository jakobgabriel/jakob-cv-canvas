import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Globe } from "lucide-react";
import { getResumeData } from "@/data/resume";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatMonthYear } from "@/lib/dateUtils";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

export const SkillsSection = () => {
  const { language, t } = useLanguage();
  const resumeData = getResumeData(language);
  const skillGridRef = useRevealOnScroll<HTMLDivElement>();
  const detailGridRef = useRevealOnScroll<HTMLDivElement>();

  if (!resumeData) {
    return <div className="py-24 text-center">{t("loading")}</div>;
  }

  const { skills, languages, certificates } = resumeData;

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-medium tracking-tight mb-4">
            {t("skills.skillsAndExpertise")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("skills.skillsDescription")}
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-12">
          {/*
            One grid, one encoding. Each domain states its level in words and
            lists what sits underneath it — the previous two blocks showed the
            same four names twice, once as rings and once as bar meters.
          */}
          <div
            ref={skillGridRef}
            data-reveal
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-start"
          >
            {skills.map((skill, index) => (
              <Card
                key={skill.name}
                className="p-5 h-full bg-card/50 backdrop-blur-sm border-border/50 shadow-minimal hover:shadow-professional hover:-translate-y-0.5 hover:border-primary/30 transition-[transform,box-shadow,border-color] duration-200"
                style={{ animationDelay: `${index * 0.06}s` }}
              >
                <h3 className="text-base font-medium leading-snug">{skill.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.08em] text-primary">
                  {skill.level}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {skill.keywords.map((keyword) => (
                    <Badge
                      key={keyword}
                      variant="secondary"
                      className="text-xs px-2.5 py-0.5 font-medium bg-secondary/70 cursor-default"
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* items-start keeps the shorter card from stretching to fill the row */}
          <div ref={detailGridRef} data-reveal className="grid gap-4 md:grid-cols-2 items-start">
            <Card
              className="p-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-minimal"
              style={{ animationDelay: "0s" }}
            >
              <div className="flex items-center gap-3 mb-5">
                <Globe className="w-5 h-5 text-primary" aria-hidden="true" />
                <h3 className="text-lg font-medium">{t("skills.languages")}</h3>
              </div>
              <dl className="divide-y divide-border/60">
                {languages.map((lang) => (
                  <div
                    key={lang.language}
                    className="flex items-baseline justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
                  >
                    <dt className="text-sm font-medium">{lang.language}</dt>
                    <dd className="text-sm text-muted-foreground">{lang.fluency}</dd>
                  </div>
                ))}
              </dl>
            </Card>

            <Card
              className="p-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-minimal"
              style={{ animationDelay: "0.06s" }}
            >
              <div className="flex items-center gap-3 mb-5">
                <Award className="w-5 h-5 text-primary" aria-hidden="true" />
                <h3 className="text-lg font-medium">{t("skills.certifications")}</h3>
              </div>
              <ul className="divide-y divide-border/60">
                {certificates.map((cert) => (
                  <li
                    key={`${cert.name}-${cert.date}`}
                    className="flex items-baseline justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium leading-tight">{cert.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{cert.issuer}</p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                      {formatMonthYear(cert.date, language)}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
