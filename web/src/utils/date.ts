export const formatDate = (date: Date, separator: string = '.'): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return year + separator + month + separator + day;
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return formatDate(date) === formatDate(today);
};

export const getDatesInRange = (
  startDate: string,
  endDate: string,
): string[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const result = [];
  while (start <= end) {
    result.push(formatDate(start, '-'));
    start.setDate(start.getDate() + 1);
  }

  return result;
};

export const filterWeekdays = (dates: string[]) => {
  return dates.filter((date) => {
    const day = new Date(date).getDay();
    return day !== 0 && day !== 6;
  });
};

export const compareDates = (date1: Date, date2: Date): -1 | 0 | 1 => {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());

  if (d1.getTime() < d2.getTime()) return -1;
  if (d1.getTime() > d2.getTime()) return 1;
  return 0;
};

export const getDatesDiff = (date1: Date, date2: Date) => {
  const timesDiff = Math.abs(date1.getTime() - date2.getTime());
  const daysDiff = Math.floor(timesDiff / (1000 * 60 * 60 * 24));
  return daysDiff;
};
