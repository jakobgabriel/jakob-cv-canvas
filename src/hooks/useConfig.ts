import { useState, useEffect } from 'react';

interface Config {
  features: {
    downloadResume: {
      enabled: boolean;
      url: string;
    };
    contactForm: {
      enabled: boolean;
      formspreeEndpoint: string;
    };
  };
  theme: {
    primaryColor: string;
    darkMode: boolean;
  };
}

export const useConfig = () => {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const basePath = import.meta.env.PROD ? '/jakob-cv-canvas' : '';
        const response = await fetch(`${basePath}/data/config.json`);
        const data = await response.json();
        setConfig(data);
      } catch (error) {
        console.error('Failed to load config:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { config, loading };
};