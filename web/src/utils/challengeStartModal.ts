import { createStorage } from './localStorage';
import type { Challenge } from '@/apis/challenge/challenge.api';

const CHALLENGE_START_MODAL_DISMISSED_KEY = 'challenge-start-modal-dismissed';
const DAY_MS = 24 * 60 * 60 * 1000;

const CHALLENGE_START_MODAL_VISIBLE_DAYS = 3;

const toLocalMidnight = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

/** 시작일을 0으로 하는 경과 일수 (시작 전이면 음수) */
export const getDaysSinceStart = (startDate: string, today: Date) =>
  Math.round(
    (toLocalMidnight(today).getTime() -
      toLocalMidnight(new Date(startDate)).getTime()) /
      DAY_MS,
  );

const isInStartModalPeriod = (startDate: string, today: Date) => {
  const daysSinceStart = getDaysSinceStart(startDate, today);
  return (
    daysSinceStart >= 0 && daysSinceStart < CHALLENGE_START_MODAL_VISIBLE_DAYS
  );
};

/** 참가 중이면서 시작일부터 노출 기간 안에 있는 챌린지 */
export const findStartModalChallenge = (
  challenges: Challenge[],
  today: Date,
): Challenge | null =>
  challenges.find(
    (challenge) =>
      challenge.participationInfo?.isJoined &&
      isInStartModalPeriod(challenge.startDate, today),
  ) ?? null;

export const createChallengeStartModalDismissStorage = (
  memberId: number,
  challengeId: number,
) =>
  createStorage<boolean>(
    `${CHALLENGE_START_MODAL_DISMISSED_KEY}:${memberId}:${challengeId}`,
    false,
  );
