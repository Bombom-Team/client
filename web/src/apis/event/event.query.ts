import { queryOptions } from '@tanstack/react-query';
import { getMyQueueEntry, getMyCoupons } from './event.api';
import type { CouponName } from './event.api';

export const eventQueries = {
  queueEntry: (couponName: CouponName) =>
    queryOptions({
      queryKey: ['coupons', couponName, 'queue-entries', 'me'],
      queryFn: () => getMyQueueEntry(couponName),
    }),
  myCoupons: () =>
    queryOptions({
      queryKey: ['coupons', 'issues', 'me'],
      queryFn: getMyCoupons,
    }),
};
