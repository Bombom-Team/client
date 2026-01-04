import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postDailyGuideComment } from '@/apis/challenge/challenge.api';
import { queries } from '@/apis/queries';
import { toast } from '@/components/Toast/utils/toastActions';

interface UseSubmitDailyGuideCommentMuataionProps {
  challengeId: number;
}

export const useSubmitDailyGuideCommentMutation = ({
  challengeId,
}: UseSubmitDailyGuideCommentMuataionProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comment: string) =>
      postDailyGuideComment(challengeId, { comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.todayDailyGuide(challengeId).queryKey,
      });
    },
    onError: () => {
      toast.error('답변 제출에 실패했습니다. 다시 시도해주세요.');
    },
  });
};
