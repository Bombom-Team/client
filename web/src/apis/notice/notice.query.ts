import { queryOptions } from '@tanstack/react-query';
import {
  getNotices,
  getRepresentativeNotice,
  type GetNoticesParams,
} from './notice.api';

export const noticeQueries = {
  notices: (params?: GetNoticesParams) =>
    queryOptions({
      queryKey: ['notices', params],
      queryFn: () => getNotices(params ?? {}),
    }),

  representativeNotice: () =>
    queryOptions({
      queryKey: ['notices', 'representative'],
      queryFn: getRepresentativeNotice,
    }),
};
