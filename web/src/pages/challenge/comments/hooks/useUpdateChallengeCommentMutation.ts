import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchChallengeComment } from '@/apis/challenge/challenge.api';
import { queries } from '@/apis/queries';
import { toast } from '@/components/Toast/utils/toastActions';

interface UseUpdateChallengeCommentMutationParams {
  challengeId: number;
}

export const useUpdateChallengeCommentMutation = ({
  challengeId,
}: UseUpdateChallengeCommentMutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchChallengeComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.comments.all(challengeId),
      });
      toast.success('코멘트가 수정되었습니다.');
    },
    onError: () => {
      toast.error('코멘트 수정에 실패했습니다. 다시 시도해주세요.');
    },
  });
};
