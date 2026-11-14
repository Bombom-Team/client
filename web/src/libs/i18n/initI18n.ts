import {
  DEVICE_LANGUAGES_KEY,
  type WindowWithDeviceLanguages,
} from '@bombom/shared/webview';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  getPreferredLanguages,
  resolveLocale,
} from './locale';
import { DEFAULT_NAMESPACE, RESOURCES } from './resources';
import { ENV } from '@/apis/env';
import { createStorage } from '@/utils/localStorage';

const LOCALE_STORAGE_KEY = 'bombom_locale';

const localeStorage = createStorage<string>(LOCALE_STORAGE_KEY);

// 플래그가 꺼져 있으면 저장값과 기기·브라우저 언어를 무시하고 한국어로 표시한다
const getInitialLocale = () => {
  if (ENV.enableI18n !== 'true') return DEFAULT_LOCALE;

  return resolveLocale({
    storedLocale: localeStorage.get(),
    preferredLanguages: getPreferredLanguages({
      deviceLanguages: (window as WindowWithDeviceLanguages)[
        DEVICE_LANGUAGES_KEY
      ],
      browserLanguages: navigator.languages,
    }),
  });
};

export const initI18n = () => {
  i18n.on('languageChanged', (locale) => {
    document.documentElement.lang = locale;
  });

  // 번역을 번들에 포함하므로 동기로 초기화해 첫 렌더링부터 선택한 언어로 표시한다
  i18n.use(initReactI18next).init({
    resources: RESOURCES,
    lng: getInitialLocale(),
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: SUPPORTED_LOCALES,
    ns: [DEFAULT_NAMESPACE],
    defaultNS: DEFAULT_NAMESPACE,
    // React가 렌더링할 때 escape하므로 i18next에서는 escape하지 않는다
    interpolation: { escapeValue: false },
    initAsync: false,
  });
};
