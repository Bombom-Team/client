import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { getNewsletters } from './newsletters.api';
import type { GetNewslettersParams } from './newsletters.api';

const NEWSLETTERS_STALE_TIME = 1000 * 60; // 1 minute
const NEWSLETTERS_GC_TIME = 1000 * 60 * 5; // 5 minutes

export const newslettersQueries = {
  all: ['newsletters'] as const,

  list: (params: GetNewslettersParams = {}) =>
    queryOptions({
      queryKey: ['newsletters', params] as const,
      queryFn: () => getNewsletters(params),
      placeholderData: keepPreviousData,
      staleTime: NEWSLETTERS_STALE_TIME,
      gcTime: NEWSLETTERS_GC_TIME,
    }),
};
