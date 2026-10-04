import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  deleteNewsletterRequestLike,
  putNewsletterRequestLike,
} from '@/apis/newsletterRequests/newsletterRequests.api';
import { queries } from '@/apis/queries';
import { toast } from '@/components/Toast/utils/toastActions';

type ToggleNewsletterRequestLikeVariables = {
  newsletterRequestId: number;
  liked: boolean;
};

type UseToggleNewsletterRequestLikeMutationOptions = {
  onSuccess?: () => void;
};

const useToggleNewsletterRequestLikeMutation = (
  options?: UseToggleNewsletterRequestLikeMutationOptions,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      newsletterRequestId,
      liked,
    }: ToggleNewsletterRequestLikeVariables) =>
      liked
        ? deleteNewsletterRequestLike({ newsletterRequestId })
        : putNewsletterRequestLike({ newsletterRequestId }),
    onSuccess: async (_, { liked }) => {
      await queryClient.invalidateQueries({
        queryKey: queries.newsletterRequests().queryKey,
      });
      toast.success(
        liked
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

export default useToggleNewsletterRequestLikeMutation;
