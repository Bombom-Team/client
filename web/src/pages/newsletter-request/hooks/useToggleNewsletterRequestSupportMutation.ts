import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  deleteNewsletterRequestSupporter,
  postNewsletterRequestSupporter,
} from '@/apis/newsletterRequests/newsletterRequests.api';
import { queries } from '@/apis/queries';
import { toast } from '@/components/Toast/utils/toastActions';

type ToggleNewsletterRequestSupportVariables = {
  newsletterRequestId: number;
  supported: boolean;
};

type UseToggleNewsletterRequestSupportMutationOptions = {
  onSuccess?: () => void;
};

const useToggleNewsletterRequestSupportMutation = (
  options?: UseToggleNewsletterRequestSupportMutationOptions,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      newsletterRequestId,
      supported,
    }: ToggleNewsletterRequestSupportVariables) =>
      supported
        ? deleteNewsletterRequestSupporter({ newsletterRequestId })
        : postNewsletterRequestSupporter({ newsletterRequestId }),
    onSuccess: async (_, { supported }) => {
      await queryClient.invalidateQueries({
        queryKey: queries.newsletterRequests().queryKey,
      });
      toast.success(
        supported
          ? '공감을 취소했어요.'
          : '공감을 남겼어요. 등록되면 알려드릴게요.',
      );
      options?.onSuccess?.();
    },
    onError: () => {
      toast.error('공감을 반영하지 못했어요. 다시 시도해 주세요.');
    },
  });
};

export default useToggleNewsletterRequestSupportMutation;
