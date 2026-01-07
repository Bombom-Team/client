import { useCallback, useMemo, useState } from 'react';
import { getDisplayDates } from '../utils/date';

interface UseDateFilterParams {
  today: string;
  dates: string[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

const DATES_PER_PAGE = 5;

export const useDateFilter = ({
  today,
  dates,
  selectedDate,
  onDateSelect,
}: UseDateFilterParams) => {
  const displayDates = useMemo(() => {
    return getDisplayDates(dates, today);
  }, [dates, today]);

  const selectedDateIndex = useMemo(() => {
    const index = displayDates.indexOf(selectedDate);
    return index === -1 ? Math.max(displayDates.length - 1, 0) : index;
  }, [displayDates, selectedDate]);

  const [weekStartIndex, setWeekStartIndex] = useState(() => {
    return Math.floor(selectedDateIndex / DATES_PER_PAGE) * DATES_PER_PAGE;
  });

  const weekEndIndex = useMemo(() => {
    return Math.min(
      weekStartIndex + DATES_PER_PAGE - 1,
      displayDates.length - 1,
    );
  }, [weekStartIndex, displayDates.length]);

  const canGoPrevWeek = useMemo(() => {
    return weekStartIndex > 0;
  }, [weekStartIndex]);

  const canGoNextWeek = useMemo(() => {
    return weekEndIndex < displayDates.length - 1;
  }, [weekEndIndex, displayDates.length]);

  const goToPrevWeek = useCallback(() => {
    if (canGoPrevWeek) {
      const prevWeekStartIndex = Math.max(weekStartIndex - DATES_PER_PAGE, 0);
      setWeekStartIndex(prevWeekStartIndex);

      const prevWeekDate = displayDates[prevWeekStartIndex];
      if (prevWeekDate) {
        onDateSelect(prevWeekDate);
      }
    }
  }, [canGoPrevWeek, weekStartIndex, displayDates, onDateSelect]);

  const goToNextWeek = useCallback(() => {
    if (canGoNextWeek) {
      const nextWeekStartIndex = weekStartIndex + DATES_PER_PAGE;
      setWeekStartIndex(nextWeekStartIndex);

      const nextWeekDate = displayDates[nextWeekStartIndex];
      if (nextWeekDate) {
        onDateSelect(nextWeekDate);
      }
    }
  }, [canGoNextWeek, weekStartIndex, displayDates, onDateSelect]);

  return {
    displayDates,
    weekStartIndex,
    weekEndIndex,
    canGoPrevWeek,
    canGoNextWeek,
    goToPrevWeek,
    goToNextWeek,
  };
};
