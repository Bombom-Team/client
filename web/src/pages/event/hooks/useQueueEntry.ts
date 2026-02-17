import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useAddQueueEntryMutation } from './useAddQueueEntryMutation';
import { useCancelQueueEntryMutation } from './useCancelQueueEntryMutation';
import { queries } from '@/apis/queries';
import type { EventErrorStatus } from '../types/event';
import type { CouponName } from '@/apis/event/event.api';

type UseQueueEntryParams = {
  couponName: CouponName;
  onActiveTimeout?: () => void;
};

export const useQueueEntry = ({ couponName }: UseQueueEntryParams) => {
  const [eventErrorStatus, setEventErrorStatus] =
    useState<EventErrorStatus | null>(null);

  const { mutate: addQueueEntry, isSuccess } = useAddQueueEntryMutation({
    couponName,
    onAddQueueEntryError: (errorStatus) => {
      setEventErrorStatus(errorStatus);
    },
  });
  const { mutate: cancelQueueEntry } = useCancelQueueEntryMutation({
    couponName,
  });

  const { data: queueEntry } = useQuery({
    ...queries.queueEntry(couponName),
    enabled: isSuccess,
    refetchInterval: (query) => {
      const { data } = query.state;
      return data?.pollingTtlSeconds ? data.pollingTtlSeconds * 1000 : false;
    },
    refetchIntervalInBackground: true,
  });

  const resetEventStatus = useCallback(() => {
    setEventErrorStatus(null);
  }, []);

  return {
    queueEntry,
    addQueueEntry,
    cancelQueueEntry,
    eventErrorStatus,
    resetEventStatus,
  };
};
