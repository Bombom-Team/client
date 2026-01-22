import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  deleteChallengeCommentLike,
  type ChallengeCommentLikeResponse,
} from '@/apis/challenge/challenge.api';
import { queries } from '@/apis/queries';
import { toast } from '@/components/Toast/utils/toastActions';

interface UseDeleteCommentLikeMutationParams {
  challengeId: number;
  commentId: number;
  onDeleteSuccess: (data: ChallengeCommentLikeResponse) => void;
}

export const useDeleteCommentLikeMutation = ({
  challengeId,
  commentId,
  onDeleteSuccess,
}: UseDeleteCommentLikeMutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteChallengeCommentLike(challengeId, commentId),
    onSuccess: (likeCount) => {
      queryClient.invalidateQueries({
        queryKey: queries.comments.all(challengeId),
      });
      onDeleteSuccess(likeCount);
    },
    onError: () => {
      toast.error('좋아요 취소에 실패했습니다. 다시 시도해주세요.');
    },
  });
};
