import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queries } from '@/apis/queries';
import { deleteNativeMaeilMailSubscription } from '@/apis/subscriptions/subscriptions.api';
import { toast } from '@/components/Toast/utils/toastActions';

export const useUnsubscribeMaeilMailSubscriptionMutations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNativeMaeilMailSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.nativeMaeilMailSubscription().queryKey,
      });
      toast.success('구독이 해지되었습니다.');
    },
    onError: () => toast.error('구독 해지에 실패했습니다. 다시 시도해주세요.'),
  });
};
