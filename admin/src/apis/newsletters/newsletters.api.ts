import { fetcher } from '@bombom/shared/apis';
import type { PageableResponse } from '@/apis/types/PageableResponse';
import type { Newsletter, NewsletterSortType } from '@/types/newsletter';

export type GetNewslettersParams = {
  keyword?: string;
  category?: string;
  sort?: NewsletterSortType;
  page?: number;
  size?: number;
};

export type GetNewslettersResponse = PageableResponse<Newsletter>;

export const getNewsletters = async (params: GetNewslettersParams = {}) => {
  return fetcher.get<GetNewslettersResponse>({
    path: '/newsletters',
    query: params,
  });
};
