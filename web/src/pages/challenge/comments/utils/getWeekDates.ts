import { getDatesInRange } from '@/utils/date';

export const getWeekDates = (startDate: string, endDate: string) => {
  const dateList = getDatesInRange(startDate, endDate);

  return dateList.reduce((weeks: string[][], currentDate: string, index) => {
    if (index % 7 === 0) {
      weeks.push([]);
    }

    weeks[weeks.length - 1]?.push(currentDate);
    return weeks;
  }, []);
};
