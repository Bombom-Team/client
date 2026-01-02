import { queryOptions } from '@tanstack/react-query';
import {
  getChallenges,
  getChallengeEligibility,
  getChallengeInfo,
  getMemberChallengeProgress,
  getTeamChallengeProgress,
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
  challengesInfo: (challengeId: number) =>
    queryOptions({
      queryKey: ['challenge', challengeId, 'info'],
      queryFn: () => getChallengeInfo(challengeId),
    }),
  memberProgress: (challengeId: number) =>
    queryOptions({
      queryKey: ['challenge', challengeId, 'progress', 'me'],
      queryFn: () => getMemberChallengeProgress(challengeId),
    }),
  teamProgress: (challengeId: number) =>
    queryOptions({
      queryKey: ['challenge', challengeId, 'progress', 'team'],
      queryFn: () => getTeamChallengeProgress(challengeId),
    }),
};
