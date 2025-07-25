import { useState, useEffect } from 'react';
import yaml from 'js-yaml';

export const useYamlData = <T>(filePath: string): { data: T | null; loading: boolean; error: string | null } => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${filePath}: ${response.statusText}`);
        }
        const yamlText = await response.text();
        const parsedData = yaml.load(yamlText) as T;
        setData(parsedData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filePath]);

  return { data, loading, error };
};