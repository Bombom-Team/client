import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postChallengeReview } from '@/apis/challenge/challenge.api';
import { queries } from '@/apis/queries';
import { toast } from '@/components/Toast/utils/toastActions';
import type { PostChallengeReviewParams } from '@/apis/challenge/challenge.api';

interface UseAddReviewMutationParams {
  challengeId: number;
  onSuccess?: () => void;
}

const useAddReviewMutation = ({
  challengeId,
  onSuccess,
}: UseAddReviewMutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: PostChallengeReviewParams) =>
      postChallengeReview(challengeId, params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.reviews.all(challengeId),
      });
      onSuccess?.();
    },
    onError: () => {
      toast.error('리뷰 등록에 실패했습니다. 다시 시도해주세요.');
    },
  });
};

export default useAddReviewMutation;
