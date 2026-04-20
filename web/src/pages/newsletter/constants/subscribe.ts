import type {
  NewsletterLandingConfig,
  SubscribeTrack,
} from '../types/subscribe';

export const RESOURCE = 'MAEIL_MAIL';

export const NEWSLETTER_LANDING_CONFIG: Record<
  string,
  NewsletterLandingConfig
> = {
  [RESOURCE]: {
    name: '매일메일',
    primaryColor: '#17C881',
    launchDate: '2026.04.30',
  },
};

type TrackOption = {
  value: SubscribeTrack;
  label: string;
};

export const TRACKS: TrackOption[] = [
  { value: 'FE', label: '프론트엔드' },
  { value: 'BE', label: '백엔드' },
];
