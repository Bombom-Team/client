import { ENV } from '@/constants/env';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';

export type NativeLoginProvider = 'google' | 'apple';

export type NativeLoginFailure =
  | {
      stage: 'provider_request'; // 구글/애플 네이티브 SDK 호출 과정
      reason:
        | 'provider_configuration' // SDK 초기화 설정 누락/오류
        | 'play_services_unavailable' // Google Play 서비스 미지원/구버전
        | 'provider_unavailable' // Apple 로그인 미지원 기기/환경
        | 'provider_request_failed'; // SDK 요청 실패(알 수 없는 네이티브 예외)
    }
  | {
      stage: 'credential_validation'; // 네이티브 인증은 성공했으나 필수 토큰이 비어있는 상태
      reason:
        | 'missing_identity_token' // Google idToken 누락
        | 'missing_provider_credential'; // Apple identityToken 또는 authorizationCode 누락
    }
  | {
      stage: 'webview_dispatch'; // 네이티브에서 WebView로 토큰을 postMessage하는 단계
      reason: 'webview_dispatch_failed'; // WebView 인스턴스 부재 또는 postMessage 실패
    };


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
