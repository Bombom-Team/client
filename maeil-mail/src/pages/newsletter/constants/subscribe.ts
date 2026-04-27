import type {
  NewsletterLandingConfig,
  SubscribeTrack,
} from '../types/subscribe';

export const MAEIL_MAIL_LANDING_CONFIG: NewsletterLandingConfig = {
  name: '매일메일',
  primaryColor: '#17C881',
  launchDate: '2026.05.01',
};

type TrackOption = {
  value: SubscribeTrack;
  label: string;
};

export const TRACKS: TrackOption[] = [
  { value: 'FE', label: '프론트엔드' },
  { value: 'BE', label: '백엔드' },
];
