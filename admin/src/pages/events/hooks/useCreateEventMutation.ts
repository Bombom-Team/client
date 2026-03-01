import { ApiError } from '@bombom/shared/apis';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsQueries } from '@/apis/events/events.query';

type UseCreateEventMutationParams = {
  onSuccess?: () => void;
};

export const useCreateEventMutation = ({
  onSuccess,
}: UseCreateEventMutationParams = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...eventsQueries.mutation.create(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: eventsQueries.all });
      alert('이벤트가 생성되었습니다.');
      onSuccess?.();
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        alert(error.message);
        return;
      }
      alert('이벤트 생성에 실패했습니다.');
    },
  });
};
