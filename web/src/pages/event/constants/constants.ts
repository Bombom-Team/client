export const COUPON_NAME = 'bank';

export const QUEUE_STATUS_TYPE = {
  waiting: 'WAITING',
  ready: 'ACTIVE',
  issued: 'ISSUED',
  unregistered: 'NOT_IN_QUEUE',
  soldOut: 'SOLD_OUT',
};

export const EVENT_STATUS_TYPE = {
  notStarted: 'EVENT_NOT_STARTED',
  ended: 'EVENT_ENDED',
  unknownError: 'UNKNOWN_ERROR',
} as const;
