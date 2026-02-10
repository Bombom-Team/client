import { queryOptions } from '@tanstack/react-query';
import { getMyQueueEntry } from './event.api';

export const eventQueries = {
  queueEntry: (couponName: string) =>
    queryOptions({
      queryKey: ['coupons', couponName, 'queue-entries', 'me'],
      queryFn: () => getMyQueueEntry(couponName),
    }),
};
