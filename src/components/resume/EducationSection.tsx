import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Award, Calendar } from "lucide-react";

const education = [
  {
    degree: "Master of Science in Digital Business Engineering",
    institution: "Technical University of Munich",
    period: "2016 - 2018",
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
    degree: "Bachelor of Science in Computer Science",
    institution: "University of Stuttgart",
    period: "2012 - 2016",
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

const certifications = [
  { name: "AWS Solutions Architect Professional", year: "2023" },
  { name: "Google Cloud Professional Cloud Architect", year: "2022" },
  { name: "Certified Scrum Master (CSM)", year: "2021" },
  { name: "ITIL 4 Foundation", year: "2020" }
];

export const EducationSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            Education &{" "}
            <span className="text-gradient">Qualifications</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Academic foundation and professional certifications driving excellence
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Academic Education */}
          <div className="space-y-8">
            {education.map((edu, index) => (
              <Card key={index} className="p-8 bg-card/50 backdrop-blur-sm border-border hover:bg-card/70 transition-smooth shadow-dramatic animate-fade-in">
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="md:col-span-1 space-y-2">
                    <div className="flex items-center gap-2 text-primary mb-2">
                      <GraduationCap className="w-5 h-5" />
                      <span className="text-sm font-mono">{edu.period}</span>
                    </div>
                    <h3 className="text-xl font-bold leading-tight">{edu.degree}</h3>
                    <div className="text-muted-foreground font-medium">{edu.institution}</div>
                    <div className="text-sm text-primary font-semibold">GPA: {edu.gpa}</div>
                  </div>
                  
                  <div className="md:col-span-3 space-y-4">
                    <p className="text-muted-foreground leading-relaxed">{edu.description}</p>
                    
                    <div>
                      <h4 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary" />
                        Achievements:
                      </h4>
                      <ul className="space-y-1 text-muted-foreground">
                        {edu.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-primary mr-2 mt-1">▸</span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 text-foreground">Key Subjects:</h4>
                      <div className="flex flex-wrap gap-2">
                        {edu.subjects.map((subject, i) => (
                          <Badge key={i} variant="secondary" className="bg-secondary/50 text-secondary-foreground border-border">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {/* Certifications */}
          <Card className="p-8 bg-card/50 backdrop-blur-sm border-border shadow-dramatic animate-fade-in">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-primary" />
              Professional Certifications
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-background/30 rounded-lg border border-border/50">
                  <span className="font-medium">{cert.name}</span>
                  <div className="flex items-center gap-2 text-primary">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-mono">{cert.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};