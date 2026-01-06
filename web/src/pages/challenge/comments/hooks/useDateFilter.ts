import { useCallback, useMemo } from 'react';
import { findWeekIndex, groupingWeeks } from '../utils/date';

interface UseDateFilterParams {
  today: string;
  dates: string[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

export const useDateFilter = ({
  today,
  dates,
  selectedDate,
  onDateSelect,
}: UseDateFilterParams) => {
  const totalWeeks = useMemo(() => {
    return groupingWeeks(dates);
  }, [dates]);

  const selectedWeekIndex = useMemo(() => {
    return findWeekIndex(totalWeeks, selectedDate);
  }, [selectedDate, totalWeeks]);

  const displayDates = useMemo(() => {
    return dates.filter((date) => today > date);
  }, [dates, today]);

  const canGoPrevWeek = useMemo(() => {
    return selectedWeekIndex > 0;
  }, [selectedWeekIndex]);

  const canGoNextWeek = useMemo(() => {
    return selectedWeekIndex < totalWeeks.length - 1;
  }, [selectedWeekIndex, totalWeeks.length]);

  const goToPrevWeek = useCallback(() => {
    if (canGoPrevWeek) {
      const prevWeekDate = totalWeeks[selectedWeekIndex - 1]?.[0];
      if (prevWeekDate) {
        onDateSelect(prevWeekDate);
      }
    }
  }, [canGoPrevWeek, onDateSelect, selectedWeekIndex, totalWeeks]);

  const goToNextWeek = useCallback(() => {
    if (canGoNextWeek) {
      const nextWeekDate = totalWeeks[selectedWeekIndex + 1]?.[0];
      if (nextWeekDate) {
        onDateSelect(nextWeekDate);
      }
    }
  }, [canGoNextWeek, onDateSelect, selectedWeekIndex, totalWeeks]);

  return {
    totalWeeks,
    selectedWeekIndex,
    displayDates,
    canGoPrevWeek,
    canGoNextWeek,
    goToPrevWeek,
    goToNextWeek,
  };
};
