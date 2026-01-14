import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelChallengeApplication } from '@/apis/challenge/challenge.api';
import { challengeQueries } from '@/apis/challenge/challenge.query';
import { toast } from '@/components/Toast/utils/toastActions';

interface UseChallengeCancelMutationProps {
  challengeId: number;
}

const useChallengeCancelMutation = ({
  challengeId,
}: UseChallengeCancelMutationProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cancelChallengeApplication(challengeId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: challengeQueries.challenges().queryKey,
      });

      toast.success('챌린지 신청 취소가 완료되었습니다.');
    },
  });
};

export default useChallengeCancelMutation;
