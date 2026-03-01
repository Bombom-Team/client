import { ApiError } from '@bombom/shared/apis';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { EVENT_STATUS_TYPE } from '../constants/constants';
import { postQueueEntry } from '@/apis/event/event.api';
import { queries } from '@/apis/queries';
import type { EventErrorStatus } from '../types/event';
import type { CouponName } from '@/apis/event/event.api';

interface UseAddQueueEntryMutationParams {
  couponName: CouponName;
  onAddQueueEntrySuccess: () => void;
  onAddQueueEntryError: (eventStatus: EventErrorStatus | null) => void;
}

export const useAddQueueEntryMutation = ({
  couponName,
  onAddQueueEntrySuccess,
  onAddQueueEntryError,
}: UseAddQueueEntryMutationParams) => {
  const queryClient = useQueryClient();

  const getEventErrorStatus = useCallback((error: unknown) => {
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

    return EVENT_STATUS_TYPE.unknownError;
  }, []);

  return useMutation({
    mutationFn: () => postQueueEntry(couponName),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.queueEntry(couponName).queryKey,
      });
      onAddQueueEntrySuccess?.();
    },
    onError: (error) => {
      const eventErrorStatus = getEventErrorStatus(error);
      onAddQueueEntryError?.(eventErrorStatus);
    },
  });
};
