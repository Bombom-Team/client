import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postQueueEntry } from '@/apis/event/event.api';
import { queries } from '@/apis/queries';
import { toast } from '@/components/Toast/utils/toastActions';
import type { CouponName } from '@/apis/event/event.api';

interface UseAddQueueEntryMutationParams {
  couponName: CouponName;
}

export const useAddQueueEntryMutation = ({
  couponName,
}: UseAddQueueEntryMutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => postQueueEntry(couponName),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.queueEntry(couponName).queryKey,
      });
    },
    onError: () => {
      toast.error('대기열 등록에 실패했습니다. 다시 시도해주세요.');
    },
  });
};
