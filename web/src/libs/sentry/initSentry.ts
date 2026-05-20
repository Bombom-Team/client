/* eslint-disable import/named */
import {
  init,
  tanstackRouterBrowserTracingIntegration,
  replayIntegration,
} from '@sentry/react';
/* eslint-enable import/named */
import { beforeSend } from './beforeSend';
import { ENV } from '@/apis/env';

const NETWORK_NOISE_ERROR_PATTERNS = [
  /^(?:TypeError:\s*)?Failed to fetch(?: \([^)]+\))?$/i,
  /^(?:TypeError:\s*)?Load failed(?: \([^)]+\))?$/i,
  /^(?:TypeError:\s*)?NetworkError when attempting to fetch resource\.?(?: \([^)]+\))?$/i,
];

type InitSentryParams = {
  router: Parameters<typeof tanstackRouterBrowserTracingIntegration>[0];
};

// router 생성 이후에 init해야 tanstackRouterBrowserTracingIntegration이 router를 참조할 수 있음
export const initSentry = ({ router }: InitSentryParams) => {
  if (!ENV.sentryDsn || ENV.sentryDsn === 'undefined') return;

  init({
    dsn: ENV.sentryDsn,
    sendDefaultPii: false,
    allowUrls: [/https:\/\/.*\.bombom\.news/],
    ignoreErrors: [...NETWORK_NOISE_ERROR_PATTERNS],
    integrations: [
      tanstackRouterBrowserTracingIntegration(router),
      replayIntegration(),
    ],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    beforeSend,
  });
};
