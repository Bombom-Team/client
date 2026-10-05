import type {
  NativeLoginFailure,
  NativeLoginProvider,
} from '@/utils/auth';
import * as Sentry from '@sentry/react-native';

type CaptureNativeLoginFailureParams = NativeLoginFailure & {
  provider: NativeLoginProvider;
};

export const captureNativeLoginFailure = ({
  provider,
  stage,
  reason,
}: CaptureNativeLoginFailureParams) => {
  Sentry.captureMessage('Native login failed', {
    level: 'warning',
    fingerprint: ['{{ default }}', provider, stage, reason],
    tags: {
      flow: 'auth_login',
      provider,
      stage,
      reason,
    },
  });
};
