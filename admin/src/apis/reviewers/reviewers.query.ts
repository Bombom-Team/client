import { queryOptions } from '@tanstack/react-query';
import {
  getLeaderboard,
  getMonthlyStats,
  getOpenAssignments,
  getPrStats,
  getReviewersWithStats,
  getSetting,
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

  leaderboard: () =>
    queryOptions({
      queryKey: ['reviewers', 'leaderboard'] as const,
      queryFn: getLeaderboard,
      staleTime: REVIEWERS_STALE_TIME,
    }),

  setting: () =>
    queryOptions({
      queryKey: ['reviewers', 'setting'] as const,
      queryFn: getSetting,
      staleTime: REVIEWERS_STALE_TIME,
    }),

  prStats: () =>
    queryOptions({
      queryKey: ['reviewers', 'pr-stats'] as const,
      queryFn: getPrStats,
      staleTime: 1000 * 60 * 5, // GitHub API rate limit 보호
    }),
};
