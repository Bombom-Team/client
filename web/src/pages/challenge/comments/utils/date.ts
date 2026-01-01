import { getDatesInRange } from '@/utils/date';

export const findWeekIndex = (weeks: string[][], date: string) => {
  const index = weeks.findIndex((week) => week.includes(date));
  return index === -1 ? Math.max(weeks.length - 1, 0) : index;
};

export const getWeekDates = (startDate: string, endDate: string) => {
  const dateList = getDatesInRange(startDate, endDate);

  const weekdays = dateList.filter((date) => {
    const day = new Date(date).getDay();
    return day !== 0 && day !== 6;
  });

  return weekdays.reduce((weeks: string[][], currentDate: string, index) => {
    if (index % 5 === 0) {
      weeks.push([]);
    }

    weeks[weeks.length - 1]?.push(currentDate);
    return weeks;
  }, []);
};
