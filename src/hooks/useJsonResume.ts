import { useState, useEffect } from 'react';
import { JsonResume } from '@/types/jsonResume';
import { useLanguage } from '@/contexts/LanguageContext';
import { useConfig } from './useConfig';

export const useJsonResume = () => {
  const [data, setData] = useState<JsonResume | null>(null);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const { config } = useConfig();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = new URL('data/resume.json', import.meta.env.BASE_URL).toString();
        const response = await fetch(url);
        const allData = await response.json();
        
        // Check if multi-language is enabled in config
        const isMultiLanguage = config?.features?.multiLanguage?.enabled ?? false;
        
        if (isMultiLanguage) {
          // Multi-language format: { en: {...}, de: {...} }
          setData(allData[language] || allData.en || allData);
        } else {
          // Single language format: { basics: {...}, work: [...], ... }
          setData(allData);
        }
      } catch (error) {
        console.error('Failed to load resume data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (config !== null) {
      fetchData();
    }
  }, [language, config]);

  return { data, loading };
};