import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { getFaqs, deleteFaq, getFaqDetail, updateFaq } from './faqs.api';
import type { GetFaqsParams } from './faqs.api';

const FAQS_STALE_TIME = 1000 * 60; // 1 minute
const FAQS_GC_TIME = 1000 * 60 * 5; // 5 minutes

export const faqsQueries = {
  all: ['faqs'] as const,

  list: (params: GetFaqsParams = {}) =>
    queryOptions({
      queryKey: ['faqs', params] as const,
      queryFn: () => getFaqs(params),
      placeholderData: keepPreviousData,
      staleTime: FAQS_STALE_TIME,
      gcTime: FAQS_GC_TIME,
    }),

  detail: (faqId: number) =>
    queryOptions({
      queryKey: ['faqs', 'detail', faqId] as const,
      queryFn: () => getFaqDetail(faqId),
      staleTime: FAQS_STALE_TIME,
      gcTime: FAQS_GC_TIME,
    }),
  mutation: {
    delete: () => ({
      mutationFn: deleteFaq,
    }),
    update: () => ({
      mutationFn: updateFaq,
    }),
  },
};
