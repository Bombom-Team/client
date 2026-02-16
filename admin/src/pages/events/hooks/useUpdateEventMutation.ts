import { ApiError } from '@bombom/shared/apis';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsQueries } from '@/apis/events/events.query';
import type { UpdateEventPayload } from '@/apis/events/events.api';

type UseUpdateEventMutationParams = {
  eventId: number;
  onSuccess?: () => void;
};

export const useUpdateEventMutation = ({
  eventId,
  onSuccess,
}: UseUpdateEventMutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...eventsQueries.mutation.update(),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: eventsQueries.all }),
        queryClient.invalidateQueries({
          queryKey: eventsQueries.detail(eventId).queryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: eventsQueries.schedules(eventId).queryKey,
        }),
      ]);
      alert('이벤트가 수정되었습니다.');
      onSuccess?.();
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        alert(error.message);
        return;
      }
      alert('이벤트 수정에 실패했습니다.');
    },
  });
};

export type UpdateEventMutationParams = {
  eventId: number;
  payload: UpdateEventPayload;
};
