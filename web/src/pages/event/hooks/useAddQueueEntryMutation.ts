import { ApiError } from '@bombom/shared/apis';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { EVENT_STATUS_TYPE } from '../constants/constants';
import { postQueueEntry } from '@/apis/event/event.api';
import { queries } from '@/apis/queries';
import { toast } from '@/components/Toast/utils/toastActions';
import type { EventStatus } from '../types/event';
import type { CouponName } from '@/apis/event/event.api';

interface UseAddQueueEntryMutationParams {
  couponName: CouponName;
  onAddQueueEntryError?: (eventStatus: EventStatus | null) => void;
}

export const useAddQueueEntryMutation = ({
  couponName,
  onAddQueueEntryError,
}: UseAddQueueEntryMutationParams) => {
  const queryClient = useQueryClient();

  const getEventStatusType = useCallback((error: unknown) => {
    if (!(error instanceof ApiError)) {
      return null;
    }

    const eventStatus = error.rawBody?.reason;
    if (
      eventStatus === EVENT_STATUS_TYPE.notStarted ||
      eventStatus === EVENT_STATUS_TYPE.ended
    ) {
      return eventStatus;
    }

    return null;
  }, []);

  return useMutation({
    mutationFn: () => postQueueEntry(couponName),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.queueEntry(couponName).queryKey,
      });
    },
    onError: (error) => {
      const eventStatusType = getEventStatusType(error);
      onAddQueueEntryError?.(eventStatusType);

      if (!eventStatusType) {
        toast.error('대기열 등록에 실패했습니다. 다시 시도해주세요.');
      }
    },
  });
};
