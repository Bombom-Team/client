import { ApiError } from '@bombom/shared/apis';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { challengesQueries } from '@/apis/challenges/challenges.query';

type UseDeleteChallengeMutationParams = {
  onSuccess?: () => void;
};

export const useDeleteChallengeMutation = ({
  onSuccess,
}: UseDeleteChallengeMutationParams = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...challengesQueries.mutation.delete(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: challengesQueries.all });
      alert('챌린지가 삭제되었습니다.');
      onSuccess?.();
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        alert(error.message);
        return;
      }

      alert('챌린지 삭제에 실패했습니다.');
    },
  });
};
