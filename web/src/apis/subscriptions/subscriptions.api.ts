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

export type NativeMaeilMailSubscriptionTrack =
  PostNativeMaeilMailSubscriptionParams['tracks'][number];
export type GetNativeMaeilMailSubscriptionResponse = {
  subscribed: boolean;
  tracks: NativeMaeilMailSubscriptionTrack[];
};

export const getNativeMaeilMailSubscription = async () => {
  return await fetcher.get<GetNativeMaeilMailSubscriptionResponse>({
    path: '/subscriptions/native/maeil-mail',
  });
};
