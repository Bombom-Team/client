import { queryOptions } from '@tanstack/react-query';
import { getNotificationStats } from './notificationStats.api';
import type { GetNotificationStatsParams } from './notificationStats.api';

const NOTIFICATION_STATS_STALE_TIME = 1000 * 60; // 1 minute
const NOTIFICATION_STATS_GC_TIME = 1000 * 60 * 5; // 5 minutes

export const notificationStatsQueries = {
  stats: (params: GetNotificationStatsParams) =>
    queryOptions({
      queryKey: ['notifications', 'admin', 'stats', params] as const,
      queryFn: () => getNotificationStats(params),
      staleTime: NOTIFICATION_STATS_STALE_TIME,
      gcTime: NOTIFICATION_STATS_GC_TIME,
    }),
};
