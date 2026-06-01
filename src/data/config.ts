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

const defaultConfig: Config = {
  features: {
    downloadResume: { enabled: false, url: '' },
    contactForm: { enabled: false, recipientEmail: '' },
    multiLanguage: { enabled: false, defaultLanguage: 'en' },
  },
  analytics: { googleAnalyticsId: '' },
  theme: { primaryColor: '', darkMode: false },
};

// Merge the bundled config over safe defaults so a partially-edited or
// malformed config.json degrades gracefully instead of throwing where
// individual feature flags are read.
const raw = (configData ?? {}) as Partial<Config>;

export const config: Config = {
  features: {
    downloadResume: {
      ...defaultConfig.features.downloadResume,
      ...raw.features?.downloadResume,
    },
    contactForm: {
      ...defaultConfig.features.contactForm,
      ...raw.features?.contactForm,
    },
    multiLanguage: {
      ...defaultConfig.features.multiLanguage,
      ...raw.features?.multiLanguage,
    },
  },
  analytics: { ...defaultConfig.analytics, ...raw.analytics },
  theme: { ...defaultConfig.theme, ...raw.theme },
};
