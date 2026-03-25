export type ChallengeStatus = 'BEFORE_START' | 'ONGOING' | 'COMPLETED';

export interface Challenge {
  id: number;
  name: string;
  generation: number;
  startDate: string;
  endDate: string;
}

export type ChallengeScheduleDayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export interface ChallengeSchedule {
  date: string;
  dayOfWeek: ChallengeScheduleDayOfWeek;
  dayIndex: number;
  dailyGuideType?: string;
  imageUrl?: string;
}

export interface ChallengeDailyGuide {
  id: number;
  challengeId: number;
  dayIndex: number;
  type: string;
  imageUrl: string;
  notice: string;
  commentEnabled: boolean;
}

export const CHALLENGE_STATUS_LABELS: Record<ChallengeStatus, string> = {
  BEFORE_START: '시작 전',
  ONGOING: '진행 중',
  COMPLETED: '완료',
};
