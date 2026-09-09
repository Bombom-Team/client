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
      staleTime: 1000 * 60 * 60 * 24 * 3, // 3 days
      gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
    }),

  newsletterDetail: (params: GetNewsletterDetailParams) =>
    queryOptions({
      queryKey: ['newsletters', params.id],
      queryFn: () => getNewsletterDetail(params),
    }),
};
