import { ApiError } from '@bombom/shared/apis';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUEUE_STATUS_TYPE } from '../constants/constants';
import { postIssueCoupon } from '@/apis/event/event.api';
import { eventQueries } from '@/apis/event/event.query';
import { toast } from '@/components/Toast/utils/toastActions';
import type { CouponName } from '@/apis/event/event.api';

interface UseIssueCouponMutationParams {
  couponName: CouponName;
}

export const useIssueCouponMutation = ({
  couponName,
}: UseIssueCouponMutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => postIssueCoupon(couponName),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: eventQueries.myCoupons().queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: eventQueries.queueEntry(couponName).queryKey,
      });
      toast.success('쿠폰이 발급되었습니다!');
    },
    onError: (error) => {
      if (
        error instanceof ApiError &&
        error.rawBody?.reason === QUEUE_STATUS_TYPE.soldOut
      ) {
        queryClient.invalidateQueries({
          queryKey: eventQueries.queueEntry(couponName).queryKey,
        });
        return;
      }
      toast.error('쿠폰 발급에 실패했습니다. 다시 시도해주세요.');
    },
  });
};
