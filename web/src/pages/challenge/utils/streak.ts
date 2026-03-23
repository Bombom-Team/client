const WEEKDAY_ORDER = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
] as const;

const WEEKDAY_LABEL_MAP = {
  MONDAY: 'Mon',
  TUESDAY: 'Tue',
  WEDNESDAY: 'Wed',
  THURSDAY: 'Thu',
  FRIDAY: 'Fri',
} as const;

const JS_WEEKDAY_TO_CHALLENGE_WEEKDAY = {
  1: 'MONDAY',
  2: 'TUESDAY',
  3: 'WEDNESDAY',
  4: 'THURSDAY',
  5: 'FRIDAY',
} as const;

type Weekday = (typeof WEEKDAY_ORDER)[number];

interface StreakDay {
  date: string;
  dayOfWeek: string;
}

interface GetDisplayDaysParams {
  streakDayList: StreakDay[];
}

export const getDisplayDays = ({ streakDayList }: GetDisplayDaysParams) => {
  const activeDays = streakDayList.slice(-WEEKDAY_ORDER.length);
  const currentWeekday =
    JS_WEEKDAY_TO_CHALLENGE_WEEKDAY[
      new Date().getDay() as keyof typeof JS_WEEKDAY_TO_CHALLENGE_WEEKDAY
    ];

  if (activeDays.length === 0) {
    return WEEKDAY_ORDER.map((weekday) => ({
      key: weekday,
      label: WEEKDAY_LABEL_MAP[weekday],
      isActive: false,
      isToday: weekday === currentWeekday,
    }));
  }

  const activeTodayWeekday = activeDays.at(-1)?.dayOfWeek as
    | Weekday
    | undefined;
  const todayIndex = activeTodayWeekday
    ? WEEKDAY_ORDER.indexOf(activeTodayWeekday)
    : 0;
  const startIndex =
    (todayIndex - activeDays.length + 1 + WEEKDAY_ORDER.length) %
    WEEKDAY_ORDER.length;

  return Array.from({ length: WEEKDAY_ORDER.length }, (_, index) => {
    const weekday =
      WEEKDAY_ORDER[(startIndex + index) % WEEKDAY_ORDER.length] ?? 'MONDAY';
    const activeDay = activeDays[index];

    return {
      key: activeDay?.date ?? `empty-${weekday}`,
      label: WEEKDAY_LABEL_MAP[weekday],
      isActive: !!activeDay,
      isToday: weekday === currentWeekday,
    };
  });
};
