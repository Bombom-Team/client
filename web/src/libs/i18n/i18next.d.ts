import 'i18next';
import type { DEFAULT_NAMESPACE, RESOURCES } from './resources';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof DEFAULT_NAMESPACE;
    resources: (typeof RESOURCES)['ko'];
  }
}
