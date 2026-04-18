import { useMutation } from '@tanstack/react-query';
import { postNativeMaeilMailSubscription } from '@/apis/subscriptions/subscriptions.api';
import { toast } from '@/components/Toast/utils/toastActions';

const MAEIL_MAIL_WEEKLY_ISSUE_COUNT = 5;

interface UseSubscribeNewsletterMutationParams {
  newsletterId: number;
  onSubscribeSuccess: () => void;
}

export const useSubscribeNewsletterMutation = ({
  newsletterId,
  onSubscribeSuccess,
}: UseSubscribeNewsletterMutationParams) => {
  return useMutation({
    mutationFn: (tracks: string[]) =>
      postNativeMaeilMailSubscription({
        newsletterId,
        tracks,
        weeklyIssueCount: MAEIL_MAIL_WEEKLY_ISSUE_COUNT,
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
