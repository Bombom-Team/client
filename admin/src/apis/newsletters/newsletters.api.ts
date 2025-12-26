import { fetcher } from '@bombom/shared/apis';
import type { PageableResponse } from '@/apis/types/PageableResponse';
import type {
  Newsletter,
  NewsletterDetail,
  NewsletterSortType,
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
