import { fetcher } from '@bombom/shared/apis';
import type { components } from '@/types/openapi';

export type Challenge = components['schemas']['ChallengeResponse'];

export type GetChallengesResponse = Challenge[];

export const getChallenges = async () => {
  return await fetcher.get<GetChallengesResponse>({
    path: '/challenges',
  });
};

export type GetChallengeEligibilityResponse =
  components['schemas']['ChallengeEligibilityResponse'];

export const getChallengeEligibility = async (challengeId: number) => {
  return await fetcher.get<GetChallengeEligibilityResponse>({
    path: `/challenges/${challengeId}/eligibility`,
  });
};

export const applyChallengeApplication = async (challengeId: number) => {
  return await fetcher.post({
    path: `/challenges/${challengeId}/application`,
  });
};

export const cancelChallengeApplication = async (challengeId: number) => {
  return await fetcher.delete({
    path: `/challenges/${challengeId}/application`,
  });
};

export type GetChallengeInfoResponse =
  components['schemas']['ChallengeInfoResponse'];

export const getChallengeInfo = async (challengeId: number) => {
  return await fetcher.get<GetChallengeInfoResponse>({
    path: `/challenges/${challengeId}`,
  });
};

export type TodayTodos = components['schemas']['TodayTodoResponse'][];

export type GetMemberChallengeProgressResponse =
  components['schemas']['MemberChallengeProgressResponse'];

export const getMemberChallengeProgress = async (challengeId: number) => {
  return await fetcher.get<GetMemberChallengeProgressResponse>({
    path: `/challenges/${challengeId}/progress/me`,
  });
};

export type GetTeamChallengeProgressResponse =
  components['schemas']['TeamChallengeProgressResponse'];

export const getTeamChallengeProgress = async (challengeId: number) => {
  return await fetcher.get<GetTeamChallengeProgressResponse>({
    path: `/challenges/${challengeId}/progress/team`,
  });
};

export type DailyGuideType = 'READ' | 'COMMENT';

export interface MyComment {
  exists: boolean;
  content: string | null;
  createdAt: string | null;
}

export interface DailyGuide {
  dayIndex: number;
  type: DailyGuideType;
  imageUrl: string;
  notice?: string;
  commentEnabled: boolean;
  myComment: MyComment;
}

export const getTodayDailyGuide = async (challengeId: number) => {
  return await fetcher.get<DailyGuide>({
    path: `/challenges/${challengeId}/daily-guides/today`,
  });
};

type PostDailyGuideCommentParams = {
  content: string;
};

export const postDailyGuideComment = async (
  challengeId: number,
  dayIndex: number,
  params: PostDailyGuideCommentParams,
) => {
  return await fetcher.post<PostDailyGuideCommentParams, never>({
    path: `/challenges/${challengeId}/daily-guides/${dayIndex}/my-comment`,
    body: params,
  });
};
