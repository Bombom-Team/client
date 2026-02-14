import { queryOptions } from '@tanstack/react-query';
import { getMyQueueEntry, getMyCoupons } from './event.api';

export const eventQueries = {
  queueEntry: (couponName: string) =>
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
