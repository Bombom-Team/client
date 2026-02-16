export type EventStatus = 'EVENT_NOT_STARTED' | 'EVENT_ENDED';
export type EventErrorResponse = {
  status: string;
  code: string;
  message: string;
  reason: EventStatus | string;
};
