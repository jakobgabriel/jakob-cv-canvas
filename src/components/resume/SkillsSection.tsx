import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Code, Users, TrendingUp, Zap, Target } from "lucide-react";

const skillCategories = [
  {
    title: "Technical Leadership",
    icon: Brain,
    color: "text-blue-400",
    skills: [
      { name: "Strategic Planning", level: 95, description: "Long-term technology roadmaps" },
      { name: "Team Management", level: 90, description: "Leading cross-functional teams" },
      { name: "Digital Transformation", level: 92, description: "Enterprise-wide change management" },
      { name: "Process Optimization", level: 88, description: "Lean methodologies & automation" }
    ]
  },
  {
    title: "Technology Stack",
    icon: Code,
    color: "text-green-400",
    skills: [
      { name: "Cloud Architecture", level: 90, description: "AWS, Azure, GCP solutions" },
      { name: "AI/ML Solutions", level: 85, description: "Machine learning implementation" },
      { name: "Data Analytics", level: 88, description: "Big data & business intelligence" },
      { name: "System Integration", level: 92, description: "API design & microservices" }
    ]
  },
  {
    title: "Business Acumen",
    icon: TrendingUp,
    color: "text-orange-400",
    skills: [
      { name: "Stakeholder Management", level: 95, description: "C-level communication" },
      { name: "Project Management", level: 90, description: "Agile & traditional methodologies" },
      { name: "Business Analysis", level: 87, description: "Requirements & process mapping" },
      { name: "ROI Optimization", level: 91, description: "Value-driven decision making" }
    ]
  }
];


const softSkills = [
  { skill: "Leadership", icon: Users },
  { skill: "Innovation", icon: Zap },
  { skill: "Strategy", icon: Target },
  { skill: "Communication", icon: Brain }
];

export const SkillsSection = () => {
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
        
        {/* Skills Overview - Compact Design */}
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-card backdrop-blur-sm border-border shadow-dramatic animate-fade-in">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {skillCategories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold">{category.title}</h3>
                    </div>
                    <div className="space-y-3">
                      {category.skills.slice(0, 3).map((skill, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">{skill.name}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${skill.level}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground font-mono w-8 text-right">{skill.level}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Soft Skills - Inline */}
            <div className="mt-8 pt-8 border-t border-border">
              <h4 className="text-lg font-semibold mb-4 text-center">Key Strengths</h4>
              <div className="flex flex-wrap justify-center gap-4">
                {softSkills.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={index} className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                      <IconComponent className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{item.skill}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};