import { toast } from '@bombom/shared/ui-web';
import { useMutation } from '@tanstack/react-query';
import { postLiteracyQuizSubmission } from '@/apis/literacyQuiz/literacyQuiz.api';
import type {
  PostLiteracyQuizSubmissionParams,
  PostLiteracyQuizSubmissionResponse,
} from '@/apis/literacyQuiz/literacyQuiz.api';

interface UseSubmitAnswersMutationParams {
  attemptCode: string | null;
  onSuccess: (result: PostLiteracyQuizSubmissionResponse) => void;
}

export const useSubmitAnswersMutation = ({
  attemptCode,
  onSuccess,
}: UseSubmitAnswersMutationParams) => {
  return useMutation({
    mutationFn: (params: PostLiteracyQuizSubmissionParams) => {
      if (!attemptCode) throw new Error('시작한 시험이 없습니다.');
      return postLiteracyQuizSubmission(attemptCode, params);
    },
    onSuccess,
    onError: () => {
      toast.error('답안을 제출하지 못했어요. 다시 시도해 주세요.');
    },
  });
};
