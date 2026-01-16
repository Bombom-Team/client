import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchChallengeComment } from '@/apis/challenge/challenge.api';
import { toast } from '@/components/Toast/utils/toastActions';
import type { PatchChallengeCommentParams } from '@/apis/challenge/challenge.api';

interface UseUpdateChallengeCommentMutationParams {
  challengeId: number;
}

export const useUpdateChallengeCommentMutation = ({
  challengeId,
}: UseUpdateChallengeCommentMutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: PatchChallengeCommentParams) =>
      patchChallengeComment(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['challenges', challengeId, 'comments'],
      });
      toast.success('코멘트가 수정되었습니다.');
    },
    onError: () => {
      toast.error('코멘트 수정에 실패했습니다. 다시 시도해주세요.');
    },
  });
};
