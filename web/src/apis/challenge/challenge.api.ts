import { fetcher } from '@bombom/shared/apis';

export type ChallengeStatus = 'BEFORE_START' | 'ONGOING' | 'COMPLETED';
export type ChallengeGrade = 'GOLD' | 'SILVER' | 'BRONZE' | 'NONE' | 'FAIL';

export interface ChallengeDetail {
  isJoined?: boolean;
  progress?: number;
  grade?: ChallengeGrade;
  isSuccess?: boolean;
}

export interface Challenge {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  participantCount: number;
  status: ChallengeStatus;
  detail: ChallengeDetail;
}

export type GetChallengesResponse = Challenge[];

export const getChallenges = async () => {
  return await fetcher.get<GetChallengesResponse>({
    path: '/challenge',
  });
};

export type EligibilityReason =
  | 'NOT_LOGGED_IN'
  | 'NOT_SUBSCRIBED'
  | 'ALREADY_STARTED'
  | 'ALREADY_APPLIED'
  | 'ELIGIBLE';

export interface ChallengeEligibilityResponse {
  canApply: boolean;
  reasons: EligibilityReason[];
}

export const getChallengeEligibility = async (challengeId: number) => {
  return await fetcher.get<ChallengeEligibilityResponse>({
    path: `/challenge/${challengeId}/eligibility`,
  });
};
