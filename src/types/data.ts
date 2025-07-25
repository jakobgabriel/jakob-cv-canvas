export interface PersonalInfo {
  name: {
    first: string;
    last: string;
  };
  title: string;
  bio: string;
  contact: {
    email: string;
    linkedin: string;
    github: string;
  };
  image: {
    src: string;
    alt: string;
  };
}

export interface Experience {
  title: string;
  company: string;
  period: string;
  year: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  year: string;
  gpa: string;
  description: string;
  achievements: string[];
  subjects: string[];
}

export interface CoreCompetency {
  name: string;
  level: number;
  description: string;
}

export interface LeadershipSkill {
  name: string;
  icon: string;
}

export interface Skills {
  core_competencies: CoreCompetency[];
  leadership_skills: LeadershipSkill[];
}