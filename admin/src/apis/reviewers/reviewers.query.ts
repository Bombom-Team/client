import { queryOptions } from '@tanstack/react-query';
import {
  getMonthlyStats,
  getOpenAssignments,
  getReviewersWithStats,
} from './reviewers.api';

const REVIEWERS_STALE_TIME = 1000 * 30;

export const reviewersQueries = {
  all: ['reviewers'] as const,

  list: () =>
    queryOptions({
      queryKey: ['reviewers', 'list'] as const,
      queryFn: getReviewersWithStats,
      staleTime: REVIEWERS_STALE_TIME,
    }),

  monthlyStats: (year: number, month: number) =>
    queryOptions({
      queryKey: ['reviewers', 'stats', 'monthly', year, month] as const,
      queryFn: () => getMonthlyStats(year, month),
      staleTime: REVIEWERS_STALE_TIME,
    }),

  openAssignments: () =>
    queryOptions({
      queryKey: ['reviewers', 'assignments', 'open'] as const,
      queryFn: getOpenAssignments,
      staleTime: REVIEWERS_STALE_TIME,
    }),
};
