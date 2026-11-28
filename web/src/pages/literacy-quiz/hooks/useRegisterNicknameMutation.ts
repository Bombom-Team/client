import { ApiError } from '@bombom/shared/apis';
import { toast } from '@bombom/shared/ui-web';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { putLiteracyQuizNickname } from '@/apis/literacyQuiz/literacyQuiz.api';
import { queries } from '@/apis/queries';
import type {
  PutLiteracyQuizNicknameParams,
  PutLiteracyQuizNicknameResponse,
} from '@/apis/literacyQuiz/literacyQuiz.api';

interface UseRegisterNicknameMutationParams {
  attemptCode: string;
  onSuccess: (result: PutLiteracyQuizNicknameResponse) => void;
  onInvalid: (message: string) => void;
}

export const useRegisterNicknameMutation = ({
  attemptCode,
  onSuccess,
  onInvalid,
}: UseRegisterNicknameMutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: PutLiteracyQuizNicknameParams) =>
      putLiteracyQuizNickname(attemptCode, params),
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: queries.literacyQuizRanking({ attemptCode }).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: queries.literacyQuizSummary().queryKey,
      });
      onSuccess(result);
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 400) {
        onInvalid(error.message || '쓸 수 없는 닉네임이에요');
        return;
      }
      toast.error('랭킹에 등록하지 못했어요. 다시 시도해 주세요.');
    },
  });
};
