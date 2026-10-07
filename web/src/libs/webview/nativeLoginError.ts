import { ApiError } from '@bombom/shared/apis';
/* eslint-disable import/named */
import { captureException } from '@sentry/react';
/* eslint-enable import/named */
import { isNetworkNoiseError } from '../sentry/errorFilters';
import type { OAuthProvider } from '@bombom/shared/types';

export type NativeLoginErrorStage = 'credential_validation' | 'token_exchange';

const NATIVE_LOGIN_ERROR_MESSAGES: Record<NativeLoginErrorStage, string> = {
  credential_validation: 'Native login credential validation failed',
  token_exchange: 'Native login token exchange failed',
};

interface CaptureNativeLoginErrorParams {
  provider: OAuthProvider;
  error: unknown;
  stage: NativeLoginErrorStage;
}

export const normalizeNativeLoginError = (
  error: unknown,
  stage: NativeLoginErrorStage,
): Error | null => {
  if (isNetworkNoiseError(error)) return null;

  const message = NATIVE_LOGIN_ERROR_MESSAGES[stage];

  if (error instanceof ApiError) {
    return new ApiError(error.status, message);
  }

  return new Error(message);
};

export const captureNativeLoginError = ({
  provider,
  error,
  stage,
}: CaptureNativeLoginErrorParams) => {
  const normalizedError = normalizeNativeLoginError(error, stage);
  if (!normalizedError) return;

  const tags = {
    flow: 'auth_login',
    provider,
    stage,
  };

  captureException(normalizedError, {
    tags,
    ...(normalizedError instanceof ApiError
      ? { fingerprint: ['{{ default }}', String(normalizedError.status)] }
      : {}),
  });
};
