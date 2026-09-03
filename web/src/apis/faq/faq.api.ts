import { fetcher } from '@bombom/shared/apis';
import type { PageableResponse } from '@/apis/types/PageableResponse';
import type { Faq, FaqCategoryType } from '@/types/faq';

export type GetFaqsParams = {
  faqCategory?: FaqCategoryType;
  page?: number;
  size?: number;
};

export const getFaqs = async (params: GetFaqsParams = {}) => {
  return fetcher.get<PageableResponse<Faq>>({
    path: '/faqs',
    query: params,
  });
};
