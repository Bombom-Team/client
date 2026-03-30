import { ApiError } from '@bombom/shared/apis';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { challengesQueries } from '@/apis/challenges/challenges.query';

type UseCreateChallengeMutationParams = {
  onSuccess?: () => void;
};

export const useCreateChallengeMutation = ({
  onSuccess,
}: UseCreateChallengeMutationParams = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...challengesQueries.mutation.create(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: challengesQueries.all });
      alert('챌린지가 생성되었습니다.');
      onSuccess?.();
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        alert(error.message);
        return;
      }

      alert('챌린지 생성에 실패했습니다.');
    },
  });
};
