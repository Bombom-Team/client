import * as Sentry from '@sentry/react-native';
import type { NativeLoginFailure, NativeLoginProvider } from '@/utils/auth';

export type NativeLoginFailureReport = {
  provider: NativeLoginProvider;
} & (
  | NativeLoginFailure
  | {
      stage: 'webview_dispatch';
      reason: 'webview_dispatch_failed';
    }
);

export const captureNativeLoginFailure = (report: NativeLoginFailureReport) => {
  const { provider, stage, reason } = report;
  const errorCode = 'errorCode' in report ? report.errorCode : undefined;

  Sentry.captureMessage('Native login failed', {
    level: 'warning',
    fingerprint: ['{{ default }}', provider, stage, reason],
    tags: {
      flow: 'auth_login',
      provider,
      stage,
      reason,
      ...(errorCode && { error_code: errorCode }),
    },
  });
};
