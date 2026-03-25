import { formatDate } from '@/utils/date';

const MAX_DISPLAY_DAYS = 5;

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const;

interface StreakDay {
  date: string;
  dayOfWeek: string;
  isCompleted: boolean;
  isShieldApplied: boolean;
}

interface GetDisplayDaysParams {
  streakDayList: StreakDay[];
}

interface DisplayDay {
  key: string;
  label: string;
  isCompleted: boolean;
  isShieldApplied: boolean;
  isToday: boolean;
}

const isWeekday = (date: Date) => {
  const day = date.getDay();
  return day !== 0 && day !== 6;
};

const getAdjacentWeekday = (date: Date, direction: -1 | 1) => {
  const nextDate = new Date(date);

  do {
    nextDate.setDate(nextDate.getDate() + direction);
  } while (!isWeekday(nextDate));

  return nextDate;
};

const getDateKey = (date: Date) => formatDate(date, '-');

const getLabel = (date: Date) => WEEKDAY_LABELS[date.getDay() - 1]!;

const getFilledDisplayDays = ({
  streakDayList,
  today,
}: GetDisplayDaysParams & {
  today: string;
}): DisplayDay[] => {
  if (streakDayList.length === MAX_DISPLAY_DAYS) {
    return streakDayList.map((day) => ({
      key: day.date,
      label: getLabel(new Date(`${day.date}T00:00:00`)),
      isCompleted: day.isCompleted,
      isShieldApplied: day.isShieldApplied,
      isToday: day.date === today,
    }));
  }

  const firstDate = streakDayList[0]!.date;

  const streakDayMap = new Map(streakDayList.map((day) => [day.date, day]));
  const dates = [new Date(`${firstDate}T00:00:00`)];
  let nextDate = dates[0] as Date;

  while (dates.length < MAX_DISPLAY_DAYS) {
    nextDate = getAdjacentWeekday(nextDate, 1);
    dates.push(nextDate);
  }

  return dates.map((date) => {
    const dateKey = getDateKey(date);
    const streakDay = streakDayMap.get(dateKey);

    return {
      key: dateKey,
      label: getLabel(date),
      isCompleted: streakDay?.isCompleted ?? false,
      isShieldApplied: streakDay?.isShieldApplied ?? false,
      isToday: dateKey === today,
    };
  });
};

export const getDisplayDays = ({
  streakDayList,
}: GetDisplayDaysParams): DisplayDay[] => {
  const today = getDateKey(new Date());

  return getFilledDisplayDays({
    streakDayList,
    today,
  });
};
