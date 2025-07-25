import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const experiences = [
  {
    title: "Senior Digital Business Value Engineer",
    company: "Tech Innovation Corp",
    period: "2022 - Present",
    description: "Leading digital transformation initiatives and driving business value through strategic technology implementation.",
    achievements: [
      "Increased operational efficiency by 40% through process automation",
      "Led cross-functional teams of 15+ members",
      "Implemented AI-driven solutions reducing costs by €2M annually"
    ],
    technologies: ["AI/ML", "Cloud Architecture", "Process Automation", "Data Analytics"]
  },
  {
    title: "Digital Solutions Architect",
    company: "Enterprise Solutions Ltd",
    period: "2020 - 2022",
    description: "Designed and implemented scalable digital solutions for enterprise clients across various industries.",
    achievements: [
      "Architected cloud-native solutions for 50+ clients",
      "Reduced system downtime by 85%",
      "Mentored junior developers and engineers"
    ],
    technologies: ["Cloud Computing", "Microservices", "DevOps", "System Integration"]
  },
  {
    title: "Business Technology Consultant",
    company: "Strategic Tech Partners",
    period: "2018 - 2020",
    description: "Provided strategic consulting for digital transformation and technology adoption.",
    achievements: [
      "Consulted for Fortune 500 companies",
      "Developed technology roadmaps for digital transformation",
      "Achieved 95% client satisfaction rate"
    ],
    technologies: ["Strategy", "Digital Transformation", "Project Management", "Stakeholder Management"]
  }
];

export const ExperienceSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            Professional{" "}
            <span className="text-gradient">Experience</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A journey of innovation, leadership, and transformative digital solutions
          </p>
        </div>
        
        <div className="space-y-8 max-w-4xl mx-auto">
          {experiences.map((exp, index) => (
            <Card key={index} className="p-8 bg-card/50 backdrop-blur-sm border-border hover:bg-card/70 transition-smooth shadow-dramatic">
              <div className="grid md:grid-cols-4 gap-6">
                <div className="md:col-span-1">
                  <div className="text-sm font-mono text-primary mb-2">{exp.period}</div>
                  <h3 className="text-xl font-bold mb-2">{exp.title}</h3>
                  <div className="text-muted-foreground font-medium">{exp.company}</div>
                </div>
                
                <div className="md:col-span-3 space-y-4">
                  <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">Key Achievements:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-primary mr-2 mt-1">▸</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, i) => (
                      <Badge key={i} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};