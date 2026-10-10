/* eslint-disable import/named */
import {
  init,
  tanstackRouterBrowserTracingIntegration,
  replayIntegration,
} from '@sentry/react';
/* eslint-enable import/named */
import { beforeBreadcrumb, beforeSend } from './beforeSend';
import { NETWORK_NOISE_ERROR_PATTERNS } from './errorFilters';
import { ENV } from '@/apis/env';

type InitSentryParams = {
  router: Parameters<typeof tanstackRouterBrowserTracingIntegration>[0];
};

export const initSentry = ({ router }: InitSentryParams) => {
  if (!ENV.sentryDsn || ENV.sentryDsn === 'undefined') return;

  init({
    dsn: ENV.sentryDsn,
    release: ENV.sentryRelease,
    sendDefaultPii: false,
    allowUrls: [/https:\/\/(?:.*\.)?bombom\.news/],
    ignoreErrors: [...NETWORK_NOISE_ERROR_PATTERNS],
    integrations: [
      tanstackRouterBrowserTracingIntegration(router),
      replayIntegration(),
    ],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    beforeBreadcrumb,
    beforeSend,
  });
};
