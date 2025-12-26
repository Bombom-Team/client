import { fetcher } from '@bombom/shared/apis';
import type { PageableResponse } from '@/apis/types/PageableResponse';
import type {
  CreateNewsletterRequest,
  Newsletter,
  NewsletterDetail,
  NewsletterSortType,
  UpdateNewsletterRequest,
} from '@/types/newsletter';

export type GetNewslettersParams = {
  keyword?: string;
  category?: string;
  sort?: NewsletterSortType;
  page?: number;
  size?: number;
  previousStrategy?: string;
};

export type GetNewslettersResponse = PageableResponse<Newsletter>;

export const getNewsletters = async (params: GetNewslettersParams = {}) => {
  return fetcher.get<GetNewslettersResponse>({
    path: '/newsletters',
    query: params,
  });
};

export const getNewsletterDetail = async (id: number) => {
  return fetcher.get<NewsletterDetail>({
    path: `/newsletters/${id}`,
  });
};
export const deleteNewsletter = async (id: number) => {
  return fetcher.delete({
    path: `/newsletters/${id}`,
  });
};

export const createNewsletter = async (data: CreateNewsletterRequest) => {
  return fetcher.post({
    path: '/newsletters',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: data as any,
  });
};

export const updateNewsletter = async (data: UpdateNewsletterRequest) => {
  const { id, ...body } = data;
  return fetcher.patch({
    path: `/newsletters/${id}`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: body as any,
  });
};
