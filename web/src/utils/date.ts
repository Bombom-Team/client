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

export const getDday = (targetDate: Date): string => {
  const today = new Date();
  const target = new Date(targetDate);

  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const ONE_DAY = 1000 * 60 * 60 * 24;
  const diff = Math.ceil((target.getTime() - today.getTime()) / ONE_DAY);

  if (diff === 0) return 'Day';
  if (diff > 0) return `-${diff}`;
  return `+${Math.abs(diff)}`;
};
