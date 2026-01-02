import { fetcher } from '@bombom/shared/apis';
import type { components } from '@/types/openapi';

export type Challenge = components['schemas']['ChallengeResponse'];

export type GetChallengesResponse = Challenge[];

export const getChallenges = async () => {
  return await fetcher.get<GetChallengesResponse>({
    path: '/challenges',
  });
};

export type ChallengeEligibilityResponse =
  components['schemas']['ChallengeEligibilityResponse'];

export const getChallengeEligibility = async (challengeId: number) => {
  return await fetcher.get<ChallengeEligibilityResponse>({
    path: `/challenges/${challengeId}/eligibility`,
  });
};

export const applyChallengeApplication = async (challengeId: number) => {
  return await fetcher.post({
    path: `/challenges/${challengeId}/application`,
  });
};

export const cancelChallengeApplication = async (challengeId: number) => {
  return await fetcher.delete({
    path: `/challenges/${challengeId}/application`,
  });
};
