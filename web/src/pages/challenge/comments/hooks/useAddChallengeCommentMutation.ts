import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postChallengeComment } from '@/apis/challenge/challenge.api';
import { toast } from '@/components/Toast/utils/toastActions';
import type { PostChallengeCommentParams } from '@/apis/challenge/challenge.api';

interface UseAddChallengeCommentMutationParams {
  challengeId: number;
}

const useAddChallengeCommentMutation = ({
  challengeId,
}: UseAddChallengeCommentMutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: PostChallengeCommentParams) =>
      postChallengeComment(challengeId, params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['challenges', challengeId, 'comments'],
      });
    },
    onError: () => {
      toast.error('코멘트 등록에 실패했습니다. 다시 시도해주세요.');
    },
  });
};

export default useAddChallengeCommentMutation;
