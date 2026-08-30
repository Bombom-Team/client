import { queryOptions } from '@tanstack/react-query';
import { getFaqs, type GetFaqsParams } from './faq.api';

export const faqQueries = {
  faqs: (params?: GetFaqsParams) =>
    queryOptions({
      queryKey: ['faqs', params],
      queryFn: () => getFaqs(params ?? {}),
    }),
};
