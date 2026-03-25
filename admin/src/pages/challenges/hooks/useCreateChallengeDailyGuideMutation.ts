import { ApiError } from '@bombom/shared/apis';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { challengesQueries } from '@/apis/challenges/challenges.query';
import type { CreateChallengeDailyGuideRequest } from '@/apis/challenges/challenges.api';

type UseCreateChallengeDailyGuideMutationParams = {
  challengeId: number;
  dayIndex: number;
  onSuccess?: () => void;
};

export const useCreateChallengeDailyGuideMutation = ({
  challengeId,
  dayIndex,
  onSuccess,
}: UseCreateChallengeDailyGuideMutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...challengesQueries.mutation.createDailyGuide(),
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
      alert('데일리 가이드가 생성되었습니다.');
      onSuccess?.();
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        alert(error.message);
        return;
      }
      alert('데일리 가이드 생성에 실패했습니다.');
    },
  });
};

export type CreateChallengeDailyGuideMutationParams = {
  challengeId: number;
  image?: File;
  request: CreateChallengeDailyGuideRequest;
};
