import { fetcher } from '@bombom/shared/apis';
import type { components, operations } from '@/types/openapi';

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

export type PostChallengeCommentParams =
  components['schemas']['ChallengeCommentRequest'];

export const postChallengeComment = async (
  challengeId: number,
  params: PostChallengeCommentParams,
) => {
  return await fetcher.post<PostChallengeCommentParams, never>({
    path: `/challenges/${challengeId}/comments`,
    body: params,
  });
};
