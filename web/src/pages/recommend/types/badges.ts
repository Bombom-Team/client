import type { components } from '@/types/openapi';

export type Badges =
  components['schemas']['MonthlyReadingRankResponse']['badges'];

export type MonthlyReadingBadgeGrade = 'GOLD' | 'SILVER' | 'BRONZE';
