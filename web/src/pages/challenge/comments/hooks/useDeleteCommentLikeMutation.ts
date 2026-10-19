import { toast } from '@bombom/shared/ui-web';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteChallengeCommentLike } from '@/apis/challenge/challenge.api';
import { queries } from '@/apis/queries';

interface UseDeleteCommentLikeMutationParams {
  challengeId: number;
  commentId: number;
}

export const useDeleteCommentLikeMutation = ({
  challengeId,
  commentId,
}: UseDeleteCommentLikeMutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteChallengeCommentLike(challengeId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.comments.all(challengeId),
      });
    },
    onError: () => {
      toast.error('좋아요 취소에 실패했습니다. 다시 시도해주세요.');
    },
  });
};
