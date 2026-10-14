import { logger } from '@bombom/shared/utils';

interface TrackEventParams {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

type GAEventValue = string | number | boolean;

export type GAEventParams = Record<string, GAEventValue | undefined>;

export const trackGAEvent = (eventName: string, params: GAEventParams = {}) => {
  if (typeof window.gtag !== 'function') {
    logger.warn('[GA] gtag is not initialized');
    return;
  }

  const definedParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined),
  );

  window.gtag('event', eventName, definedParams);
};

export const trackEvent = ({
  category,
  action,
  label,
  value,
}: TrackEventParams) => {
  trackGAEvent(action, {
    event_category: category,
    event_label: label,
    value,
  });
};
