import { useCallback } from 'react';
import { filterWeekdays, formatDate, getDatesInRange } from '@/utils/date';

interface UseChallengeCommentDatesParams {
  startDate: string;
  endDate: string;
}

export const useChallengeCommentDates = ({
  startDate,
  endDate,
}: UseChallengeCommentDatesParams) => {
  const today = formatDate(new Date(), '-');
  const totalDates = getDatesInRange(startDate ?? today, endDate ?? today);
  const challengeDates = filterWeekdays(totalDates);

  const isFirstDay = useCallback(
    (targetDate: string) => {
      return targetDate === startDate;
    },
    [startDate],
  );

  const isChallengeEnd = useCallback(
    (targetDate: string) => {
      if (!endDate) return false;
      return targetDate > endDate;
    },
    [endDate],
  );

  return {
    today,
    totalDates,
    challengeDates,
    isFirstDay,
    isChallengeEnd,
  };
};
