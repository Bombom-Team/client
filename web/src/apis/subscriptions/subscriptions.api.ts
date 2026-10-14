import { fetcher } from '@bombom/shared/apis';
import type { components } from '@/types/openapi';

export type PostNativeMaeilMailSubscriptionParams =
  components['schemas']['MaeilMailUpdateSubscriptionRequest'];

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
export type GetNativeMaeilMailSubscriptionResponse =
  components['schemas']['MaeilMailSubscriptionResponse'];

export const getNativeMaeilMailSubscription = async () => {
  return await fetcher.get<GetNativeMaeilMailSubscriptionResponse>({
    path: '/subscriptions/native/maeil-mail',
  });
};

export type PutNativeMaeilMailSubscriptionParams =
  components['schemas']['MaeilMailUpdateSubscriptionRequest'];

export const putNativeMaeilMailSubscription = async (
  params: PutNativeMaeilMailSubscriptionParams,
) => {
  return await fetcher.put<PutNativeMaeilMailSubscriptionParams, never>({
    path: '/subscriptions/native/maeil-mail',
    body: params,
  });
};

export const deleteNativeMaeilMailSubscription = async () => {
  return await fetcher.delete<never, never>({
    path: '/subscriptions/native/maeil-mail',
  });
};
