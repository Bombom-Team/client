export const getDday = (targetDate: string): string => {
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
