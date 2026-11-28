import { useMutation } from '@tanstack/react-query';
import { postLiteracyQuizClaim } from '@/apis/literacyQuiz/literacyQuiz.api';

// 가입 전환 집계용이라 실패해도 사용자에게 알리지 않는다.
export const useClaimAttemptsMutation = () => {
  return useMutation({
    mutationFn: postLiteracyQuizClaim,
  });
};
