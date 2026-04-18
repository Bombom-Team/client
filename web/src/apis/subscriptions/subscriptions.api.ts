import { fetcher } from '@bombom/shared/apis';

export type PostNativeMaeilMailSubscriptionParams = {
  newsletterId: number;
  tracks: string[];
  weeklyIssueCount: number;
};

export const postNativeMaeilMailSubscription = async (
  params: PostNativeMaeilMailSubscriptionParams,
) => {
  return await fetcher.post<PostNativeMaeilMailSubscriptionParams, never>({
    path: '/subscriptions/native/maeil-mail',
    body: params,
  });
};
