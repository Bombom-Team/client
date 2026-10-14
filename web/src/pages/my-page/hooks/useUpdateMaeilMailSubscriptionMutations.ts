import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queries } from '@/apis/queries';
import { putNativeMaeilMailSubscription } from '@/apis/subscriptions/subscriptions.api';
import { toast } from '@/components/Toast/utils/toastActions';
import type { PutNativeMaeilMailSubscriptionParams } from '@/apis/subscriptions/subscriptions.api';

export const useUpdateMaeilMailSubscriptionMutations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: PutNativeMaeilMailSubscriptionParams) =>
      putNativeMaeilMailSubscription(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.nativeMaeilMailSubscription().queryKey,
      });
      toast.success('구독 정보가 수정되었습니다.');
    },
    onError: () => toast.error('수정에 실패했습니다. 다시 시도해주세요.'),
  });
};
