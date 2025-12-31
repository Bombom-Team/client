import { fetcher } from '@bombom/shared/apis';
import type {
  CreateNewsletterRequest,
  NewsletterDetail,
  NewsletterSummary,
  UpdateNewsletterRequest,
} from '@/types/newsletter';
import type { operations } from '@/types/openapi';

export type GetNewslettersParams =
  operations['getNewsletters']['parameters']['query'];

export type GetNewslettersResponse = NewsletterSummary[];

export const getNewsletters = async (params: GetNewslettersParams = {}) => {
  return fetcher.get<GetNewslettersResponse>({
    path: '/newsletters',
    query: params,
  });
};

export const createNewsletter = async (payload: CreateNewsletterRequest) => {
  return fetcher.post<CreateNewsletterRequest, void>({
    path: '/newsletters',
    body: payload,
  });
};

export const getNewsletterDetail = async (newsletterId: number) => {
  return fetcher.get<NewsletterDetail>({
    path: `/newsletters/${newsletterId}`,
  });
};

export const updateNewsletter = async ({
  newsletterId,
  payload,
}: {
  newsletterId: number;
  payload: UpdateNewsletterRequest;
}) => {
  return fetcher.patch<UpdateNewsletterRequest, void>({
    path: `/newsletters/${newsletterId}`,
    body: payload,
  });
};

export const deleteNewsletter = async (newsletterId: number) => {
  return fetcher.delete({
    path: `/newsletters/${newsletterId}`,
  });
};
