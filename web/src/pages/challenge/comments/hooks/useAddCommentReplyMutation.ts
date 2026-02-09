import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  putCommentReply,
  type PutCommentReplyParams,
} from '@/apis/challenge/challenge.api';
import { queries } from '@/apis/queries';
import { toast } from '@/components/Toast/utils/toastActions';

interface UseAddCommentReplyMutationParams {
  challengeId: number;
  commentId: number;
}

export const useAddCommentReplyMutation = ({
  challengeId,
  commentId,
}: UseAddCommentReplyMutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: PutCommentReplyParams) =>
      putCommentReply(challengeId, commentId, params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.comments.all(challengeId),
      });
    },
    onError: () => {
      toast.error('답글 등록에 실패했습니다. 다시 시도해주세요.');
    },
  });
};
