import { ENV } from '@/constants/env';
import * as Sentry from '@sentry/react-native';
import { Platform } from 'react-native';

export const initSentry = () => {
  if (
    __DEV__ ||
    Platform.OS === 'web' ||
    !ENV.sentryDsn ||
    !ENV.sentryEnvironment ||
    Sentry.getClient()
  ) {
    return;
  }

  Sentry.init({
    dsn: ENV.sentryDsn,
    environment: ENV.sentryEnvironment,
    sendDefaultPii: false,
    attachStacktrace: true,
    beforeBreadcrumb: (breadcrumb) =>
      breadcrumb.category === 'console' ? null : breadcrumb,
  });

  Sentry.setTag('service', 'app');
};
