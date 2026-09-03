import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  availableLanguages: string[];
  t: (key: string) => string;
}

const translations: Record<string, Record<string, string>> = {
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
    'contact.letsTalk': "Let's Talk",
    'contact.otherWays': 'Other ways to connect',
    'contact.responseTime': 'Usually responds within 24 hours',
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
    'cookies.savePreferences': 'Save Preferences',
    'cookies.settings': 'Cookie Settings',
    'cookies.privacySignal':
      'Your browser sends a Do Not Track / Global Privacy Control signal, so analytics stays off.',
    'common.cancel': 'Cancel',
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
    'contact.letsTalk': 'Lassen Sie uns sprechen',
    'contact.otherWays': 'Weitere Kontaktmöglichkeiten',
    'contact.responseTime': 'Antwortzeit in der Regel innerhalb von 24 Stunden',
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
    'cookies.savePreferences': 'Einstellungen speichern',
    'cookies.settings': 'Cookie-Einstellungen',
    'cookies.privacySignal':
      'Ihr Browser sendet ein Do-Not-Track- bzw. Global-Privacy-Control-Signal, daher bleibt die Analyse deaktiviert.',
    'common.cancel': 'Abbrechen',
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
  availableLanguages?: string[];
  defaultLanguage?: string;
}

export const LanguageProvider = ({ 
  children, 
  availableLanguages = ['en'], 
  defaultLanguage = 'en' 
}: LanguageProviderProps) => {
  const [language, setLanguage] = useState<string>(defaultLanguage);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && availableLanguages.includes(savedLanguage)) {
      setLanguage(savedLanguage);
    } else if (!availableLanguages.includes(language)) {
      setLanguage(defaultLanguage);
    }
  }, [availableLanguages, defaultLanguage, language]);

  const handleSetLanguage = (newLanguage: string) => {
    if (availableLanguages.includes(newLanguage)) {
      setLanguage(newLanguage);
      localStorage.setItem('language', newLanguage);
    }
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations[defaultLanguage]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: handleSetLanguage, 
      availableLanguages,
      t 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};