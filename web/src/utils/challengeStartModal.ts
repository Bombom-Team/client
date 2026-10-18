import { createStorage } from './localStorage';
import type { Challenge } from '@/apis/challenge/challenge.api';

const CHALLENGE_START_MODAL_DISMISSED_KEY = 'challenge-start-modal-dismissed';
const DAY_MS = 24 * 60 * 60 * 1000;
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

const CHALLENGE_START_MODAL_VISIBLE_DAYS = 3;

/** 기기 시간대와 관계없이 한국 시간 기준 날짜의 자정(UTC 표기) */
const getKstDayTime = (date: Date) => {
  const kstDate = new Date(date.getTime() + KST_OFFSET_MS);
  return Date.UTC(
    kstDate.getUTCFullYear(),
    kstDate.getUTCMonth(),
    kstDate.getUTCDate(),
  );
};

/** 한국 시간 기준, 시작일을 0으로 하는 경과 일수 (시작 전이면 음수) */
export const getDaysSinceStart = (startDate: string, now: Date) =>
  // 'YYYY-MM-DD'는 표준상 UTC 자정으로 파싱되므로 getKstDayTime과 같은 기준으로 비교된다.
  (getKstDayTime(now) - Date.parse(startDate)) / DAY_MS;

const isInStartModalPeriod = (startDate: string, now: Date) => {
  const daysSinceStart = getDaysSinceStart(startDate, now);
  return (
    daysSinceStart >= 0 && daysSinceStart < CHALLENGE_START_MODAL_VISIBLE_DAYS
  );
};

/** 참가 중이지만 아직 활동하지 않았고, 시작일부터 노출 기간 안에 있는 챌린지 */
export const findStartModalChallenge = (
  challenges: Challenge[],
  now: Date,
): Challenge | null =>
  challenges.find(
    ({ participationInfo, startDate }) =>
      participationInfo?.isJoined &&
      participationInfo.progress === 0 &&
      isInStartModalPeriod(startDate, now),
  ) ?? null;

export const createChallengeStartModalDismissStorage = (
  memberId: number,
  challengeId: number,
) =>
  createStorage<boolean>(
    `${CHALLENGE_START_MODAL_DISMISSED_KEY}:${memberId}:${challengeId}`,
    false,
  );
