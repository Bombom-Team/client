import { useMutation } from '@tanstack/react-query';
import { postNativeMaeilMailSubscription } from '@/apis/subscriptions/subscriptions.api';
import { toast } from '@/components/Toast/utils/toastActions';
import type { NewsletterLandingConfig } from '../../../constants/newsletter';

interface Props {
  config: NewsletterLandingConfig;
  newsletterId: number;
  onSuccess: () => void;
}

export const useSubscribeNativeMaeilMailMutation = ({
  config,
  newsletterId,
  onSuccess,
}: Props) => {
  return useMutation({
    mutationFn: () =>
      postNativeMaeilMailSubscription({
        newsletterId,
        tracks: config.tracks,
        weeklyIssueCount: config.weeklyIssueCount,
      }),
    onSuccess: () => {
      toast.success('사전 구독이 완료되었습니다!');
      onSuccess();
    },
    onError: () => {
      toast.error('구독에 실패했습니다. 다시 시도해주세요.');
    },
  });
};
