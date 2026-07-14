import { useEffect } from 'react';
import { trackEvent } from './gaEvents';

// referrer가 없을 때(Direct) UA로 인앱브라우저 출처 분류
const UA_MAP: Array<[RegExp, string]> = [
  [/KAKAOTALK/i, 'kakaotalk_inapp'],
  [/Instagram/i, 'instagram_inapp'],
  [/Threads|Barcelona/i, 'threads_inapp'],
  [/FBAN|FBAV|FB_IAB/i, 'facebook_inapp'],
  [/Line\//i, 'line_inapp'],
  [/NAVER\(inapp/i, 'naver_inapp'],
  [/DaumApps/i, 'daum_inapp'],
  [/BAND/i, 'band_inapp'],
  [/Blind/i, 'blind_inapp'],
];

const REFERRER_MAP: Array<[string, string]> = [
  // 국내
  ['naver.com', 'naver'],
  ['daum.net', 'daum'],
  ['band.us', 'band'],
  ['band.me', 'band'],
  ['teamblind.com', 'blind'],
  ['tistory.com', 'tistory'],
  ['brunch.co.kr', 'brunch'],
  // 글로벌 소셜
  ['threads.net', 'threads'],
  ['instagram.com', 'instagram'],
  ['facebook.com', 'facebook'],
  ['twitter.com', 'twitter'],
  ['x.com', 'twitter'],
  ['t.co', 'twitter'],
  ['linkedin.com', 'linkedin'],
  ['youtube.com', 'youtube'],
];

const classifyByUA = (): string | null =>
  UA_MAP.find(([pattern]) => pattern.test(navigator.userAgent))?.[1] ?? null;

const classifyReferrer = (referrer: string): string =>
  REFERRER_MAP.find(([domain]) => referrer.includes(domain))?.[1] ?? referrer;

export const useReferrerTracking = () => {
  useEffect(() => {
    const referrer = document.referrer;
    const isInternal = referrer.includes(window.location.hostname);

    if (!referrer || isInternal) {
      const uaSource = classifyByUA();
      if (uaSource) {
        trackEvent({
          category: 'referrer',
          action: 'referrer_detected',
          label: uaSource,
        });
      }
      return;
    }

    trackEvent({
      category: 'referrer',
      action: 'referrer_detected',
      label: classifyReferrer(referrer),
    });
  }, []);
};
