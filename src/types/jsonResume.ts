// JSON Resume Schema Types
export interface JsonResumeBasics {
  name: string;
  label: string;
  /**
   * Optional rotation for the headline. `label` remains the canonical single
   * line — the accessible text, the reduced-motion text, and what any other
   * consumer of this file reads.
   */
  labels?: string[];
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

/**
 * A named piece of work inside a position.
 *
 * Deliberately terse. The position's `highlights` say what changed and by how
 * much; a project says what the thing was called and what it was built with.
 * Repeating a figure here puts the same claim in the drawer twice, which is
 * what the section is meant to avoid.
 *
 * Only `name` is required, so a project can be recorded before its dates or
 * stack are known.
 */
export interface JsonResumeWorkProject {
  name: string;
  summary?: string;
  /** Rendered as the small line under the bullet, joined with the period. */
  keywords?: string[];
  /** Free text rather than ISO dates: "2022-2023", "six months in 2023". */
  period?: string;
}

export interface JsonResumeWork {
  name: string;
  position: string;
  location?: string;
  url?: string;
  startDate: string;
  endDate?: string;
  summary: string;
  highlights?: string[];
  /**
   * Scope rather than accomplishments, for a role that has only just begun.
   * Rendered under "Tasks & Responsibilities" instead of "Key Achievements",
   * because a job nobody has done yet has no achievements to list.
   */
  responsibilities?: string[];
  projects?: JsonResumeWorkProject[];
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
