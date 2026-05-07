import { queryOptions } from '@tanstack/react-query';
import { getNativeMaeilMailSubscription } from './subscriptions.api';

export const subscriptionsQueries = {
  nativeMaeilMailSubscription: () =>
    queryOptions({
      queryKey: ['subscriptions', 'native', 'maeil-mail'],
      queryFn: getNativeMaeilMailSubscription,
    }),
};
