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
  const displayDates = useMemo(() => {
    return dates.filter((date) => today > date);
  }, [dates, today]);

  const displayWeeks = useMemo(() => {
    return groupingWeeks(displayDates);
  }, [displayDates]);

  const selectedWeekIndex = useMemo(() => {
    return findWeekIndex(displayWeeks, selectedDate);
  }, [selectedDate, displayWeeks]);

  const canGoPrevWeek = useMemo(() => {
    return selectedWeekIndex > 0;
  }, [selectedWeekIndex]);

  const canGoNextWeek = useMemo(() => {
    return selectedWeekIndex < displayWeeks.length - 1;
  }, [selectedWeekIndex, displayWeeks.length]);

  const goToPrevWeek = useCallback(() => {
    if (canGoPrevWeek) {
      const prevWeekDate = displayWeeks[selectedWeekIndex - 1]?.[0];
      if (prevWeekDate) {
        onDateSelect(prevWeekDate);
      }
    }
  }, [canGoPrevWeek, onDateSelect, selectedWeekIndex, displayWeeks]);

  const goToNextWeek = useCallback(() => {
    if (canGoNextWeek) {
      const nextWeekDate = displayWeeks[selectedWeekIndex + 1]?.[0];
      if (nextWeekDate) {
        onDateSelect(nextWeekDate);
      }
    }
  }, [canGoNextWeek, onDateSelect, selectedWeekIndex, displayWeeks]);

  return {
    displayDates,
    displayWeeks,
    selectedWeekIndex,
    canGoPrevWeek,
    canGoNextWeek,
    goToPrevWeek,
    goToNextWeek,
  };
};
