import { ApiError } from '@bombom/shared/apis';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsQueries } from '@/apis/events/events.query';

type UseDeleteEventScheduleMutationParams = {
  eventId: number;
  onSuccess?: () => void;
  onSettled?: () => void;
};

export const useDeleteEventScheduleMutation = ({
  eventId,
  onSuccess,
  onSettled,
}: UseDeleteEventScheduleMutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...eventsQueries.mutation.deleteSchedule(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: eventsQueries.schedules(eventId).queryKey,
      });
      alert('알림 스케줄이 삭제되었습니다.');
      onSuccess?.();
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        alert(error.message);
        return;
      }
      alert('알림 스케줄 삭제에 실패했습니다.');
    },
    onSettled: () => {
      onSettled?.();
    },
  });
};
