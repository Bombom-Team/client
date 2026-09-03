import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { getFaqs, type GetFaqsParams } from './faq.api';

export const faqQueries = {
  faqs: (params?: GetFaqsParams) =>
    queryOptions({
      queryKey: ['faqs', params],
      queryFn: () => getFaqs(params ?? {}),
    }),
  infiniteFaqs: (params?: GetFaqsParams) =>
    infiniteQueryOptions({
      queryKey: ['faqs', 'infinite', params],
      queryFn: ({ pageParam = 0 }) => getFaqs({ ...params, page: pageParam }),
      getNextPageParam: (lastPage) => {
        if (!lastPage || lastPage.last) return;
        return (lastPage.number ?? 0) + 1;
      },
      initialPageParam: 0,
    }),
};
