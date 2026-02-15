import { useQuery } from '@tanstack/react-query';
import { useAddQueueEntryMutation } from './useAddQueueEntryMutation';
import { useCancelQueueEntryMutation } from './useCancelQueueEntryMutation';
import { queries } from '@/apis/queries';
import type { CouponName } from '@/apis/event/event.api';

type UseQueueEntryParams = {
  couponName: CouponName;
  onActiveTimeout?: () => void;
};

export const useQueueEntry = ({ couponName }: UseQueueEntryParams) => {
  const { mutate: addQueueEntry, isSuccess } = useAddQueueEntryMutation({
    couponName,
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

  return {
    queueEntry,
    addQueueEntry,
    cancelQueueEntry,
  };
};
