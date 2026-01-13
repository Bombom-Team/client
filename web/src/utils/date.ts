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
