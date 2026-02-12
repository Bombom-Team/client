import { useQuery } from '@tanstack/react-query';
import { useAddQueueEntryMutation } from './useAddQueueEntryMutation';
import { COUPON_NAME } from '@/apis/event/constants';
import { queries } from '@/apis/queries';

type UseQueueEntryParams = {
  couponName: string;
  onActiveTimeout?: () => void;
};

export const useQueueEntry = ({ couponName }: UseQueueEntryParams) => {
  const { mutate: addQueueEntry, isSuccess } = useAddQueueEntryMutation({
    couponName,
  });

  const { data: queueEntry } = useQuery({
    ...queries.queueEntry(COUPON_NAME),
    enabled: isSuccess,
    refetchInterval: (query) => {
      const { data } = query.state;
      return data?.pollingTtlSeconds ? data.pollingTtlSeconds * 1000 : false;
    },
  });

  return {
    queueEntry,
    addQueueEntry,
  };
};
