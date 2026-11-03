export const SUPPORTED_LOCALES = ['ko', 'en'] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'ko';

const isSupportedLocale = (value: string): value is Locale =>
  SUPPORTED_LOCALES.some((locale) => locale === value);

export const normalizeLocale = (languageTag: string): Locale | null => {
  const language = languageTag.toLowerCase().split('-')[0] ?? '';

  return isSupportedLocale(language) ? language : null;
};

interface ResolveLocaleParams {
  storedLocale: string | undefined;
  browserLanguages: readonly string[];
}

// 직접 선택한 언어 → 브라우저 선호 언어 중 처음 지원하는 언어 → 한국어 순으로 정한다
export const resolveLocale = ({
  storedLocale,
  browserLanguages,
}: ResolveLocaleParams): Locale => {
  const languageTags = storedLocale
    ? [storedLocale, ...browserLanguages]
    : browserLanguages;

  return (
    languageTags.map(normalizeLocale).find((locale) => locale !== null) ??
    DEFAULT_LOCALE
  );
};
