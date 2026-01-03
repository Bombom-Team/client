import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { getChallenges } from './challenges.api';
import type { GetChallengesParams } from './challenges.api';

const CHALLENGES_STALE_TIME = 1000 * 60; // 1 minute
const CHALLENGES_GC_TIME = 1000 * 60 * 5; // 5 minutes

export const challengesQueries = {
  all: ['challenges'] as const,

  list: (params: GetChallengesParams = {}) =>
    queryOptions({
      queryKey: ['challenges', params] as const,
      queryFn: () => getChallenges(params),
      placeholderData: keepPreviousData,
      staleTime: CHALLENGES_STALE_TIME,
      gcTime: CHALLENGES_GC_TIME,
    }),
};
