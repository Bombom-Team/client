import { queryOptions } from '@tanstack/react-query';
import {
  getMonthlyReadingRank,
  getMyMonthlyReadingRank,
  getReadingStatus,
  getUserInfo,
  getMySubscriptions,
  getUserProfile,
  getWarningVisible,
  type GetMonthlyReadingRankParams,
} from './members.api';

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
