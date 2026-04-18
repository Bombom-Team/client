export const NEWSLETTER_ID = 57;

export interface NewsletterLandingConfig {
  name: string;
  primaryColor: string;
  launchDate: string;
}

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
