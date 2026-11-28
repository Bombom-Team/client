import { ApiError } from '@bombom/shared/apis';
import { toast } from '@bombom/shared/ui-web';
import { useMutation } from '@tanstack/react-query';
import { postLiteracyQuizAttempt } from '@/apis/literacyQuiz/literacyQuiz.api';
import type { PostLiteracyQuizAttemptResponse } from '@/apis/literacyQuiz/literacyQuiz.api';

interface UseStartAttemptMutationParams {
  onSuccess: (attempt: PostLiteracyQuizAttemptResponse) => void;
}

export const useStartAttemptMutation = ({
  onSuccess,
}: UseStartAttemptMutationParams) => {
  return useMutation({
    mutationFn: postLiteracyQuizAttempt,
    onSuccess,
    onError: (error) => {
      if (error instanceof ApiError && error.status === 429) {
        toast.error('시작 요청이 너무 많아요. 잠시 후 다시 시도해 주세요.');
        return;
      }
      toast.error('시험을 시작하지 못했어요. 다시 시도해 주세요.');
    },
  });
};
