import { logger } from '@bombom/shared/utils';

const ALLOWED_CAMPAIGN_PARAMS = new Set([
  'utm_campaign',
  'utm_content',
  'utm_id',
  'utm_medium',
  'utm_source',
  'utm_term',
]);

const sanitizeAnalyticsUrl = (rawUrl: string) => {
  if (!rawUrl) return '';

  const url = new URL(rawUrl, window.location.origin);
  const campaignParams = new URLSearchParams();

  url.searchParams.forEach((value, key) => {
    if (ALLOWED_CAMPAIGN_PARAMS.has(key)) {
      campaignParams.append(key, value);
    }
  });

  url.search = campaignParams.toString();
  url.hash = '';

  return url.toString();
};

export const initGA = (googleAnalyticsId: string) => {
  // 회원 정보가 포함된 URL을 사용하는 가입 리다이렉트 페이지는 측정하지 않는다.
  if (['/signup', '/signup/'].includes(window.location.pathname)) return;

  if (!googleAnalyticsId) {
    logger.warn('[GA] Measurement ID missing');
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', googleAnalyticsId, {
    page_location: sanitizeAnalyticsUrl(window.location.href),
    page_referrer: sanitizeAnalyticsUrl(document.referrer),
  });
};
