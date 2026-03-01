import { ApiError } from '@bombom/shared/apis';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsQueries } from '@/apis/events/events.query';

type UseDeleteEventMutationParams = {
  onSuccess?: () => void;
};

export const useDeleteEventMutation = ({
  onSuccess,
}: UseDeleteEventMutationParams = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...eventsQueries.mutation.delete(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: eventsQueries.all });
      alert('이벤트가 삭제되었습니다.');
      onSuccess?.();
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        alert(error.message);
        return;
      }
      alert('이벤트 삭제에 실패했습니다.');
    },
  });
};
