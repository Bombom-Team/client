import { fetcher } from '@bombom/shared/apis';
import type { components, operations } from '@/types/openapi';

export type ChallengeStatus = 'BEFORE_START' | 'ONGOING' | 'COMPLETED';
export type ChallengeGrade = 'GOLD' | 'SILVER' | 'BRONZE' | 'NONE' | 'FAIL';

export interface ChallengeNewsletter {
  id: number;
  name: string;
  imageUrl: string;
}

export interface ChallengeDetail {
  isJoined?: boolean;
  progress?: number;
  grade?: ChallengeGrade;
  isSuccess?: boolean;
}

export interface Challenge {
  id: number;
  title: string;
  generation: number;
  startDate: Date;
  endDate: Date;
  participantCount: number;
  newsletters: ChallengeNewsletter[];
  status: ChallengeStatus;
  detail: ChallengeDetail;
}

export type GetChallengesResponse = Challenge[];

export const getChallenges = async () => {
  return await fetcher.get<GetChallengesResponse>({
    path: '/challenges',
  });
};

export type EligibilityReason =
  | 'NOT_LOGGED_IN'
  | 'NOT_SUBSCRIBED'
  | 'ALREADY_STARTED'
  | 'ALREADY_APPLIED'
  | 'ELIGIBLE';

export interface ChallengeEligibilityResponse {
  canApply: boolean;
  reason: EligibilityReason;
}

export const getChallengeEligibility = async (challengeId: number) => {
  return await fetcher.get<ChallengeEligibilityResponse>({
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

export type GetChallengeCommentsParams =
  operations['getChallengeComments']['parameters']['path'] &
    components['schemas']['ChallengeCommentOptionsRequest'] &
    components['schemas']['Pageable'];
export type GetChallengeCommentsResponse =
  components['schemas']['PageChallengeCommentResponse'];

export const getChallengeComments = async ({
  challengeId,
  ...params
}: GetChallengeCommentsParams) => {
  return await fetcher.get<GetChallengeCommentsResponse>({
    path: `/challenges/${challengeId}/comments`,
    query: params,
  });
};

export type GetChallengeCommentCandidateArticlesParams =
  operations['getChallengeCommentCandidateArticles']['parameters']['query'];
export type GetChallengeCommentCandidateArticlesResponse =
  components['schemas']['ChallengeCommentCandidateArticleResponse'][];

export const getChallengeCommentCandidateArticles = async (
  params: GetChallengeCommentCandidateArticlesParams,
) => {
  return await fetcher.get<GetChallengeCommentCandidateArticlesResponse>({
    path: '/challenges/comments/articles/candidates',
    query: params,
  });
};
