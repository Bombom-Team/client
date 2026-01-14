import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import {
  getChallenges,
  getChallengeEligibility,
  getChallengeInfo,
  getMemberChallengeProgress,
  getChallengeTeamsProgress,
  getChallengeTeams,
  getChallengeCommentCandidateArticles,
  getChallengeComments,
  getTodayDailyGuide,
  getChallengeArticleHighlights,
  getDailyGuideComments,
} from './challenge.api';
import type {
  GetChallengeCommentCandidateArticlesParams,
  GetChallengeCommentsParams,
  GetChallengeArticleHighlightsParams,
  GetDailyGuideCommentsParams,
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
  challengeTeams: (challengeId: number) =>
    queryOptions({
      queryKey: ['challenges', challengeId, 'teams'],
      queryFn: () => getChallengeTeams(challengeId),
    }),
  challengeTeamsProgress: (challengeId: number, teamId: number) =>
    queryOptions({
      queryKey: ['challenges', challengeId, 'teams', teamId, 'progress'],
      queryFn: () => getChallengeTeamsProgress(challengeId, teamId),
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
  challengeArticleHighlights: (params: GetChallengeArticleHighlightsParams) =>
    queryOptions({
      queryKey: [
        'challenges',
        'comments',
        'articles',
        params.articleId,
        'highlights',
        params,
      ],
      queryFn: () => getChallengeArticleHighlights(params),
    }),
  todayDailyGuide: (challengeId: number) =>
    queryOptions({
      queryKey: ['challenges', challengeId, 'daily-guide', 'today'],
      queryFn: () => getTodayDailyGuide(challengeId),
    }),
  dailyGuideComments: (params: GetDailyGuideCommentsParams) =>
    queryOptions({
      queryKey: [
        'challenges',
        params.challengeId,
        'daily-guides',
        params.dayIndex,
        params,
      ],
      queryFn: () => getDailyGuideComments(params),
    }),
};
