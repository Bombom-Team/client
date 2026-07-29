import { useEffect } from 'react';
import { trackEvent } from './gaEvents';

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

const classifyByUA = (): string | null =>
  UA_MAP.find(([pattern]) => pattern.test(navigator.userAgent))?.[1] ?? null;

export const useReferrerTracking = () => {
  useEffect(() => {
    const referrer = document.referrer;
    const utmSource = new URLSearchParams(window.location.search)
      .get('utm_source')
      ?.trim();

    if (referrer || utmSource) return;

    const uaSource = classifyByUA();
    if (!uaSource) return;

    trackEvent({
      category: 'referrer',
      action: 'referrer_detected',
      label: uaSource,
    });
  }, []);
};
