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

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  SCHEDULED: '예정',
  IN_PROGRESS: '진행 중',
  COMPLETED: '완료',
  CANCELLED: '취소',
};
