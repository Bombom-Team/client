import { queryOptions } from '@tanstack/react-query';
import {
  getChallenges,
  getChallengeEligibility,
  getChallengeInfo,
  getMemberChallengeProgress,
  getTeamChallengeProgress,
  getTodayDailyGuide,
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
  todayDailyGuide: (challengeId: number) =>
    queryOptions({
      queryKey: ['challenges', challengeId, 'daily-guide', 'today'],
      queryFn: () => getTodayDailyGuide(challengeId),
    }),
};
