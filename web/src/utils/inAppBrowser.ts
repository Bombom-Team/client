import { isWebView } from '@/utils/device';

// 서드파티 인앱브라우저 UA 토큰 (봄봄 네이티브 앱 'bombom'은 매칭되지 않음)
const IN_APP_BROWSER_UA_PATTERN =
  /KAKAOTALK|Instagram|Threads|Barcelona|FBAN|FBAV|FB_IAB|Line|NAVER\(inapp|DaumApps|BAND/i;

/**
 * 카카오톡·인스타그램·쓰레드 등 서드파티 인앱브라우저 여부를 판별한다.
 * 이 환경에서는 보안 정책상 구글 OAuth가 차단된다.
 * 봄봄 네이티브 앱 웹뷰(`isWebView()`)는 구글 로그인이 정상 동작하므로 제외한다.
 */
export const isInAppBrowser = (): boolean => {
  if (isWebView()) return false;
  return IN_APP_BROWSER_UA_PATTERN.test(navigator.userAgent);
};
