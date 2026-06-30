import { fetcher } from '@bombom/shared/apis';
import type { components, operations } from '@/types/openapi';

type GetReadingStatusResponse =
  components['schemas']['ReadingInformationResponse'];

export const getReadingStatus = async () => {
  return await fetcher.get<GetReadingStatusResponse>({
    path: '/members/me/reading',
  });
};

type GetUserInfoResponse = components['schemas']['MemberInfoResponse'];

export const getUserInfo = async () => {
  return await fetcher.get<GetUserInfoResponse>({
    path: '/members/me',
  });
};

type GetUserProfileResponse = components['schemas']['MemberProfileResponse'];

export const getUserProfile = () =>
  fetcher.get<GetUserProfileResponse>({
    path: '/members/me/profile',
  });

type PatchWeeklyReadingGoalParams =
  operations['updateWeeklyGoalCount']['parameters']['query'];
type PatchWeeklyReadingGoalResponse =
  components['schemas']['WeeklyGoalCountResponse'];

export const patchWeeklyReadingGoal = async ({
  weeklyGoalCount,
}: PatchWeeklyReadingGoalParams) => {
  return await fetcher.patch<
    PatchWeeklyReadingGoalParams,
    PatchWeeklyReadingGoalResponse
  >({
    path: '/members/me/reading/progress/week/goal',
    query: {
      weeklyGoalCount,
    },
  });
};

export type GetMonthlyReadingRankResponse =
  components['schemas']['MonthlyReadingRankingResponse'];
export type GetMonthlyReadingRankParams =
  operations['getMonthlyReadingRank']['parameters']['query'];

export const getMonthlyReadingRank = async (
  params: GetMonthlyReadingRankParams,
) => {
  return await fetcher.get<GetMonthlyReadingRankResponse>({
    path: '/members/me/reading/month/rank',
    query: params,
  });
};

export type GetMyMonthlyReadingRankResponse =
  components['schemas']['MemberMonthlyReadingRankResponse'];

export const getMyMonthlyReadingRank = async () => {
  return await fetcher.get<GetMyMonthlyReadingRankResponse>({
    path: '/members/me/reading/month/rank/me',
  });
};

export type StreakReadingRankItem =
  components['schemas']['ContinueReadingRankResponse'];

export type GetStreakReadingRankResponse =
  components['schemas']['ContinueReadingRankingResponse'];

export type GetStreakReadingRankParams = {
  limit: number;
};

export const getStreakReadingRank = async (
  params: GetStreakReadingRankParams,
) => {
  return await fetcher.get<GetStreakReadingRankResponse>({
    path: '/members/me/reading/streak/rank',
    query: params,
  });
};

export type GetMyStreakReadingRankResponse =
  components['schemas']['MemberContinueReadingRankResponse'];

export const getMyStreakReadingRank = async () => {
  return await fetcher.get<GetMyStreakReadingRankResponse>({
    path: '/members/me/reading/streak/rank/me',
  });
};

export interface CategoryStat {
  id: number;
  name: string;
  count: number;
  percent: number;
}

export interface CategoryStatsResponse {
  type: 'cumulative' | 'monthly';
  total: number;
  categories: CategoryStat[];
}

export interface GetCategoryStatsParams {
  yearMonth?: string;
}

export const getCategoryStats = async ({
  yearMonth,
}: GetCategoryStatsParams = {}) => {
  return await fetcher.get<CategoryStatsResponse>({
    path: '/mypage/category-stats',
    query: yearMonth ? { yearMonth } : undefined,
  });
};

export type PatchMembersInfoParams =
  components['schemas']['MemberInfoUpdateRequest'];

export const patchMemberInfo = async (params: PatchMembersInfoParams) => {
  return await fetcher.patch<PatchMembersInfoParams, never>({
    path: '/members/me',
    body: params,
  });
};

export type SubscribedNewsletterResponse =
  components['schemas']['SubscribedNewsletterResponse'];
export type GetMySubscriptionsResponse = SubscribedNewsletterResponse[];

export const getMySubscriptions = async () => {
  return await fetcher.get<GetMySubscriptionsResponse>({
    path: '/members/me/subscriptions',
  });
};

export type PostNewsletterUnsubscribeParams =
  operations['unsubscribe']['parameters']['path'];

export const postNewsletterUnsubscribe = async ({
  subscriptionId,
}: PostNewsletterUnsubscribeParams) => {
  return await fetcher.post<never, never>({
    path: `/members/me/subscriptions/${subscriptionId}/unsubscribe`,
  });
};

export type getWarningVisibleResponse =
  components['schemas']['WarningSettingResponse'];

export const getWarningVisible = async () => {
  return await fetcher.get<getWarningVisibleResponse>({
    path: '/members/me/warning/near-capacity',
  });
};

export type PostWarningVisibleParams =
  components['schemas']['UpdateWarningSettingRequest'];

export const postWarningVisible = async ({
  isVisible,
}: PostWarningVisibleParams) => {
  return await fetcher.post({
    path: `/members/me/warning/near-capacity`,
    body: { isVisible },
  });
};

export type GetMyChallengeSummaryResponse = {
  completedChallengeCount: number;
  completionRank: {
    topPercent: number;
    completionRate: number;
  };
  attendanceRank: {
    topPercent: number;
    averageAttendanceRate: number;
  };
  medalRatio: {
    gold: number;
    silver: number;
    bronze: number;
  };
};

export const getMyChallengeSummary = async () => {
  return await fetcher.get<GetMyChallengeSummaryResponse>({
    path: '/members/me/challenges/summary',
  });
};

export type MyOngoingChallenge = {
  challengeId: number;
  title: string;
  startDate: string;
  endDate: string;
  remainingDays: number;
  progressRate: number;
  myTeamRank: {
    rank: number;
    totalMembers: number;
  };
  teamRank: {
    rank: number;
    totalTeams: number;
  };
  myAttendanceComparison: {
    attendanceRate: number;
    differencePoint: number;
  };
  teamAttendanceComparison: {
    teamAttendanceRate: number;
    differencePoint: number;
  };
};

export type GetMyOngoingChallengesResponse = {
  challenges: MyOngoingChallenge[];
};

export const getMyOngoingChallenges = async () => {
  return await fetcher.get<GetMyOngoingChallengesResponse>({
    path: '/members/me/challenges/ongoing',
  });
};

export type MyCompletedChallenge = {
  challengeId: number;
  title: string;
  startDate: string;
  endDate: string;
  attendanceRate: number;
  grade: 'GOLD' | 'SILVER' | 'BRONZE' | 'FAIL';
};

export type GetMyCompletedChallengesParams = {
  size?: number;
  page?: number;
};

export type GetMyCompletedChallengesResponse = {
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  size: number;
  content: MyCompletedChallenge[];
};

export const getMyCompletedChallenges = async (
  params?: GetMyCompletedChallengesParams,
) => {
  return await fetcher.get<GetMyCompletedChallengesResponse>({
    path: '/members/me/challenges/completed',
    query: params,
  });
};
