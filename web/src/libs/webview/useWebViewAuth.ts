import { logger } from '@bombom/shared/utils';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { captureNativeLoginError } from './nativeLoginError';
import { addWebViewMessageListener, sendMessageToRN } from './webview.utils';
import { postAppleLogin, postGoogleLogin } from '@/apis/auth/auth.api';
import { isWebView } from '@/utils/device';
import type { NativeLoginErrorStage } from './nativeLoginError';
import type { RNToWebMessage } from '@bombom/shared/webview';

export const useWebViewAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isWebView()) return;

    const cleanup = addWebViewMessageListener(
      async (message: RNToWebMessage) => {
        if (
          message.type !== 'GOOGLE_LOGIN_TOKEN' &&
          message.type !== 'APPLE_LOGIN_TOKEN'
        ) {
          return;
        }

        const provider =
          message.type === 'GOOGLE_LOGIN_TOKEN' ? 'google' : 'apple';
        const providerLabel = provider === 'google' ? 'Google' : 'Apple';
        const login = provider === 'google' ? postGoogleLogin : postAppleLogin;
        let stage: NativeLoginErrorStage = 'credential_validation';

        try {
          if (!message.payload.identityToken) {
            throw new Error(`${providerLabel} 로그인 정보가 없습니다.`);
          }

          stage = 'token_exchange';
          const response = await login({
            identityToken: message.payload.identityToken,
            authorizationCode:
              message.type === 'GOOGLE_LOGIN_TOKEN'
                ? (message.payload.authorizationCode ?? '')
                : message.payload.authorizationCode,
            email: message.payload.email,
            nickname: message.payload.name,
          });

          if (!response) throw new Error(`${providerLabel} 로그인 실패`);

          sendMessageToRN({
            type: 'LOGIN_SUCCESS',
            payload: { isAuthenticated: true, provider },
          });

          if (!response.isRegistered) {
            navigate({
              to: '/signup',
              search: { email: response.email, name: response.nickname },
            });
            return;
          }

          window.location.reload();
        } catch (error) {
          logger.error(`${providerLabel} 로그인 실패`);
          captureNativeLoginError({ provider, error, stage });
          sendMessageToRN({
            type: 'LOGIN_FAILED',
            payload: {
              error: `${providerLabel} 로그인 처리 중 오류가 발생했습니다.`,
              provider,
            },
          });
        }
      },
    );

    return cleanup;
  }, [navigate]);
};
