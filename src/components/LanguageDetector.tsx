import { ReactNode } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { config } from '@/data/config';
import { getAvailableLanguages } from '@/data/resume';

export const LanguageDetector = ({ children }: { children: ReactNode }) => {
  const availableLanguages = getAvailableLanguages();
  const defaultLanguage = config?.features?.multiLanguage?.defaultLanguage || 'en';

  return (
    <LanguageProvider 
      availableLanguages={availableLanguages}
      defaultLanguage={defaultLanguage}
    >
      {children}
    </LanguageProvider>
  );
};
