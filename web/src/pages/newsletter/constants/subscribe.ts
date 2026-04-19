import type { NewsletterLandingConfig } from '../types/subscribe';

export const NEWSLETTER_ID = 57;

export const NEWSLETTER_LANDING_CONFIG: Record<
  number,
  NewsletterLandingConfig
> = {
  [NEWSLETTER_ID]: {
    name: '매일메일',
    primaryColor: '#17C881',
    launchDate: '2026.04.30',
  },
};

export const TRACKS = [
  { value: 'FE', label: '프론트엔드' },
  { value: 'BE', label: '백엔드' },
] as const;
