import { fetcher } from '@bombom/shared/apis';
import type { PageableResponse } from '@/apis/types/PageableResponse';
import type { Challenge, ChallengeStatus } from '@/types/challenge';

export type GetChallengesParams = {
  status?: ChallengeStatus;
  page?: number;
  size?: number;
  sort?: string[];
};

export type GetChallengesResponse = PageableResponse<Challenge>;

export const getChallenges = async (params: GetChallengesParams = {}) => {
  return fetcher.get<GetChallengesResponse>({
    path: '/challenges',
    query: params,
  });
};

export const getChallengeDetail = async (challengeId: number) => {
  return fetcher.get<Challenge>({
    path: `/challenges/${challengeId}`,
  });
};
