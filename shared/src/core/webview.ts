import type { OAuthProvider } from './types/auth';

export type WebViewLoginFailureReason =
  | 'network_error'
  | 'reauthentication_required'
  | 'credential_validation_failed'
  | 'token_exchange_rejected'
  | 'server_unavailable'
  | 'too_many_requests'
  | 'token_exchange_failed';

export interface WebViewLoginFailure {
  error?: string;
  provider?: OAuthProvider;
  reason?: WebViewLoginFailureReason;
}

// 앱이 WebView 로드 전에 기기 선호 언어 목록을 넣어 두는 전역 변수 이름
export const DEVICE_LANGUAGES_KEY = '__BOMBOM_DEVICE_LANGUAGES__';

export interface WindowWithDeviceLanguages extends Window {
  [DEVICE_LANGUAGES_KEY]?: unknown;
}

export interface WindowWithWebkit extends Window {
  webkit?: {
    messageHandlers?: {
      ReactNativeWebView?: {
        postMessage: (message: string) => void;
      };
    };
  };
}

export type WebToRNMessage =
  | { type: 'SHOW_LOGIN_SCREEN' }
  | {
      type: 'LOGIN_SUCCESS';
      payload?: { isAuthenticated?: boolean; provider?: OAuthProvider };
    }
  | {
      type: 'LOGIN_FAILED';
      payload?: WebViewLoginFailure;
    }
  | { type: 'OPEN_BROWSER'; payload: { url: string } }
  | { type: 'REQUEST_DEVICE_UUID' }
  | {
      type: 'CHECK_NOTIFICATION_PERMISSION';
    }
  | {
      type: 'SHOW_NOTIFICATION_PERMISSION_SETTING';
    }
  | { type: 'REGISTER_FCM_TOKEN'; payload: { memberId: number } }
  | { type: 'WEB_READY' }
  | {
      type: 'SAVE_IMAGE';
      payload: { imageFileBase64: string; fileName: string };
    };

export type RNToWebMessage =
  | {
      type: 'GOOGLE_LOGIN_TOKEN';
      payload: {
        identityToken: string;
        authorizationCode?: string;
        email: string;
        name: string;
      };
    }
  | {
      type: 'APPLE_LOGIN_TOKEN';
      payload: {
        identityToken: string;
        authorizationCode: string;
        email: string;
        name: string;
      };
    }
  | {
      type: 'NOTIFICATION_ROUTING';
      payload: {
        url: string;
      };
    }
  | {
      type: 'DEVICE_UUID';
      payload: {
        deviceUuid: string;
      };
    }
  | {
      type: 'NOTIFICATION_PERMISSION';
      payload: {
        hasPermission: boolean;
      };
    };
