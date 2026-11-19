import { toast } from '@bombom/shared/ui-web';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postDailyGuideComment } from '@/apis/challenge/challenge.api';
import { queries } from '@/apis/queries';

interface UseSubmitDailyGuideCommentMutationProps {
  challengeId: number;
  dayIndex: number;
}

export const useSubmitDailyGuideCommentMutation = ({
  challengeId,
  dayIndex,
}: UseSubmitDailyGuideCommentMutationProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) =>
      postDailyGuideComment(challengeId, dayIndex, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.todayDailyGuide(challengeId).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: queries.memberProgress(challengeId).queryKey,
      });
    },
    onError: () => {
      toast.error('답변 제출에 실패했습니다. 다시 시도해주세요.');
    },
  });
};
