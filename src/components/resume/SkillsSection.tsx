import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const skillCategories = [
  {
    title: "Technical Leadership",
    skills: [
      { name: "Strategic Planning", level: 95 },
      { name: "Team Management", level: 90 },
      { name: "Digital Transformation", level: 92 },
      { name: "Process Optimization", level: 88 }
    ]
  },
  {
    title: "Technology Stack",
    skills: [
      { name: "Cloud Architecture", level: 90 },
      { name: "AI/ML Solutions", level: 85 },
      { name: "Data Analytics", level: 88 },
      { name: "System Integration", level: 92 }
    ]
  },
  {
    title: "Business Acumen",
    skills: [
      { name: "Stakeholder Management", level: 95 },
      { name: "Project Management", level: 90 },
      { name: "Business Analysis", level: 87 },
      { name: "ROI Optimization", level: 91 }
    ]
  }
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
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {skillCategories.map((category, index) => (
            <Card key={index} className="p-6 bg-card/50 backdrop-blur-sm border-border shadow-dramatic">
              <h3 className="text-xl font-bold mb-6 text-center">{category.title}</h3>
              <div className="space-y-4">
                {category.skills.map((skill, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className="text-xs text-primary font-mono">{skill.level}%</span>
                    </div>
                    <Progress 
                      value={skill.level} 
                      className="h-2 bg-muted"
                    />
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};