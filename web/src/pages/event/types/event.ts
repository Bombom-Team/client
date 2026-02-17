export type EventErrorStatus = 'EVENT_NOT_STARTED' | 'EVENT_ENDED';
export type EventErrorResponse = {
  status: string;
  code: string;
  message: string;
  reason: EventErrorStatus | string;
};
