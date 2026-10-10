import { Alert, type AlertButton } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import type { WebViewLoginFailureReason } from '@bombom/shared/webview';
import type { NativeLoginFailure } from '@/utils/auth';

type LoginFailureReason =
  | NativeLoginFailure['reason']
  | 'webview_dispatch_failed'
  | WebViewLoginFailureReason;

interface LoginFailureGuide {
  title: string;
  message: string;
  action: 'retry' | 'support' | 'confirm';
}

const SUPPORT_URL = 'https://e0pq0.channel.io/';
const SUPPORT_EMAIL = 'bombom.news7@gmail.com';

const RETRY_GUIDE: LoginFailureGuide = {
  title: '로그인을 완료하지 못했어요',
  message: '다시 로그인해주세요. 문제가 계속되면 문의하기로 알려주세요.',
  action: 'retry',
};

const CREDENTIAL_GUIDE: LoginFailureGuide = {
  title: '로그인을 완료하지 못했어요',
  message: '봄봄에서 확인이 필요한 문제가 발생했어요. 문의하기로 알려주세요.',
  action: 'support',
};

const LOGIN_FAILURE_GUIDES: Record<LoginFailureReason, LoginFailureGuide> = {
  provider_configuration: CREDENTIAL_GUIDE,
  play_services_unavailable: {
    title: 'Google Play 서비스를 확인해주세요',
    message:
      'Google Play 서비스를 최신 버전으로 업데이트한 뒤 다시 로그인해주세요. Google Play 서비스를 지원하지 않는 기기에서는 Google 로그인을 사용할 수 없어요.',
    action: 'confirm',
  },
  provider_unavailable: {
    title: 'Apple 로그인을 사용할 수 없어요',
    message:
      '이 기기에서는 Apple 로그인을 사용할 수 없어요. Apple 로그인이 가능한 기기에서 다시 시도해주세요.',
    action: 'confirm',
  },
  provider_request_failed: RETRY_GUIDE,
  missing_identity_token: CREDENTIAL_GUIDE,
  missing_provider_credential: CREDENTIAL_GUIDE,
  webview_dispatch_failed: {
    title: '로그인을 완료하지 못했어요',
    message:
      '앱을 완전히 종료한 뒤 다시 열어주세요. 문제가 계속되면 문의하기로 알려주세요.',
    action: 'support',
  },
  network_error: {
    title: '인터넷 연결을 확인해주세요',
    message:
      'Wi-Fi나 모바일 데이터가 연결되어 있는지 확인한 뒤 다시 로그인해주세요.',
    action: 'retry',
  },
  credential_validation_failed: CREDENTIAL_GUIDE,
  token_exchange_rejected: CREDENTIAL_GUIDE,
  reauthentication_required: {
    title: '다시 로그인이 필요해요',
    message: '‘다시 로그인’을 눌러 계정 인증을 다시 진행해주세요.',
    action: 'retry',
  },
  server_unavailable: {
    title: '지금은 로그인할 수 없어요',
    message: '일시적인 서비스 문제가 발생했어요. 잠시 후 다시 시도해주세요.',
    action: 'confirm',
  },
  too_many_requests: {
    title: '잠시 후 다시 로그인해주세요',
    message:
      '로그인이 일시적으로 제한됐어요. 잠시 기다렸다가 다시 시도해주세요.',
    action: 'confirm',
  },
  token_exchange_failed: RETRY_GUIDE,
};

const openLoginSupport = async () => {
  try {
    await WebBrowser.openBrowserAsync(SUPPORT_URL);
  } catch {
    Alert.alert(
      '문의 페이지를 열지 못했어요',
      `${SUPPORT_EMAIL}으로 로그인 방법과 문제가 발생한 상황을 알려주세요. 비밀번호나 인증 토큰은 보내지 마세요.`,
      [{ text: '확인' }],
    );
  }
};

interface ShowLoginFailureAlertParams {
  reason: LoginFailureReason;
  onRetry?: () => void;
}

export const showLoginFailureAlert = ({
  reason,
  onRetry,
}: ShowLoginFailureAlertParams) => {
  const guide = LOGIN_FAILURE_GUIDES[reason] ?? RETRY_GUIDE;
  const buttons: AlertButton[] = [
    { text: '문의하기', onPress: () => void openLoginSupport() },
    { text: '닫기', style: 'cancel' },
  ];

  if (guide.action === 'retry' && onRetry) {
    buttons.push({ text: '다시 로그인', onPress: onRetry });
  } else if (guide.action === 'confirm') {
    buttons[1] = { text: '확인' };
  } else {
    buttons.reverse();
  }

  Alert.alert(guide.title, guide.message, buttons, { cancelable: true });
};
