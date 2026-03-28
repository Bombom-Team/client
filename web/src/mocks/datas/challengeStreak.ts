import type { GetMemberChallengeStreakResponse } from '@/apis/challenge/challenge.api';

type Weekday = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY';

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const isWeekday = (date: Date) => {
  const day = date.getDay();
  return day !== 0 && day !== 6;
};

const getAdjacentWeekday = (date: Date, direction: -1 | 1) => {
  const nextDate = new Date(date);

  do {
    nextDate.setDate(nextDate.getDate() + direction);
  } while (!isWeekday(nextDate));

  return nextDate;
};

const getToday = () => {
  const today = new Date();
  return new Date(`${formatDate(today)}T00:00:00`);
};

const getWeekday = (date: Date): Weekday => {
  switch (date.getDay()) {
    case 1:
      return 'MONDAY';
    case 2:
      return 'TUESDAY';
    case 3:
      return 'WEDNESDAY';
    case 4:
      return 'THURSDAY';
    case 5:
      return 'FRIDAY';
    default:
      throw new Error('Weekend dates are not supported in streak mocks.');
  }
};

const getRecentWeekdays = (count: number) => {
  const dates = [getToday()];
  let currentDate = dates[0] as Date;

  while (dates.length < count) {
    currentDate = getAdjacentWeekday(currentDate, -1);
    dates.unshift(currentDate);
  }

  return dates;
};

const createResponse = ({
  streak,
  dayCount,
  shieldOffset,
}: {
  streak: number;
  dayCount: number;
  shieldOffset?: number;
}): GetMemberChallengeStreakResponse => {
  const dates = getRecentWeekdays(dayCount);

  return {
    streak,
    streakDays: dates.map((date, index) => ({
      date: formatDate(date),
      dayOfWeek: getWeekday(date),
      isCompleted: true,
      isShieldApplied: shieldOffset === index,
    })),
  };
};

export const CHALLENGE_STREAKS: Record<
  number,
  GetMemberChallengeStreakResponse
> = {
  1: createResponse({
    streak: 1,
    dayCount: 1,
  }),
  2: createResponse({
    streak: 2,
    dayCount: 2,
  }),
  3: createResponse({
    streak: 3,
    dayCount: 3,
    shieldOffset: 1,
  }),
  4: createResponse({
    streak: 5,
    dayCount: 5,
  }),
};

export const DEFAULT_CHALLENGE_STREAK =
  CHALLENGE_STREAKS[4] as GetMemberChallengeStreakResponse;
