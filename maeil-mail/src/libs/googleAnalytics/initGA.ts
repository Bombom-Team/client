import { logger } from '@bombom/shared/utils';

export const initGA = (googleAnalyticsId: string) => {
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
  window.gtag('config', googleAnalyticsId);
};
