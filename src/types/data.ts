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
  location: string;
  phone: string;
  website: string;
}

export interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  year: string;
  type: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
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

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  credential_id: string;
}

export interface Language {
  name: string;
  level: string;
  proficiency: number;
}

export interface TechnicalSkills {
  programming: string[];
  frameworks: string[];
  cloud_platforms: string[];
  tools: string[];
}

export interface Skills {
  core_competencies: CoreCompetency[];
  technical_skills: TechnicalSkills;
  leadership_skills: LeadershipSkill[];
  certifications: Certification[];
  languages: Language[];
}