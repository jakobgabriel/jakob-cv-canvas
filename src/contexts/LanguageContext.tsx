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
    'timeline.journeyDescription': 'Experience and education that shaped my career in digital transformation.',
    'timeline.experience': 'Experience',
    'timeline.education': 'Education',
    'timeline.keyAchievements': 'Key Achievements',
    'timeline.responsibilities': 'Tasks & Responsibilities',
    'timeline.technologies': 'Technologies',
    'timeline.subjects': 'Key Subjects',
    'timeline.coursework': 'Coursework',
    'timeline.score': 'Score',
    'skills.skillsAndExpertise': 'Skills & Expertise',
    'skills.skillsDescription': 'Core competencies and technical skills across business and technology domains.',
    'skills.coreCompetencies': 'Core Competencies',
    'skills.competenciesDescription': 'Expertise spanning technology, business, and leadership domains',
    'skills.technicalExcellence': 'Technical Excellence',
    'skills.leadershipSoft': 'Leadership & Soft Skills',
    'skills.certifications': 'Certifications',
    'skills.languages': 'Languages',
    'skills.technicalSkills': 'Technical Skills',
    'contact.getInTouch': 'Get In Touch',
    'contact.contactDescription': 'Interested in discussing digital transformation opportunities?',
    'contact.form.name': 'Name',
    'contact.form.email': 'Email',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Message',
    'contact.form.namePlaceholder': 'Your name',
    'contact.form.emailPlaceholder': 'your.email@company.com',
    'contact.form.subjectPlaceholder': 'Partnership opportunity',
    'contact.form.messagePlaceholder': 'Tell me about your digital transformation needs...',
    'contact.form.sendMessage': 'Send Message',
    'contact.form.sending': 'Sending...',
    'contact.form.successTitle': 'Message sent successfully!',
    'contact.form.successDescription': 'Thank you for your message. I\'ll get back to you soon.',
    'contact.form.errorTitle': 'Failed to send message',
    'contact.form.errorDescription': 'There was an error sending your message. Please try again or contact me directly via email.',
    'contact.form.disabledTitle': 'Contact form disabled',
    'contact.form.disabledDescription': 'The contact form is currently disabled. Please use the email link instead.',
    'contact.form.disabledNotice': 'Contact form is currently disabled. Please use the email link above.',
    'cookies.title': 'Cookie Preferences',
    'cookies.description': 'We use cookies to enhance your experience and analyze site usage.',
    'cookies.learnMore': 'Learn more',
    'cookies.showLess': 'Show less',
    'cookies.acceptAll': 'Accept All',
    'cookies.decline': 'Decline',
    'cookies.essential.title': 'Essential Cookies',
    'cookies.essential.description': 'Required for basic site functionality and user preferences.',
    'cookies.analytics.title': 'Analytics Cookies',
    'cookies.analytics.description': 'Help us understand how you interact with our site.',
    'cookies.required': 'Required',
    'cookies.optional': 'Optional',
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
    'timeline.journeyDescription': 'Erfahrungen und Bildung, die meine Karriere in der digitalen Transformation geprägt haben.',
    'timeline.experience': 'Berufserfahrung',
    'timeline.education': 'Bildungsweg',
    'timeline.keyAchievements': 'Wichtigste Erfolge',
    'timeline.responsibilities': 'Aufgaben & Verantwortlichkeiten',
    'timeline.technologies': 'Technologien',
    'timeline.subjects': 'Kernfächer',
    'timeline.coursework': 'Studieninhalte',
    'timeline.score': 'Bewertung',
    'skills.skillsAndExpertise': 'Fähigkeiten & Expertise',
    'skills.skillsDescription': 'Kernkompetenzen und technische Fähigkeiten in Geschäfts- und Technologiebereichen.',
    'skills.coreCompetencies': 'Kernkompetenzen',
    'skills.competenciesDescription': 'Expertise in Technologie-, Geschäfts- und Führungsbereichen',
    'skills.technicalExcellence': 'Technische Exzellenz',
    'skills.leadershipSoft': 'Führung & Soft Skills',
    'skills.certifications': 'Zertifizierungen',
    'skills.languages': 'Sprachen',
    'skills.technicalSkills': 'Technische Fähigkeiten',
    'contact.getInTouch': 'Kontakt Aufnehmen',
    'contact.contactDescription': 'Interessiert an der Diskussion von Möglichkeiten der digitalen Transformation?',
    'contact.form.name': 'Name',
    'contact.form.email': 'E-Mail',
    'contact.form.subject': 'Betreff',
    'contact.form.message': 'Nachricht',
    'contact.form.namePlaceholder': 'Ihr Name',
    'contact.form.emailPlaceholder': 'ihre.email@unternehmen.com',
    'contact.form.subjectPlaceholder': 'Partnerschaftsmöglichkeit',
    'contact.form.messagePlaceholder': 'Erzählen Sie mir von Ihren Anforderungen zur digitalen Transformation...',
    'contact.form.sendMessage': 'Nachricht Senden',
    'contact.form.sending': 'Wird gesendet...',
    'contact.form.successTitle': 'Nachricht erfolgreich gesendet!',
    'contact.form.successDescription': 'Vielen Dank für Ihre Nachricht. Ich melde mich bald bei Ihnen.',
    'contact.form.errorTitle': 'Nachricht konnte nicht gesendet werden',
    'contact.form.errorDescription': 'Beim Senden Ihrer Nachricht ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie mich direkt per E-Mail.',
    'contact.form.disabledTitle': 'Kontaktformular deaktiviert',
    'contact.form.disabledDescription': 'Das Kontaktformular ist derzeit deaktiviert. Bitte verwenden Sie stattdessen den E-Mail-Link.',
    'contact.form.disabledNotice': 'Das Kontaktformular ist derzeit deaktiviert. Bitte verwenden Sie den obigen E-Mail-Link.',
    'cookies.title': 'Cookie-Einstellungen',
    'cookies.description': 'Wir verwenden Cookies, um Ihre Erfahrung zu verbessern und die Website-Nutzung zu analysieren.',
    'cookies.learnMore': 'Mehr erfahren',
    'cookies.showLess': 'Weniger anzeigen',
    'cookies.acceptAll': 'Alle Akzeptieren',
    'cookies.decline': 'Ablehnen',
    'cookies.essential.title': 'Notwendige Cookies',
    'cookies.essential.description': 'Erforderlich für grundlegende Website-Funktionen und Benutzereinstellungen.',
    'cookies.analytics.title': 'Analyse-Cookies',
    'cookies.analytics.description': 'Helfen uns zu verstehen, wie Sie mit unserer Website interagieren.',
    'cookies.required': 'Erforderlich',
    'cookies.optional': 'Optional',
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