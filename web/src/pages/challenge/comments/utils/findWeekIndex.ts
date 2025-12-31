export const findWeekIndex = (weeks: string[][], date: string) => {
  const index = weeks.findIndex((week) => week.includes(date));
  return index === -1 ? Math.max(weeks.length - 1, 0) : index;
};
