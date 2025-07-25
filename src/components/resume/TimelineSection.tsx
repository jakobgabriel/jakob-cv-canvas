import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Award, Briefcase, Calendar, MapPin } from "lucide-react";

const experiences = [
  {
    type: "experience",
    title: "Senior Digital Business Value Engineer",
    company: "Tech Innovation Corp",
    period: "2022 - Present",
    year: "2022",
    description: "Leading digital transformation initiatives and driving business value through strategic technology implementation.",
    achievements: [
      "Increased operational efficiency by 40% through process automation",
      "Led cross-functional teams of 15+ members",
      "Implemented AI-driven solutions reducing costs by €2M annually"
    ],
    technologies: ["AI/ML", "Cloud Architecture", "Process Automation", "Data Analytics"]
  },
  {
    type: "experience",
    title: "Digital Solutions Architect",
    company: "Enterprise Solutions Ltd",
    period: "2020 - 2022",
    year: "2020",
    description: "Designed and implemented scalable digital solutions for enterprise clients across various industries.",
    achievements: [
      "Architected cloud-native solutions for 50+ clients",
      "Reduced system downtime by 85%",
      "Mentored junior developers and engineers"
    ],
    technologies: ["Cloud Computing", "Microservices", "DevOps", "System Integration"]
  },
  {
    type: "experience",
    title: "Business Technology Consultant",
    company: "Strategic Tech Partners",
    period: "2018 - 2020",
    year: "2018",
    description: "Provided strategic consulting for digital transformation and technology adoption.",
    achievements: [
      "Consulted for Fortune 500 companies",
      "Developed technology roadmaps for digital transformation",
      "Achieved 95% client satisfaction rate"
    ],
    technologies: ["Strategy", "Digital Transformation", "Project Management", "Stakeholder Management"]
  }
];

const education = [
  {
    type: "education",
    degree: "Master of Science in Digital Business Engineering",
    institution: "Technical University of Munich",
    period: "2016 - 2018",
    year: "2016",
    gpa: "1.3 (Magna Cum Laude)",
    description: "Specialized in digital transformation, business process optimization, and technology strategy.",
    achievements: [
      "Thesis: 'AI-Driven Business Process Automation'",
      "Dean's List for Academic Excellence",
      "Graduate Research Assistant"
    ],
    subjects: ["Digital Strategy", "AI & Machine Learning", "Business Analytics", "Innovation Management"]
  },
  {
    type: "education",
    degree: "Bachelor of Science in Computer Science",
    institution: "University of Stuttgart",
    period: "2012 - 2016",
    year: "2012",
    gpa: "1.5 (Cum Laude)",
    description: "Foundation in computer science with focus on software engineering and system architecture.",
    achievements: [
      "Outstanding Student Award 2015",
      "Programming Competition Winner",
      "Student Representative"
    ],
    subjects: ["Software Engineering", "Database Systems", "System Architecture", "Project Management"]
  }
];

// Combine and sort by year (most recent first)
const timelineItems = [...experiences, ...education].sort((a, b) => parseInt(b.year) - parseInt(a.year));

export const TimelineSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            Professional{" "}
            <span className="text-gradient">Journey</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A timeline of career milestones and educational achievements
          </p>
        </div>
        
        <div className="relative max-w-6xl mx-auto">
          {/* Central Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary/50 to-transparent"></div>
          
          <div className="space-y-12">
            {timelineItems.map((item, index) => (
              <div key={index} className={`relative flex items-center ${item.type === 'experience' ? 'justify-start' : 'justify-end'}`}>
                {/* Timeline Node */}
                <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                  <div className="w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg"></div>
                </div>
                
                {/* Year Label */}
                <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-8 z-10">
                  <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-mono font-semibold">
                    {item.year}
                  </div>
                </div>
                
                {/* Content Card */}
                <div className={`w-5/12 ${item.type === 'experience' ? 'mr-auto pr-8' : 'ml-auto pl-8'}`}>
                  <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover:bg-card/70 transition-smooth shadow-dramatic animate-fade-in">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${item.type === 'experience' ? 'bg-blue-500/10' : 'bg-green-500/10'}`}>
                          {item.type === 'experience' ? 
                            <Briefcase className="w-5 h-5 text-blue-400" /> : 
                            <GraduationCap className="w-5 h-5 text-green-400" />
                          }
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-primary mb-1">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm font-mono">{item.period}</span>
                          </div>
                          <h3 className="text-lg font-bold leading-tight">
                            {item.type === 'experience' ? (item as any).title : (item as any).degree}
                          </h3>
                          <div className="text-muted-foreground font-medium flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {item.type === 'experience' ? (item as any).company : (item as any).institution}
                          </div>
                          {item.type === 'education' && (
                            <div className="text-sm text-primary font-semibold mt-1">GPA: {(item as any).gpa}</div>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                      
                      <div>
                        <h4 className="font-semibold mb-2 text-foreground flex items-center gap-2 text-sm">
                          <Award className="w-4 h-4 text-primary" />
                          {item.type === 'experience' ? 'Key Achievements:' : 'Achievements:'}
                        </h4>
                        <ul className="space-y-1 text-muted-foreground text-sm">
                          {item.achievements.map((achievement, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-primary mr-2 mt-1 text-xs">▸</span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {(item.type === 'experience' ? (item as any).technologies : (item as any).subjects).map((tech: string, i: number) => (
                          <Badge key={i} variant="secondary" className={`text-xs ${
                            item.type === 'experience' 
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                              : 'bg-green-500/10 text-green-400 border-green-500/20'
                          }`}>
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};