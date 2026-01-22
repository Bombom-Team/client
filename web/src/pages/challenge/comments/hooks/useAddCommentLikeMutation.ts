import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  putChallengeCommentLike,
  type ChallengeCommentLikeResponse,
} from '@/apis/challenge/challenge.api';
import { queries } from '@/apis/queries';
import { toast } from '@/components/Toast/utils/toastActions';

interface UseAddCommentLikeMutationParams {
  challengeId: number;
  commentId: number;
  onAddSuccess: (data: ChallengeCommentLikeResponse) => void;
}

export const useAddCommentLikeMutation = ({
  challengeId,
  commentId,
  onAddSuccess,
}: UseAddCommentLikeMutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => putChallengeCommentLike(challengeId, commentId),
    onSuccess: (likeCount) => {
      queryClient.invalidateQueries({
        queryKey: queries.comments.all(challengeId),
      });
      onAddSuccess(likeCount);
    },
    onError: () => {
      toast.error('좋아요 추가에 실패했습니다. 다시 시도해주세요.');
    },
  });
};
