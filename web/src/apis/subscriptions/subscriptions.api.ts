import { fetcher } from '@bombom/shared/apis';
import type { components } from '@/types/openapi';

export type PostNativeMaeilMailSubscriptionParams =
  components['schemas']['MaeilMailSubscribeRequest'];

export const postNativeMaeilMailSubscription = async (
  params: PostNativeMaeilMailSubscriptionParams,
) => {
  return await fetcher.post<PostNativeMaeilMailSubscriptionParams, never>({
    path: '/subscriptions/native/maeil-mail',
    body: params,
  });
};
