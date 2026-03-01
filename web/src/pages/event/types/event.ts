export type EventErrorStatus =
  | 'EVENT_NOT_STARTED'
  | 'EVENT_ENDED'
  | 'UNKNOWN_ERROR';
export type EventErrorResponse = {
  status: string;
  code: string;
  message: string;
  reason: EventErrorStatus | string;
};
