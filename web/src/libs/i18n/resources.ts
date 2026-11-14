import { EN_COMMON } from './locales/en/common';
import { KO_COMMON } from './locales/ko/common';

export const DEFAULT_NAMESPACE = 'common';

export const RESOURCES = {
  ko: { common: KO_COMMON },
  en: { common: EN_COMMON },
} as const;
