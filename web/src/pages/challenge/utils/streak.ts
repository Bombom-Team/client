const WEEKDAY_LABEL_MAP = {
  MONDAY: 'Mon',
  TUESDAY: 'Tue',
  WEDNESDAY: 'Wed',
  THURSDAY: 'Thu',
  FRIDAY: 'Fri',
} as const;

type Weekday = keyof typeof WEEKDAY_LABEL_MAP;

interface StreakDay {
  date: string;
  dayOfWeek: string;
  isCompleted: boolean;
  isShieldApplied: boolean;
}

interface GetDisplayDaysParams {
  streakDayList: StreakDay[];
}

export const getDisplayDays = ({ streakDayList }: GetDisplayDaysParams) => {
  return streakDayList.map((day, index, days) => ({
    key: day.date,
    label: WEEKDAY_LABEL_MAP[day.dayOfWeek as Weekday],
    isCompleted: day.isCompleted,
    isShieldApplied: day.isShieldApplied,
    isToday: index === days.length - 1,
  }));
};
