import { useQuery } from '@tanstack/react-query';
import { useAddQueueEntryMutation } from './useAddQueueEntryMutation';
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
    ...queries.queueEntry(couponName),
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
