export const COUPON_NAME = 'apple';

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

export const COUPON_TYPE = {
  apple: '1회차',
  'day2-coupon': '2회차',
  avengers: '테스트',
} as const;
