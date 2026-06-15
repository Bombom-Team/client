import { queryOptions } from '@tanstack/react-query';
import {
  getMonthlyReadingRank,
  getMyMonthlyReadingRank,
  getStreakReadingRank,
  getMyStreakReadingRank,
  getReadingStatus,
  getUserInfo,
  getMySubscriptions,
  getUserProfile,
  getWarningVisible,
  getMyChallengeSummary,
  getMyOngoingChallenges,
  getMyCompletedChallenges,
  type GetMonthlyReadingRankParams,
  type GetStreakReadingRankParams,
  type GetMyCompletedChallengesParams,
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

  myChallengeSummary: () =>
    queryOptions({
      queryKey: ['members', 'me', 'challenges', 'summary'],
      queryFn: getMyChallengeSummary,
    }),

  myOngoingChallenges: () =>
    queryOptions({
      queryKey: ['members', 'me', 'challenges', 'ongoing'],
      queryFn: getMyOngoingChallenges,
    }),

  myCompletedChallenges: (params?: GetMyCompletedChallengesParams) =>
    queryOptions({
      queryKey: ['members', 'me', 'challenges', 'completed', params],
      queryFn: () => getMyCompletedChallenges(params),
    }),
};
