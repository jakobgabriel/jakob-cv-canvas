// JSON Resume Schema Types
export interface JsonResumeBasics {
  name: string;
  label: string;
  image: string;
  email: string;
  phone: string;
  url: string;
  summary: string;
  location: {
    address: string;
    postalCode: string;
    city: string;
    countryCode: string;
    region: string;
  };
  profiles: Array<{
    network: string;
    username: string;
    url: string;
  }>;
}

export interface JsonResumeWork {
  name: string;
  position: string;
  location?: string;
  url?: string;
  startDate: string;
  endDate?: string;
  summary: string;
  highlights: string[];
  keywords?: string[];
}

export interface JsonResumeEducation {
  institution: string;
  url?: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate?: string;
  score?: string;
  summary?: string;
  courses?: string[];
  highlights?: string[];
}

export interface JsonResumeSkill {
  name: string;
  level: string;
  keywords: string[];
}

export interface JsonResumeLanguage {
  language: string;
  fluency: string;
}

export interface JsonResumeCertificate {
  name: string;
  date: string;
  issuer: string;
  url?: string;
}

export interface JsonResumeProject {
  name: string;
  startDate: string;
  endDate?: string;
  description: string;
  highlights: string[];
  url?: string;
}

export interface JsonResumeInterest {
  name: string;
  keywords: string[];
}

export interface JsonResume {
  basics: JsonResumeBasics;
  work: JsonResumeWork[];
  education: JsonResumeEducation[];
  skills: JsonResumeSkill[];
  languages: JsonResumeLanguage[];
  certificates: JsonResumeCertificate[];
  projects?: JsonResumeProject[];
  interests?: JsonResumeInterest[];
}