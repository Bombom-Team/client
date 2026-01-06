import { useCallback } from 'react';
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
  const totalWeeks = groupingWeeks(dates);
  const selectedWeekIndex = findWeekIndex(totalWeeks, selectedDate);

  const displayDates = dates.filter((date) => today > date);

  const canGoPrevWeek = selectedWeekIndex > 0;
  const canGoNextWeek = selectedWeekIndex < totalWeeks.length - 1;

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
    displayDates,
    canGoPrevWeek,
    canGoNextWeek,
    goToPrevWeek,
    goToNextWeek,
  };
};
