import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queries } from '@/apis/queries';
import { postNativeMaeilMailSubscription } from '@/apis/subscriptions/subscriptions.api';
import { toast } from '@bombom/shared/ui-web';
import type { SubscribeTrack } from '../types/subscribe';

interface UseSubscribeNewsletterMutationParams {
  onSubscribeSuccess: () => void;
}

interface SubscribeNewsletterParams {
  tracks: SubscribeTrack[];
}

export const useSubscribeNewsletterMutation = ({
  onSubscribeSuccess,
}: UseSubscribeNewsletterMutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tracks }: SubscribeNewsletterParams) =>
      postNativeMaeilMailSubscription({
        tracks,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.nativeMaeilMailSubscription().queryKey,
      });
      toast.success('사전 구독을 완료했어요!');
      onSubscribeSuccess();
    },
    onError: () => {
      toast.error('구독에 실패했습니다. 다시 시도해주세요.');
    },
  });
};
