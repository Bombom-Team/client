import { toast } from '@bombom/shared/ui-web';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queries } from '@/apis/queries';
import { postSignupSource } from '@/apis/signupSource/signupSource.api';

interface UsePostSignupSourceMutationParams {
  onSuccess?: () => void;
}

export const usePostSignupSourceMutation = ({
  onSuccess,
}: UsePostSignupSourceMutationParams = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postSignupSource,
    onSuccess: () => {
      queryClient.setQueryData(queries.signupSourceStatus().queryKey, {
        needsSignupSource: false,
      });
      onSuccess?.();
    },
    onError: () => {
      toast.error('가입 경로를 저장하지 못했어요. 다시 시도해 주세요.');
    },
  });
};
