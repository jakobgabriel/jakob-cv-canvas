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
        
        {/* Primary Skills with Progress Bars */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {skillCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card key={index} className="p-6 bg-card/50 backdrop-blur-sm border-border shadow-dramatic hover:bg-card/70 transition-smooth animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2 rounded-lg bg-primary/10`}>
                    <IconComponent className={`w-6 h-6 ${category.color}`} />
                  </div>
                  <h3 className="text-xl font-bold">{category.title}</h3>
                </div>
                <div className="space-y-6">
                  {category.skills.map((skill, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-sm font-medium">{skill.name}</span>
                          <p className="text-xs text-muted-foreground">{skill.description}</p>
                        </div>
                        <span className="text-xs text-primary font-mono ml-2">{skill.level}%</span>
                      </div>
                      <Progress 
                        value={skill.level} 
                        className="h-2 bg-muted/50"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
        
        {/* Soft Skills */}
        <Card className="p-8 bg-card/50 backdrop-blur-sm border-border shadow-dramatic animate-fade-in">
          <h3 className="text-2xl font-bold mb-6 text-center">Leadership & Soft Skills</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {softSkills.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="text-center p-4 rounded-lg bg-background/30 border border-border/50 hover:bg-primary/5 hover:border-primary/20 transition-colors">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <span className="font-medium">{item.skill}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </section>
  );
};