import resumeData from '../../public/data/resume.json';
import { JsonResume } from '@/types/jsonResume';
import { config } from './config';

export const getResumeData = (language: string = 'en'): JsonResume => {
  const isMultiLanguage = config?.features?.multiLanguage?.enabled ?? false;
  
  if (isMultiLanguage) {
    // Multi-language format: { en: {...}, de: {...} }
    const data = resumeData as any;
    return (data[language] || data.en || data) as JsonResume;
  } else {
    // Single language format: { basics: {...}, work: [...], ... }
    return resumeData as JsonResume;
  }
};

export const getAvailableLanguages = (): string[] => {
  const isMultiLanguage = config?.features?.multiLanguage?.enabled ?? false;
  
  if (isMultiLanguage) {
    return Object.keys(resumeData);
  }
  
  return [config?.features?.multiLanguage?.defaultLanguage || 'en'];
};
