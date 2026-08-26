import { fetcher } from '@bombom/shared/apis';
import type { PageableResponse } from '@/apis/types/PageableResponse';
import type { Faq, FaqCategoryType } from '@/types/faq';

export type GetFaqsParams = {
  page?: number;
  size?: number;
  sort?: string[];
};

export type GetFaqsResponse = PageableResponse<Faq>;

export type CreateFaqParams = {
  question: string;
  answer: string;
  faqCategory: FaqCategoryType;
};

export const getFaqs = async (params: GetFaqsParams = {}) => {
  return fetcher.get<GetFaqsResponse>({
    path: '/faqs',
    query: params,
  });
};

export const createFaq = async (payload: CreateFaqParams) => {
  return fetcher.post<CreateFaqParams, void>({
    path: '/faqs',
    body: payload,
  });
};

export const deleteFaq = async (faqId: number) => {
  return fetcher.delete({
    path: `/faqs/${faqId}`,
  });
};

export type UpdateFaqParams = Partial<CreateFaqParams>;

export const getFaqDetail = async (faqId: number) => {
  return fetcher.get<Faq>({
    path: `/faqs/${faqId}`,
  });
};

export const updateFaq = async ({
  faqId,
  payload,
}: {
  faqId: number;
  payload: UpdateFaqParams;
}) => {
  return fetcher.patch<UpdateFaqParams, void>({
    path: `/faqs/${faqId}`,
    body: payload,
  });
};
