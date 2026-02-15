import { queryOptions } from '@tanstack/react-query';
import { getDashboardStats } from './dashboard.api';

const DASHBOARD_STATS_STALE_TIME = 1000 * 60; // 1 minute
const DASHBOARD_STATS_GC_TIME = 1000 * 60 * 5; // 5 minutes

export const dashboardQueries = {
  all: ['dashboard'] as const,

  stats: () =>
    queryOptions({
      queryKey: ['dashboard', 'stats'] as const,
      queryFn: getDashboardStats,
      staleTime: DASHBOARD_STATS_STALE_TIME,
      gcTime: DASHBOARD_STATS_GC_TIME,
    }),
};
