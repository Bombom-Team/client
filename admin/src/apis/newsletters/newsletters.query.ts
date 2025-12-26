import {
  keepPreviousData,
  queryOptions,
  useMutation,
} from '@tanstack/react-query';
import {
  getNewsletterDetail,
  getNewsletters,
  type GetNewslettersParams,
  deleteNewsletter,
} from './newsletters.api';

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

  detail: (id: number) =>
    queryOptions({
      queryKey: ['newsletters', 'detail', id] as const,
      queryFn: () => getNewsletterDetail(id),
      staleTime: NEWSLETTERS_STALE_TIME,
      gcTime: NEWSLETTERS_GC_TIME,
    }),
};

export const useDeleteNewsletter = () => {
  return useMutation({
    mutationFn: deleteNewsletter,
  });
};
