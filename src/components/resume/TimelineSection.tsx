import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { GraduationCap, Award, Briefcase, Calendar, MapPin, ChevronDown } from "lucide-react";

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
        
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Experience Section */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h3 className="text-3xl font-bold mb-4 flex items-center gap-3 justify-center lg:justify-start">
                <Briefcase className="w-8 h-8 text-primary" />
                Professional Experience
              </h3>
            </div>
            
            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <Card key={index} className="bg-card backdrop-blur-sm border-border shadow-dramatic animate-fade-in">
                  <Accordion type="single" collapsible>
                    <AccordionItem value={`exp-${index}`} className="border-0">
                      <AccordionTrigger className="px-6 pt-6 pb-4 hover:no-underline">
                        <div className="flex items-start gap-4 w-full text-left">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Briefcase className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 text-primary mb-1">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm font-mono">{exp.period}</span>
                            </div>
                            <h4 className="text-lg font-bold leading-tight">{exp.title}</h4>
                            <div className="text-muted-foreground font-medium flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {exp.company}
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6">
                        <div className="space-y-4 pt-4">
                          <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
                          
                          <div>
                            <h5 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                              <Award className="w-4 h-4 text-primary" />
                              Key Achievements
                            </h5>
                            <ul className="space-y-1 text-muted-foreground">
                              {exp.achievements.map((achievement, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="text-primary mr-2 mt-1 text-xs">▸</span>
                                  {achievement}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {exp.technologies.map((tech, i) => (
                              <Badge key={i} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Education Section */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h3 className="text-3xl font-bold mb-4 flex items-center gap-3 justify-center lg:justify-start">
                <GraduationCap className="w-8 h-8 text-primary" />
                Education
              </h3>
            </div>
            
            <div className="space-y-6">
              {education.map((edu, index) => (
                <Card key={index} className="bg-card backdrop-blur-sm border-border shadow-dramatic animate-fade-in">
                  <Accordion type="single" collapsible>
                    <AccordionItem value={`edu-${index}`} className="border-0">
                      <AccordionTrigger className="px-6 pt-6 pb-4 hover:no-underline">
                        <div className="flex items-start gap-4 w-full text-left">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <GraduationCap className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 text-primary mb-1">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm font-mono">{edu.period}</span>
                            </div>
                            <h4 className="text-lg font-bold leading-tight">{edu.degree}</h4>
                            <div className="text-muted-foreground font-medium flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {edu.institution}
                            </div>
                            <div className="text-sm text-primary font-semibold mt-1">GPA: {edu.gpa}</div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6">
                        <div className="space-y-4 pt-4">
                          <p className="text-muted-foreground leading-relaxed">{edu.description}</p>
                          
                          <div>
                            <h5 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                              <Award className="w-4 h-4 text-primary" />
                              Achievements
                            </h5>
                            <ul className="space-y-1 text-muted-foreground">
                              {edu.achievements.map((achievement, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="text-primary mr-2 mt-1 text-xs">▸</span>
                                  {achievement}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {edu.subjects.map((subject, i) => (
                              <Badge key={i} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                                {subject}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};