import { ApiError } from '@bombom/shared/apis';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { challengesQueries } from '@/apis/challenges/challenges.query';
import type { UpdateChallengePayload } from '@/apis/challenges/challenges.api';

type UseUpdateChallengeMutationParams = {
  challengeId: number;
  onSuccess?: () => void;
};

export const useUpdateChallengeMutation = ({
  challengeId,
  onSuccess,
}: UseUpdateChallengeMutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...challengesQueries.mutation.update(),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: challengesQueries.all }),
        queryClient.invalidateQueries({
          queryKey: challengesQueries.detail(challengeId).queryKey,
        }),
      ]);
      alert('챌린지가 수정되었습니다.');
      onSuccess?.();
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        alert(error.message);
        return;
      }

      alert('챌린지 수정에 실패했습니다.');
    },
  });
};

export type UpdateChallengeMutationParams = {
  challengeId: number;
  payload: UpdateChallengePayload;
};
