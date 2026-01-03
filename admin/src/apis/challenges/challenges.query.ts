import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import {
  getChallengeDetail,
  getChallengeParticipants,
  getChallenges,
  assignChallengeTeams,
} from './challenges.api';
import type {
  AssignChallengeTeamsParams,
  GetChallengeParticipantsParams,
  GetChallengesParams,
} from './challenges.api';

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

  detail: (challengeId: number) =>
    queryOptions({
      queryKey: ['challenges', 'detail', challengeId] as const,
      queryFn: () => getChallengeDetail(challengeId),
      staleTime: CHALLENGES_STALE_TIME,
      gcTime: CHALLENGES_GC_TIME,
    }),

  participants: (challengeId: number, params: GetChallengeParticipantsParams) =>
    queryOptions({
      queryKey: ['challenges', 'participants', challengeId, params] as const,
      queryFn: () => getChallengeParticipants({ challengeId, params }),
      placeholderData: keepPreviousData,
      staleTime: CHALLENGES_STALE_TIME,
      gcTime: CHALLENGES_GC_TIME,
    }),
  mutation: {
    assignTeams: () => ({
      mutationFn: (params: AssignChallengeTeamsParams) =>
        assignChallengeTeams(params),
    }),
  },
};
