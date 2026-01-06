import { useCallback, useMemo } from 'react';
import { findWeekIndex, groupingWeeks } from '../utils/date';
import { isToday } from '@/utils/date';
import type { Device } from '@/hooks/useDevice';

interface UseDateFilterParams {
  dates: string[];
  selectedDate: string;
  device: Device;
  onDateSelect: (date: string) => void;
}

export const useDateFilter = ({
  dates,
  selectedDate,
  device,
  onDateSelect,
}: UseDateFilterParams) => {
  const totalWeeks = groupingWeeks(dates);
  const selectedWeekIndex = findWeekIndex(totalWeeks, selectedDate);

  const latestDate = dates[dates.length - 1];
  const isLatestDateToday = latestDate ? isToday(new Date(latestDate)) : false;

  const displayDates = useMemo(
    () =>
      device === 'mobile'
        ? isLatestDateToday
          ? dates.slice(0, -1)
          : dates
        : (totalWeeks[selectedWeekIndex] ?? []),
    [dates, device, isLatestDateToday, selectedWeekIndex, totalWeeks],
  );

  const canGoPrev = selectedWeekIndex > 0;
  const canGoNext = selectedWeekIndex < totalWeeks.length - 1;

  const goToPrevWeek = useCallback(() => {
    if (canGoPrev) {
      const prevWeekDate = totalWeeks[selectedWeekIndex - 1]?.[0];
      if (prevWeekDate) {
        onDateSelect(prevWeekDate);
      }
    }
  }, [canGoPrev, onDateSelect, selectedWeekIndex, totalWeeks]);

  const goToNextWeek = useCallback(() => {
    if (canGoNext) {
      const nextWeekDate = totalWeeks[selectedWeekIndex + 1]?.[0];
      if (nextWeekDate) {
        onDateSelect(nextWeekDate);
      }
    }
  }, [canGoNext, onDateSelect, selectedWeekIndex, totalWeeks]);

  return {
    displayDates,
    canGoPrev,
    canGoNext,
    goToPrevWeek,
    goToNextWeek,
    latestDate,
    isLatestDateToday,
  };
};
