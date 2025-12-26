import { queryOptions } from '@tanstack/react-query';
import { getNotices, type GetNoticesParams } from './notice.api';

export const noticeQueries = {
  notices: (params?: GetNoticesParams) =>
    queryOptions({
      queryKey: ['notices', params],
      queryFn: () => getNotices(params ?? {}),
    }),
};
