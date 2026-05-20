/* eslint-disable import/named */
import {
  init,
  tanstackRouterBrowserTracingIntegration,
  replayIntegration,
} from '@sentry/react';
/* eslint-enable import/named */
import { beforeSend } from './beforeSend';
import { ENV } from '@/apis/env';

type InitSentryParams = {
  isDevelopment: boolean;
  router: Parameters<typeof tanstackRouterBrowserTracingIntegration>[0];
};

// router 생성 이후에 init해야 tanstackRouterBrowserTracingIntegration이 router를 참조할 수 있음
export const initSentry = ({ isDevelopment, router }: InitSentryParams) => {
  init({
    dsn: ENV.sentryDsn,
    sendDefaultPii: false,
    allowUrls: [/https?:\/\/.*\.bombom\.news/],
    integrations: [
      tanstackRouterBrowserTracingIntegration(router),
      replayIntegration(),
    ],
    tracesSampleRate: isDevelopment ? 1 : 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    beforeSend,
  });
};
