import { queryOptions } from '@tanstack/react-query';
import {
  getLiteracyQuizChallenge,
  getLiteracyQuizRanking,
  getLiteracyQuizSummary,
} from './literacyQuiz.api';
import type {
  GetLiteracyQuizChallengeParams,
  GetLiteracyQuizRankingParams,
} from './literacyQuiz.api';

export const literacyQuizQueries = {
  literacyQuizSummary: () =>
    queryOptions({
      queryKey: ['literacy-quiz', 'summary'],
      queryFn: getLiteracyQuizSummary,
    }),

  literacyQuizRanking: (params: GetLiteracyQuizRankingParams) =>
    queryOptions({
      queryKey: ['literacy-quiz', 'ranking', params],
      queryFn: () => getLiteracyQuizRanking(params),
    }),

  literacyQuizChallenge: (params: GetLiteracyQuizChallengeParams) =>
    queryOptions({
      queryKey: ['literacy-quiz', 'challenges', params],
      queryFn: () => getLiteracyQuizChallenge(params),
      staleTime: Infinity,
    }),
};
