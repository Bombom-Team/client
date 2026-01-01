import { useMutation, useQueryClient } from '@tanstack/react-query';
import { applyChallengeApplication } from '@/apis/challenge/challenge.api';
import { challengeQueries } from '@/apis/challenge/challenge.query';
import { toast } from '@/components/Toast/utils/toastActions';

interface UseChallengeApplyMutationProps {
  challengeId: number;
}

const useChallengeApplyMutation = ({
  challengeId,
}: UseChallengeApplyMutationProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => applyChallengeApplication(challengeId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: challengeQueries.challenges().queryKey,
      });

      toast.success('챌린지 신청에 성공했습니다.');
    },
  });
};

export default useChallengeApplyMutation;
