import resumeData from '../../public/data/resume.json';
import { JsonResume } from '@/types/jsonResume';
import { config } from './config';

// resume.json is either a single JsonResume (has a top-level `basics`) or a
// map of language code -> JsonResume, e.g. { en: {...}, de: {...} }.
type ResumeSource = JsonResume | Record<string, JsonResume>;

const source = resumeData as unknown as ResumeSource;

const looksLikeResume = (value: unknown): value is JsonResume =>
  typeof value === 'object' && value !== null && 'basics' in value;

const isMultiLanguageSource = (
  data: ResumeSource,
): data is Record<string, JsonResume> => !looksLikeResume(data);

const defaultLanguage = (): string =>
  config?.features?.multiLanguage?.defaultLanguage || 'en';

export const getResumeData = (language: string = 'en'): JsonResume => {
  const isMultiLanguage = config?.features?.multiLanguage?.enabled ?? false;

  if (isMultiLanguage && isMultiLanguageSource(source)) {
    // Try the requested language, then the configured default, then English,
    // then any available language — never fall back to the whole map.
    for (const code of [language, defaultLanguage(), 'en']) {
      const entry = source[code];
      if (looksLikeResume(entry)) return entry;
    }
    const first = Object.values(source).find(looksLikeResume);
    if (first) return first;
  }

  // Single-language file (or a misconfigured multi-language flag): the file
  // itself is the resume. Callers guard fields with optional chaining.
  return source as JsonResume;
};

export const getAvailableLanguages = (): string[] => {
  const isMultiLanguage = config?.features?.multiLanguage?.enabled ?? false;

  if (isMultiLanguage && isMultiLanguageSource(source)) {
    // Only keys whose value actually looks like a resume.
    return Object.keys(source).filter((key) => looksLikeResume(source[key]));
  }

  return [defaultLanguage()];
};
