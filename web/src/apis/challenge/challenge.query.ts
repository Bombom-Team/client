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
  getMyDailyGuideComment,
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
  comments: {
    all: (challengeId: number) =>
      ['challenges', challengeId, 'comments'] as const,
    list: (params: GetChallengeCommentsParams) =>
      queryOptions({
        queryKey: [
          ...challengeQueries.comments.all(params.challengeId),
          params,
        ],
        queryFn: () => getChallengeComments(params),
      }),
    infiniteList: (params: GetChallengeCommentsParams) =>
      infiniteQueryOptions({
        queryKey: [
          ...challengeQueries.comments.all(params.challengeId),
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
  },
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
  myDailyGuideComment: (challengeId: number, dayIndex: number) =>
    queryOptions({
      queryKey: [
        'challenges',
        challengeId,
        'daily-guides',
        dayIndex,
        'my-comment',
      ],
      queryFn: () => getMyDailyGuideComment(challengeId, dayIndex),
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
