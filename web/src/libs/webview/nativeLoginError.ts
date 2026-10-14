import { ApiError } from '@bombom/shared/apis';
/* eslint-disable import/named */
import { captureException } from '@sentry/react';
/* eslint-enable import/named */
import { isNetworkNoiseError } from '../sentry/errorFilters';
import type { OAuthProvider } from '@bombom/shared/types';
import type { WebViewLoginFailureReason } from '@bombom/shared/webview';

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

// 원본 서버 메시지 대신 안전한 분류 값만 RN에 전달한다.
export const getWebViewLoginFailureReason = (
  error: unknown,
  stage: NativeLoginErrorStage,
): WebViewLoginFailureReason => {
  if (stage === 'credential_validation') return 'credential_validation_failed';
  if (isNetworkNoiseError(error)) return 'network_error';

  if (error instanceof ApiError) {
    if (error.status === 401) return 'reauthentication_required';
    if (error.status === 429) return 'too_many_requests';
    if (error.status === 408) return 'network_error';
    if (error.status >= 500) return 'server_unavailable';
    if (error.status >= 400) return 'token_exchange_rejected';
  }

  return 'token_exchange_failed';
};

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
