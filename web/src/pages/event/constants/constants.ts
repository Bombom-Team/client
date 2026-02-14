export const COUPON_NAME = 'day1-coupon';

export const QUEUE_STATUS_TYPE = {
  waiting: 'WAITING',
  ready: 'ACTIVE',
  issued: 'ISSUED',
  unregistered: 'NOT_IN_QUEUE',
};

export const COUPON_TYPE = {
  'day1-coupon': '1회차 쿠폰',
  'day2-coupon': '2회차 쿠폰',
} as const;
