import configData from '../../public/data/config.json';

export interface Config {
  features: {
    downloadResume: {
      enabled: boolean;
      url: string;
    };
    contactForm: {
      enabled: boolean;
      recipientEmail: string;
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

export const config: Config = configData;
