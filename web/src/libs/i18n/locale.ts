export const SUPPORTED_LOCALES = ['ko', 'en'] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'ko';

const isSupportedLocale = (value: string): value is Locale =>
  SUPPORTED_LOCALES.some((locale) => locale === value);

export const normalizeLocale = (languageTag: string): Locale | null => {
  const language = languageTag.toLowerCase().split('-')[0] ?? '';

  return isSupportedLocale(language) ? language : null;
};

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

interface GetPreferredLanguagesParams {
  deviceLanguages: unknown;
  browserLanguages: readonly string[];
}

export const getPreferredLanguages = ({
  deviceLanguages,
  browserLanguages,
}: GetPreferredLanguagesParams): readonly string[] =>
  isStringArray(deviceLanguages) && deviceLanguages.length > 0
    ? deviceLanguages
    : browserLanguages;

interface ResolveLocaleParams {
  storedLocale: string | undefined;
  preferredLanguages: readonly string[];
}

export const resolveLocale = ({
  storedLocale,
  preferredLanguages,
}: ResolveLocaleParams): Locale => {
  const languageTags = storedLocale
    ? [storedLocale, ...preferredLanguages]
    : preferredLanguages;

  return (
    languageTags.map(normalizeLocale).find((locale) => locale !== null) ??
    DEFAULT_LOCALE
  );
};
