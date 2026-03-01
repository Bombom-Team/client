import { formatEventStartTime } from './formatEventStartTime';
import type { EventNotificationSchedule } from '@/types/event';

type BuildNotificationMessageParams = {
  schedule: EventNotificationSchedule;
  eventStartTime: string;
};

export const buildNotificationMessage = ({
  schedule,
  eventStartTime,
}: BuildNotificationMessageParams) => {
  if (schedule.type === 'BEFORE_MINUTES') {
    const minutesBefore = schedule.minutesBefore ?? 0;
    const scheduledAtDate = new Date(schedule.scheduledAt);
    const startTimeText = Number.isNaN(scheduledAtDate.getTime())
      ? eventStartTime
      : formatEventStartTime(
          new Date(scheduledAtDate.getTime() + minutesBefore * 60 * 1000),
        );

    return `🎯 ${minutesBefore}분 후 시작!\n시작 시각: ${startTimeText}`;
  }

  return '🎉 지금 시작!';
};
