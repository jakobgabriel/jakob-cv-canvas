import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'nav.experience': 'Experience',
    'nav.education': 'Education',
    'nav.skills': 'Skills',
    'nav.contact': 'Contact',
    'hero.downloadResume': 'Download Resume',
    'timeline.professionalJourney': 'Professional Journey',
    'timeline.journeyDescription': 'A timeline of career milestones and educational achievements',
    'timeline.experience': 'Professional Experience',
    'timeline.education': 'Education',
    'timeline.achievements': 'Key Achievements',
    'timeline.responsibilities': 'Tasks & Responsibilities',
    'timeline.technologies': 'Technologies & Skills',
    'timeline.subjects': 'Key Subjects',
    'skills.coreCompetencies': 'Core Competencies',
    'skills.competenciesDescription': 'Expertise spanning technology, business, and leadership domains',
    'skills.technicalExcellence': 'Technical Excellence',
    'skills.leadershipSoft': 'Leadership & Soft Skills',
    'skills.certifications': 'Professional Certifications',
    'skills.languages': 'Languages',
    'skills.technicalSkills': 'Technical Skills',
    'contact.getInTouch': 'Get In Touch',
    'contact.contactDescription': 'Ready to discuss your next project or opportunity',
    'loading': 'Loading...',
    'close': 'Close'
  },
  de: {
    'nav.experience': 'Erfahrung',
    'nav.education': 'Bildung',
    'nav.skills': 'Fähigkeiten',
    'nav.contact': 'Kontakt',
    'hero.downloadResume': 'Lebenslauf Herunterladen',
    'timeline.professionalJourney': 'Beruflicher Werdegang',
    'timeline.journeyDescription': 'Eine Zeitleiste der Karriere-Meilensteine und Bildungsabschlüsse',
    'timeline.experience': 'Berufserfahrung',
    'timeline.education': 'Bildungsweg',
    'timeline.achievements': 'Wichtigste Erfolge',
    'timeline.responsibilities': 'Aufgaben & Verantwortlichkeiten',
    'timeline.technologies': 'Technologien & Fähigkeiten',
    'timeline.subjects': 'Kernfächer',
    'skills.coreCompetencies': 'Kernkompetenzen',
    'skills.competenciesDescription': 'Expertise in Technologie-, Geschäfts- und Führungsbereichen',
    'skills.technicalExcellence': 'Technische Exzellenz',
    'skills.leadershipSoft': 'Führung & Soft Skills',
    'skills.certifications': 'Professionelle Zertifizierungen',
    'skills.languages': 'Sprachen',
    'skills.technicalSkills': 'Technische Fähigkeiten',
    'contact.getInTouch': 'Kontakt Aufnehmen',
    'contact.contactDescription': 'Bereit, Ihr nächstes Projekt oder Ihre Möglichkeiten zu besprechen',
    'loading': 'Lädt...',
    'close': 'Schließen'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'de')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};