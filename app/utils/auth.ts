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
    };

export interface NativeLoginCredential {
  identityToken: string;
  authorizationCode: string;
  name: string | null;
  email: string;
  provider: NativeLoginProvider;
}

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

  if (
    code === statusCodes.SIGN_IN_CANCELLED ||
    code === statusCodes.IN_PROGRESS
  ) {
    return null;
  }

  // Android DEVELOPER_ERROR와 iOS 네이티브 configure 실패 코드.
  if (code === '10' || code === 'configure') {
    return {
      stage: 'provider_request',
      reason: 'provider_configuration',
    };
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
};

export const loginWithGoogle =
  async (): Promise<NativeLoginCredential | null> => {
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

    try {
      const hasPlayServices = await GoogleSignin.hasPlayServices();
      if (!hasPlayServices) {
        throw new NativeLoginError({
          stage: 'provider_request',
          reason: 'play_services_unavailable',
        });
      }

      const response = await GoogleSignin.signIn();
      if (response.type === 'cancelled') return null;

      if (!response.data.idToken) {
        throw new NativeLoginError({
          stage: 'credential_validation',
          reason: 'missing_identity_token',
        });
      }

      return {
        identityToken: response.data.idToken,
        authorizationCode: response.data.serverAuthCode ?? '',
        name: response.data.user.name,
        email: response.data.user.email,
        provider: 'google',
      };
    } catch (error) {
      if (error instanceof NativeLoginError) throw error;

      const failure = getGoogleLoginFailure(error);
      if (!failure) return null;
      throw new NativeLoginError(failure);
    }
  };

export const loginWithApple =
  async (): Promise<NativeLoginCredential | null> => {
    try {
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        throw new NativeLoginError({
          stage: 'provider_request',
          reason: 'provider_unavailable',
        });
      }

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken || !credential.authorizationCode) {
        throw new NativeLoginError({
          stage: 'credential_validation',
          reason: 'missing_provider_credential',
        });
      }

      return {
        identityToken: credential.identityToken,
        authorizationCode: credential.authorizationCode,
        name: `${credential.fullName?.familyName ?? ''}${credential.fullName?.givenName ?? ''}`,
        email: credential.email ?? '',
        provider: 'apple',
      };
    } catch (error) {
      if (error instanceof NativeLoginError) throw error;

      const failure = getAppleLoginFailure(error);
      if (!failure) return null;
      throw new NativeLoginError(failure);
    }
  };
