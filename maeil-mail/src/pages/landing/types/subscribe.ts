import type { components } from '@/types/openapi';

export interface NewsletterLandingConfig {
  name: string;
  primaryColor: string;
  launchDate: string;
}

export type SubscribeTrack =
  components['schemas']['MaeilMailSubscribeRequest']['tracks'][number];
