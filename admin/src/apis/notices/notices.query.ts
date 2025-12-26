import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import {
  getNotices,
  deleteNotice,
  getNoticeDetail,
  updateNotice,
} from './notices.api';
import type { GetNoticesParams } from './notices.api';

const NOTICES_STALE_TIME = 1000 * 60; // 1 minute
const NOTICES_GC_TIME = 1000 * 60 * 5; // 5 minutes

export const noticesQueries = {
  all: ['notices'] as const,

  list: (params: GetNoticesParams = {}) =>
    queryOptions({
      queryKey: ['notices', params] as const,
      queryFn: () => getNotices(params),
      placeholderData: keepPreviousData,
      staleTime: NOTICES_STALE_TIME,
      gcTime: NOTICES_GC_TIME,
    }),

  detail: (noticeId: number) =>
    queryOptions({
      queryKey: ['notices', 'detail', noticeId] as const,
      queryFn: () => getNoticeDetail(noticeId),
      staleTime: NOTICES_STALE_TIME,
      gcTime: NOTICES_GC_TIME,
    }),
  mutation: {
    delete: () => ({
      mutationFn: deleteNotice,
    }),
    update: () => ({
      mutationFn: updateNotice,
    }),
  },
};
