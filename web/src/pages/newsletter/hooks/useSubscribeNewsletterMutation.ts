import { useMutation } from '@tanstack/react-query';
import { postNativeMaeilMailSubscription } from '@/apis/subscriptions/subscriptions.api';
import { toast } from '@/components/Toast/utils/toastActions';
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
  return useMutation({
    mutationFn: ({ tracks }: SubscribeNewsletterParams) =>
      postNativeMaeilMailSubscription({
        tracks,
      }),
    onSuccess: () => {
      toast.success('사전 구독을 완료했어요!');
      onSubscribeSuccess();
    },
    onError: () => {
      toast.error('구독에 실패했습니다. 다시 시도해주세요.');
    },
  });
};
