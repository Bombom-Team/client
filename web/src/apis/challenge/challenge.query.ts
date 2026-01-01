import { queryOptions } from '@tanstack/react-query';
import {
  getChallenges,
  getChallengeEligibility,
  getChallengeComments,
  getChallengeCommentCandidateArticles,
  type GetChallengeCommentsParams,
  type GetChallengeCommentCandidateArticlesParams,
} from './challenge.api';

export const challengeQueries = {
  challenges: () =>
    queryOptions({
      queryKey: ['challenge', 'list'],
      queryFn: getChallenges,
    }),
  eligibility: (challengeId: number) =>
    queryOptions({
      queryKey: ['challenge', challengeId, 'eligibility'],
      queryFn: () => getChallengeEligibility(challengeId),
      enabled: !!challengeId,
    }),
  comments: (params: GetChallengeCommentsParams) =>
    queryOptions({
      queryKey: ['challenge', params.challengeId, 'comments', params],
      queryFn: () => getChallengeComments(params),
    }),
  commentCandidateArticles: (
    params: GetChallengeCommentCandidateArticlesParams,
  ) =>
    queryOptions({
      queryKey: ['challenge', 'comments', 'articles', 'candidates', params],
      queryFn: () => getChallengeCommentCandidateArticles(params),
    }),
};
