import { formatDate, getDatesInRange } from '@/utils/date';

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

export const convertRelativeTime = (dateString: string) => {
  const now = new Date();
  const targetDate = new Date(dateString);
  const diffMs = now.getTime() - targetDate.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return '방금 전';
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  return formatDate(targetDate);
};
