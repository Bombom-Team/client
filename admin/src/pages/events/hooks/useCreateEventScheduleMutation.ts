import { ApiError } from '@bombom/shared/apis';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsQueries } from '@/apis/events/events.query';
import type { CreateEventSchedulePayload } from '@/apis/events/events.api';

type UseCreateEventScheduleMutationParams = {
  eventId: number;
  onSuccess?: () => void;
};

export const useCreateEventScheduleMutation = ({
  eventId,
  onSuccess,
}: UseCreateEventScheduleMutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...eventsQueries.mutation.createSchedule(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: eventsQueries.schedules(eventId).queryKey,
      });
      alert('알림 스케줄이 생성되었습니다.');
      onSuccess?.();
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        alert(error.message);
        return;
      }
      alert('알림 스케줄 생성에 실패했습니다.');
    },
  });
};

export type CreateEventScheduleMutationParams = {
  eventId: number;
  payload: CreateEventSchedulePayload;
};
