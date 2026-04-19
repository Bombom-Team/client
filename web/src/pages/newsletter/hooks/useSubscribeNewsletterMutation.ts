import { useMutation } from '@tanstack/react-query';
import { postNativeMaeilMailSubscription } from '@/apis/subscriptions/subscriptions.api';
import { toast } from '@/components/Toast/utils/toastActions';

interface UseSubscribeNewsletterMutationParams {
  newsletterId: number;
  onSubscribeSuccess: () => void;
}

interface SubscribeNewsletterParams {
  tracks: string[];
}

export const useSubscribeNewsletterMutation = ({
  newsletterId,
  onSubscribeSuccess,
}: UseSubscribeNewsletterMutationParams) => {
  return useMutation({
    mutationFn: ({ tracks }: SubscribeNewsletterParams) =>
      postNativeMaeilMailSubscription({
        newsletterId,
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
