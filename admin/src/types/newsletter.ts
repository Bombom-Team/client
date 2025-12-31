import type { components, operations } from '@/types/openapi';

export type NewsletterSummary =
  components['schemas']['GetNewsletterSummaryResponse'];

export type NewsletterDetail = components['schemas']['GetNewsletterResponse'];

export type CreateNewsletterRequest =
  components['schemas']['CreateNewsletterRequest'];

export type UpdateNewsletterRequest =
  components['schemas']['UpdateNewsletterRequest'];

export type NewsletterPreviousStrategy = NonNullable<
  components['schemas']['UpdateNewsletterRequest']['previousStrategy']
>;

export type NewsletterSortType = NonNullable<
  NonNullable<operations['getNewsletters']['parameters']['query']>['sort']
>;

export const NEWSLETTER_PREVIOUS_STRATEGY_LABELS: Record<
  NewsletterPreviousStrategy,
  string
> = {
  FIXED_WITH_RECENT: '고정+최근',
  FIXED_ONLY: '고정만',
  RECENT_ONLY: '최근만',
  INACTIVE: '비활성',
};

export const NEWSLETTER_SORT_LABELS: Record<NewsletterSortType, string> = {
  LATEST: '최신순',
  POPULAR: '인기순',
};
