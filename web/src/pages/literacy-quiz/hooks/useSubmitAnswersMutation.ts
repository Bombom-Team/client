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
    // 실패 안내는 공용 토스트 대신 '다시 제출' 버튼 옆 화면 문구로 보여 준다(토스트가 버튼을 가리기 때문).
    onSuccess,
  });
};
