import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postChallengeComment } from '@/apis/challenge/challenge.api';
import { queries } from '@/apis/queries';
import { toast } from '@/components/Toast/utils/toastActions';
import type {
  PostChallengeCommentParams,
  PostChallengeCommentResponse,
} from '@/apis/challenge/challenge.api';

interface UseAddChallengeCommentMutationParams {
  challengeId: number;
  onSuccess?: (response: PostChallengeCommentResponse) => void;
}

const useAddChallengeCommentMutation = ({
  challengeId,
  onSuccess,
}: UseAddChallengeCommentMutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: PostChallengeCommentParams) =>
      postChallengeComment(challengeId, params),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: queries.comments.all(challengeId),
      });
      onSuccess?.(response);
    },
    onError: () => {
      toast.error('코멘트 등록에 실패했습니다. 다시 시도해주세요.');
    },
  });
};

export default useAddChallengeCommentMutation;
