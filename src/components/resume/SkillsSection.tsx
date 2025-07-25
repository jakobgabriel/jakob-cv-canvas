import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Target, Users, Lightbulb, MessageSquare, TrendingUp, Mic } from "lucide-react";
import { useYamlData } from "@/hooks/useYamlData";
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

  if (loading || !skills) {
    return <div className="py-24 text-center">Loading...</div>;
  }

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            Core{" "}
            <span className="text-gradient">Competencies</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Expertise spanning technology, business, and leadership domains
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Core Competencies */}
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-center lg:text-left">Technical Excellence</h3>
            <div className="grid gap-6">
              {skills.core_competencies.map((skill, index) => (
                <Card key={index} className="p-6 bg-card backdrop-blur-sm border-border shadow-lg">
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
          
          {/* Leadership Skills */}
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-center lg:text-left">Leadership & Soft Skills</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {skills.leadership_skills.map((skill, index) => {
                const IconComponent = iconMap[skill.icon as keyof typeof iconMap];
                return (
                  <Card key={index} className="p-4 text-center hover:shadow-lg transition-all duration-300 bg-card backdrop-blur-sm border-border">
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
          </div>
        </div>
      </div>
    </section>
  );
};