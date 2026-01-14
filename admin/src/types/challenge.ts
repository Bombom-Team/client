export type ChallengeStatus = 'BEFORE_START' | 'ONGOING' | 'COMPLETED';

export interface Challenge {
  id: number;
  name: string;
  generation: number;
  startDate: string;
  endDate: string;
}

export const CHALLENGE_STATUS_LABELS: Record<ChallengeStatus, string> = {
  BEFORE_START: '시작 전',
  ONGOING: '진행 중',
  COMPLETED: '완료',
};
