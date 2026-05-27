import { useMutation, useQueryClient } from '@tanstack/react-query';
import { putChallengeReview } from '@/apis/challenge/challenge.api';
import { queries } from '@/apis/queries';
import { toast } from '@/components/Toast/utils/toastActions';
import type { PutChallengeReviewParams } from '@/apis/challenge/challenge.api';

interface UseUpdateReviewMutationParams {
  challengeId: number;
  reviewId: number;
  onSuccess?: () => void;
}

const useUpdateReviewMutation = ({
  challengeId,
  reviewId,
  onSuccess,
}: UseUpdateReviewMutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: PutChallengeReviewParams) =>
      putChallengeReview(challengeId, reviewId, params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.reviews.all(challengeId),
      });
      onSuccess?.();
    },
    onError: () => {
      toast.error('리뷰 수정에 실패했습니다. 다시 시도해주세요.');
    },
  });
};

export default useUpdateReviewMutation;
