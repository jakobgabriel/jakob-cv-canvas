import { useEffect, useState, ReactNode } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';

interface LanguageDetectorProps {
  children: ReactNode;
}

export const LanguageDetector = ({ children }: LanguageDetectorProps) => {
  const [availableLanguages, setAvailableLanguages] = useState<string[]>(['en']);
  const [defaultLanguage, setDefaultLanguage] = useState<string>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectLanguages = async () => {
      try {
        // Fetch config to check if multi-language is enabled
        const baseUrl = import.meta.env.BASE_URL || '/';
        const configUrl = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}data/config.json`;
        const configResponse = await fetch(configUrl);
        const config = await configResponse.json();

        const isMultiLanguageEnabled = config?.features?.multiLanguage?.enabled ?? false;
        const configDefaultLang = config?.features?.multiLanguage?.defaultLanguage || 'en';

        if (!isMultiLanguageEnabled) {
          // Single language mode
          setAvailableLanguages([configDefaultLang]);
          setDefaultLanguage(configDefaultLang);
        } else {
          // Multi-language mode - detect from resume.json structure
          const resumeUrl = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}data/resume.json`;
          const resumeResponse = await fetch(resumeUrl);
          const resumeData = await resumeResponse.json();

          // Check if resume.json has multi-language structure (top-level language keys)
          // If it has "basics" at top level, it's single language
          // If it has "en", "de", etc. at top level, it's multi-language
          if (resumeData.basics) {
            // Single language format
            setAvailableLanguages([configDefaultLang]);
            setDefaultLanguage(configDefaultLang);
          } else {
            // Multi-language format - get all language keys
            const languages = Object.keys(resumeData).filter(key => 
              typeof resumeData[key] === 'object' && resumeData[key] !== null
            );
            setAvailableLanguages(languages.length > 0 ? languages : [configDefaultLang]);
            setDefaultLanguage(languages.includes(configDefaultLang) ? configDefaultLang : languages[0] || 'en');
          }
        }
      } catch (error) {
        console.error('Failed to detect languages:', error);
        // Fallback to English only
        setAvailableLanguages(['en']);
        setDefaultLanguage('en');
      } finally {
        setIsLoading(false);
      }
    };

    detectLanguages();
  }, []);

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <LanguageProvider 
      availableLanguages={availableLanguages} 
      defaultLanguage={defaultLanguage}
    >
      {children}
    </LanguageProvider>
  );
};
