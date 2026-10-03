import { ENV } from '@/constants/env';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';

export type NativeLoginProvider = 'google' | 'apple';

export interface NativeLoginFailure {
  stage: 'provider_request' | 'credential_validation' | 'webview_dispatch';
  reason:
    | 'provider_configuration'
    | 'play_services_unavailable'
    | 'provider_unavailable'
    | 'provider_request_failed'
    | 'missing_identity_token'
    | 'missing_provider_credential'
    | 'webview_dispatch_failed';
}

interface NativeLoginCallback {
  identityToken: string;
  authorizationCode: string;
  name: string | null;
  email: string;
  provider: NativeLoginProvider;
}

type LoginCallback = (credential: NativeLoginCallback) => boolean;

class NativeLoginError extends Error {
  readonly failure: NativeLoginFailure;

  constructor(failure: NativeLoginFailure) {
    super('Native login failed');
    this.failure = failure;
  }
}

const getErrorCode = (error: unknown) => {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return null;
  }

  return typeof error.code === 'string' ? error.code : null;
};

const getGoogleLoginFailure = (error: unknown): NativeLoginFailure | null => {
  const code = getErrorCode(error);

  if (code === statusCodes.SIGN_IN_CANCELLED || code === statusCodes.IN_PROGRESS) {
    return null;
  }

  if (code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    return {
      stage: 'provider_request',
      reason: 'play_services_unavailable',
    };
  }

  return {
    stage: 'provider_request',
    reason: 'provider_request_failed',
  };
};

const getAppleLoginFailure = (error: unknown): NativeLoginFailure | null => {
  if (getErrorCode(error) === 'ERR_REQUEST_CANCELED') return null;

  return {
    stage: 'provider_request',
    reason: 'provider_request_failed',
  };
};

export const getNativeLoginFailure = (
  provider: NativeLoginProvider,
  error: unknown,
): NativeLoginFailure | null => {
  if (error instanceof NativeLoginError) return error.failure;

  return provider === 'google'
    ? getGoogleLoginFailure(error)
    : getAppleLoginFailure(error);
}

export const loginWithGoogle = async (
  callbackWhenSuccess: LoginCallback,
): Promise<void> => {
  try {
    GoogleSignin.configure({
      webClientId: ENV.webClientId,
      iosClientId: ENV.iosClientId,
    });
  } catch {
    throw new NativeLoginError({
      stage: 'provider_request',
      reason: 'provider_configuration',
    });
  }

  let hasPlayServices: boolean;
  try {
    hasPlayServices = await GoogleSignin.hasPlayServices();
  } catch (error) {
    const failure = getGoogleLoginFailure(error);
    if (!failure) return;
    throw new NativeLoginError(failure);
  }

  if (!hasPlayServices) {
    throw new NativeLoginError({
      stage: 'provider_request',
      reason: 'play_services_unavailable',
    });
  }

  let response;
  try {
    response = await GoogleSignin.signIn();
  } catch (error) {
    const failure = getGoogleLoginFailure(error);
    if (!failure) return;
    throw new NativeLoginError(failure);
  }

  if (response.type === 'cancelled') return;

  if (!response.data.idToken) {
    throw new NativeLoginError({
      stage: 'credential_validation',
      reason: 'missing_identity_token',
    });
  }

  const isDispatched = callbackWhenSuccess({
    identityToken: response.data.idToken,
    authorizationCode: response.data.serverAuthCode ?? '',
    name: response.data.user.name,
    email: response.data.user.email,
    provider: 'google',
  });

  if (!isDispatched) {
    throw new NativeLoginError({
      stage: 'webview_dispatch',
      reason: 'webview_dispatch_failed',
    });
  }
};

export const loginWithApple = async (
  callbackWhenSuccess: LoginCallback,
): Promise<void> => {
  const isAvailable = await AppleAuthentication.isAvailableAsync();
  if (!isAvailable) {
    throw new NativeLoginError({
      stage: 'provider_request',
      reason: 'provider_unavailable',
    });
  }

  let credential;
  try {
    credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
  } catch (error) {
    const failure = getAppleLoginFailure(error);
    if (!failure) return;
    throw new NativeLoginError(failure);
  }

  if (!credential.identityToken || !credential.authorizationCode) {
    throw new NativeLoginError({
      stage: 'credential_validation',
      reason: 'missing_provider_credential',
    });
  }

  const isDispatched = callbackWhenSuccess({
    identityToken: credential.identityToken,
    authorizationCode: credential.authorizationCode,
    name: `${credential.fullName?.familyName ?? ''}${credential.fullName?.givenName ?? ''}`,
    email: credential.email ?? '',
    provider: 'apple',
  });

  if (!isDispatched) {
    throw new NativeLoginError({
      stage: 'webview_dispatch',
      reason: 'webview_dispatch_failed',
    });
  }
};
