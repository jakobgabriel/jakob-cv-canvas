import { useState, useEffect } from 'react';
import { JsonResume } from '@/types/jsonResume';
import { useLanguage } from '@/contexts/LanguageContext';

export const useJsonResume = () => {
  const [data, setData] = useState<JsonResume | null>(null);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/resume.json');
        const allData = await response.json();
        setData(allData[language] || allData.en);
      } catch (error) {
        console.error('Failed to load resume data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language]);

  return { data, loading };
};