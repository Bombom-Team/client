import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import {
  getChallenges,
  getChallengeEligibility,
  getChallengeInfo,
  getMemberChallengeProgress,
  getChallengeTeamProgress,
  getChallengeTeams,
  getTeamChallengeProgress,
  getChallengeCommentCandidateArticles,
  getChallengeComments,
  getTodayDailyGuide,
} from './challenge.api';
import type {
  GetChallengeCommentCandidateArticlesParams,
  GetChallengeCommentsParams,
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
  challengeTeams: (challengeId: number) =>
    queryOptions({
      queryKey: ['challenges', challengeId, 'teams'],
      queryFn: () => getChallengeTeams(challengeId),
      enabled: !!challengeId,
    }),
  challengeTeamProgress: (challengeId: number, teamId: number) =>
    queryOptions({
      queryKey: ['challenges', challengeId, 'teams', teamId, 'progress'],
      queryFn: () => getChallengeTeamProgress(challengeId, teamId),
      enabled: !!challengeId && !!teamId,
    }),
  comments: (params: GetChallengeCommentsParams) =>
    queryOptions({
      queryKey: ['challenges', params.challengeId, 'comments', params],
      queryFn: () => getChallengeComments(params),
    }),
  infiniteComments: (params: GetChallengeCommentsParams) =>
    infiniteQueryOptions({
      queryKey: [
        'challenges',
        params.challengeId,
        'comments',
        'infinite',
        params,
      ],
      queryFn: ({ pageParam = 0 }) =>
        getChallengeComments({
          ...params,
          page: pageParam,
        }),
      getNextPageParam: (lastPage) => {
        if (!lastPage || lastPage.last) return undefined;

        return (lastPage.number ?? 0) + 1;
      },
      initialPageParam: 0,
    }),
  challengeCommentCandidateArticles: (
    params: GetChallengeCommentCandidateArticlesParams,
  ) =>
    queryOptions({
      queryKey: ['challenges', 'comments', 'articles', 'candidates', params],
      queryFn: () => getChallengeCommentCandidateArticles(params),
    }),
  todayDailyGuide: (challengeId: number) =>
    queryOptions({
      queryKey: ['challenges', challengeId, 'daily-guide', 'today'],
      queryFn: () => getTodayDailyGuide(challengeId),
    }),
};
