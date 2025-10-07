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
    multiLanguage: {
      enabled: boolean;
      defaultLanguage: string;
    };
  };
  analytics: {
    googleAnalyticsId: string;
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
        const baseUrl = import.meta.env.BASE_URL || '/';
        const url = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}data/config.json`;
        const response = await fetch(url);
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