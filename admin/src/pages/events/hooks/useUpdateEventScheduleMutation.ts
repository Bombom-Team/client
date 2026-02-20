import { ApiError } from '@bombom/shared/apis';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsQueries } from '@/apis/events/events.query';
import type { UpdateEventSchedulePayload } from '@/apis/events/events.api';

type UseUpdateEventScheduleMutationParams = {
  eventId: number;
  onSuccess?: () => void;
  onSettled?: () => void;
};

export const useUpdateEventScheduleMutation = ({
  eventId,
  onSuccess,
  onSettled,
}: UseUpdateEventScheduleMutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...eventsQueries.mutation.updateSchedule(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: eventsQueries.schedules(eventId).queryKey,
      });
      alert('알림 스케줄이 수정되었습니다.');
      onSuccess?.();
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        alert(error.message);
        return;
      }
      alert('알림 스케줄 수정에 실패했습니다.');
    },
    onSettled: () => {
      onSettled?.();
    },
  });
};

export type UpdateEventScheduleMutationParams = {
  eventId: number;
  scheduleId: number;
  payload: UpdateEventSchedulePayload;
};
