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
    return `🎯 ${minutesBefore}분 후. 시작!\n시작 시각: ${eventStartTime}`;
  }

  return '🎉 지금 시작!';
};
