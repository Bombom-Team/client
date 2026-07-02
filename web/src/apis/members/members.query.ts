import { queryOptions } from '@tanstack/react-query';
import {
  getCategoryStats,
  getRankSummary,
  getMonthlyReadingRank,
  getMyMonthlyReadingRank,
  getStreakReadingRank,
  getMyStreakReadingRank,
  getReadingStatus,
  getUserInfo,
  getMySubscriptions,
  getUserProfile,
  getWarningVisible,
  type GetMonthlyReadingRankParams,
  type GetRankSummaryParams,
  type GetStreakReadingRankParams,
  type GetCategoryStatsParams,
} from './members.api';

const getCurrentCategoryStatsParams = (): GetCategoryStatsParams => {
  const now = new Date();

  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  };
};

export const membersQueries = {
  me: () =>
    queryOptions({
      queryKey: ['members', 'me'],
      queryFn: getUserInfo,
    }),

  userProfile: () =>
    queryOptions({
      queryKey: ['members', 'me', 'profile'],
      queryFn: getUserProfile,
      staleTime: 5 * 60 * 1000, // 5분
      refetchOnWindowFocus: false, // 탭 이동해도 안 튀게
    }),

  readingStatus: () =>
    queryOptions({
      queryKey: ['members', 'me', 'reading'],
      queryFn: getReadingStatus,
    }),

  monthlyReadingRank: (params: GetMonthlyReadingRankParams) =>
    queryOptions({
      queryKey: ['members', 'me', 'reading', 'month', 'rank', params],
      queryFn: () => getMonthlyReadingRank(params),
    }),

  myMonthlyReadingRank: () =>
    queryOptions({
      queryKey: ['members', 'me', 'reading', 'month', 'rank', 'me'],
      queryFn: () => getMyMonthlyReadingRank(),
    }),

  streakReadingRank: (params: GetStreakReadingRankParams) =>
    queryOptions({
      queryKey: ['members', 'me', 'reading', 'streak', 'rank', params],
      queryFn: () => getStreakReadingRank(params),
    }),

  myStreakReadingRank: () =>
    queryOptions({
      queryKey: ['members', 'me', 'reading', 'streak', 'rank', 'me'],
      queryFn: () => getMyStreakReadingRank(),
    }),

  rankSummary: (params: GetRankSummaryParams = {}) =>
    queryOptions({
      queryKey: ['mypage', 'rank', params],
      queryFn: () => getRankSummary(params),
    }),

  categoryStats: (
    params: GetCategoryStatsParams = getCurrentCategoryStatsParams(),
  ) =>
    queryOptions({
      queryKey: ['mypage', 'category-stats', params],
      queryFn: () => getCategoryStats(params),
    }),

  mySubscriptions: () =>
    queryOptions({
      queryKey: ['members', 'me', 'subscriptions'],
      queryFn: getMySubscriptions,
    }),

  warningVisibleStatus: () =>
    queryOptions({
      queryKey: ['members', 'me', 'warning', 'near-capacity'],
      queryFn: () => getWarningVisible(),
    }),
};
