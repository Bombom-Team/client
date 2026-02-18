import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMyQueueEntry } from '@/apis/event/event.api';
import { queries } from '@/apis/queries';
import { toast } from '@/components/Toast/utils/toastActions';
import type { CouponName } from '@/apis/event/event.api';

interface UseCancelQueueEntryMutationParams {
  couponName: CouponName;
  onCancelSuccess?: () => void;
}

export const useCancelQueueEntryMutation = ({
  couponName,
  onCancelSuccess,
}: UseCancelQueueEntryMutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteMyQueueEntry(couponName),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.queueEntry(couponName).queryKey,
      });
      onCancelSuccess?.();
    },
    onError: () => {
      toast.error('대기열 취소에 실패했습니다. 다시 시도해주세요.');
    },
  });
};
