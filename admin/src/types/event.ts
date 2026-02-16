export type EventStatus =
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Event {
  id: number;
  name: string;
  startTime: string;
  status: EventStatus;
}

export type EventNotificationScheduleType = 'BEFORE_MINUTES' | 'AT_START';

export interface EventNotificationSchedule {
  id: number;
  eventId: number;
  scheduledAt: string;
  type: EventNotificationScheduleType;
  minutesBefore: number | null;
  sent: boolean;
  sentAt: string | null;
}

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  SCHEDULED: '예정',
  IN_PROGRESS: '진행 중',
  COMPLETED: '완료',
  CANCELLED: '취소',
};

export const EVENT_NOTIFICATION_SCHEDULE_TYPE_LABELS: Record<
  EventNotificationScheduleType,
  string
> = {
  BEFORE_MINUTES: '이벤트 시작 전',
  AT_START: '이벤트 시작 시점',
};
