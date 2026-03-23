import { ApiError } from '@bombom/shared/apis';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { challengesQueries } from '@/apis/challenges/challenges.query';

type UseDeleteChallengeDailyGuideMutationParams = {
  challengeId: number;
  dayIndex: number;
  onSuccess?: () => void;
};

export const useDeleteChallengeDailyGuideMutation = ({
  challengeId,
  dayIndex,
  onSuccess,
}: UseDeleteChallengeDailyGuideMutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...challengesQueries.mutation.deleteDailyGuide(),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: challengesQueries.schedule(challengeId).queryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: challengesQueries.dailyGuide(challengeId, dayIndex)
            .queryKey,
        }),
      ]);
      alert('데일리 가이드가 삭제되었습니다.');
      onSuccess?.();
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        alert(error.message);
        return;
      }

      alert('데일리 가이드 삭제에 실패했습니다.');
    },
  });
};
