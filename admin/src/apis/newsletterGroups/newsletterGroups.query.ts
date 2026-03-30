import { queryOptions } from '@tanstack/react-query';
import { getNewsletterGroups } from './newsletterGroups.api';

const NEWSLETTER_GROUPS_STALE_TIME = 1000 * 60; // 1 minute
const NEWSLETTER_GROUPS_GC_TIME = 1000 * 60 * 5; // 5 minutes

export const newsletterGroupsQueries = {
  all: ['newsletter-groups'] as const,

  list: () =>
    queryOptions({
      queryKey: ['newsletter-groups', 'list'] as const,
      queryFn: () => getNewsletterGroups(),
      staleTime: NEWSLETTER_GROUPS_STALE_TIME,
      gcTime: NEWSLETTER_GROUPS_GC_TIME,
    }),
};
