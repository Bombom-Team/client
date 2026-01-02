import { queryOptions } from '@tanstack/react-query';
import {
  getChallenges,
  getChallengeEligibility,
  getChallengeInfo,
  getMemberChallengeProgress,
  getTeamChallengeProgress,
  getChallengeComments,
  getChallengeCommentCandidateArticles,
  type GetChallengeCommentsParams,
  type GetChallengeCommentCandidateArticlesParams,
} from './challenge.api';

export const challengeQueries = {
  challenges: () =>
    queryOptions({
      queryKey: ['challenges', 'list'],
      queryFn: getChallenges,
    }),
  eligibility: (challengeId: number) =>
    queryOptions({
      queryKey: ['challenges', challengeId, 'eligibility'],
      queryFn: () => getChallengeEligibility(challengeId),
      enabled: !!challengeId,
    }),
  challengesInfo: (challengeId: number) =>
    queryOptions({
      queryKey: ['challenges', challengeId, 'info'],
      queryFn: () => getChallengeInfo(challengeId),
    }),
  memberProgress: (challengeId: number) =>
    queryOptions({
      queryKey: ['challenges', challengeId, 'progress', 'me'],
      queryFn: () => getMemberChallengeProgress(challengeId),
    }),
  teamProgress: (challengeId: number) =>
    queryOptions({
      queryKey: ['challenges', challengeId, 'progress', 'team'],
      queryFn: () => getTeamChallengeProgress(challengeId),
    }),
  comments: (params: GetChallengeCommentsParams) =>
    queryOptions({
      queryKey: ['challenges', params.challengeId, 'comments', params],
      queryFn: () => getChallengeComments(params),
    }),
  commentCandidateArticles: (
    params: GetChallengeCommentCandidateArticlesParams,
  ) =>
    queryOptions({
      queryKey: ['challenges', 'comments', 'articles', 'candidates', params],
      queryFn: () => getChallengeCommentCandidateArticles(params),
    }),
};
