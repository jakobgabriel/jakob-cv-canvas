import { useState, useEffect } from 'react';
import yaml from 'js-yaml';
import { useLanguage } from '@/contexts/LanguageContext';

export const useYamlData = <T>(filePath: string): { data: T | null; loading: boolean; error: string | null } => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${filePath}: ${response.statusText}`);
        }
        const yamlText = await response.text();
        const parsedData = yaml.load(yamlText) as any;
        
        // If the data has language keys, extract the current language data
        if (parsedData && typeof parsedData === 'object' && (parsedData.en || parsedData.de)) {
          setData(parsedData[language] as T);
        } else {
          setData(parsedData as T);
        }
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filePath, language]);

  return { data, loading, error };
};