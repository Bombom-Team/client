import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useAddQueueEntryMutation } from './useAddQueueEntryMutation';
import { useCancelQueueEntryMutation } from './useCancelQueueEntryMutation';
import { QUEUE_STATUS_TYPE } from '../constants/constants';
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
  const [isPollingEnabled, setIsPollingEnabled] = useState(false);

  const { mutate: addQueueEntry } = useAddQueueEntryMutation({
    couponName,
    onAddQueueEntrySuccess: () => setIsPollingEnabled(true),
    onAddQueueEntryError: (errorStatus) => {
      setEventErrorStatus(errorStatus);
    },
  });
  const { mutate: cancelQueueEntry } = useCancelQueueEntryMutation({
    couponName,
    onCancelSuccess: () => setIsPollingEnabled(false),
  });

  const { data: queueEntry } = useQuery({
    ...queries.queueEntry(couponName),
    enabled: (query) => {
      if (!isPollingEnabled) return false;
      const status = query.state.data?.status;
      return !status || status === QUEUE_STATUS_TYPE.waiting;
    },
    refetchInterval: (query) => {
      const { data } = query.state;
      const interval = data?.pollingTtlSeconds
        ? data.pollingTtlSeconds * 1000
        : false;
      return interval;
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
