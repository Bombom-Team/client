import { queryOptions } from '@tanstack/react-query';
import {
  getNewsletterDetail,
  getNewsletters,
  type GetNewsletterDetailParams,
} from './newsletters.api';

export const newslettersQueries = {
  newsletters: () =>
    queryOptions({
      queryKey: ['newsletters'],
      queryFn: getNewsletters,
      staleTime: 1000 * 60 * 60 * 24, // 1 day
      gcTime: 1000 * 60 * 60 * 24, // 1 day
    }),

  newsletterDetail: (params: GetNewsletterDetailParams) =>
    queryOptions({
      queryKey: ['newsletters', params.id],
      queryFn: () => getNewsletterDetail(params),
    }),
};
