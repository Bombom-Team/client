import { useCallback, useMemo } from 'react';
import { filterWeekdays, formatDate, getDatesInRange } from '@/utils/date';

interface UseChallengeCommentDatesParams {
  startDate?: string;
  endDate?: string;
}

export const useChallengeCommentDates = ({
  startDate,
  endDate,
}: UseChallengeCommentDatesParams) => {
  const today = useMemo(() => formatDate(new Date(), '-'), []);

  const challengeDates = useMemo(() => {
    if (!startDate || !endDate) return [];
    return filterWeekdays(getDatesInRange(startDate, endDate));
  }, [endDate, startDate]);

  const isFirstDay = useCallback(
    (targetDate: string) => {
      return targetDate === startDate;
    },
    [startDate],
  );

  const isChallengeDay = useCallback(
    (targetDate: string) => {
      return challengeDates.includes(targetDate);
    },
    [challengeDates],
  );

  return {
    today,
    challengeDates,
    isFirstDay,
    isChallengeDay,
  };
};
