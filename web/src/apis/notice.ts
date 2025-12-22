import { fetcher } from '@bombom/shared/apis';
import type { components } from '@/types/openapi';

export type GetNoticesParams = components['schemas']['Pageable'];
export type GetNoticesResponse = components['schemas']['PageNoticeResponse'];

export const getNotices = async (params: GetNoticesParams) => {
  return await fetcher.get<GetNoticesResponse>({
    path: '/notices',
    query: params,
  });
};
