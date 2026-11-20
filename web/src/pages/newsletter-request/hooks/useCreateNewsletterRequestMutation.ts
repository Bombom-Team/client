import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  postNewsletterRequest,
  type PostNewsletterRequestResponse,
} from '@/apis/newsletterRequests/newsletterRequests.api';
import { queries } from '@/apis/queries';

interface UseCreateNewsletterRequestMutationParams {
  onSuccess?: (response: PostNewsletterRequestResponse) => void;
  onError?: (error: Error) => void;
}

const useCreateNewsletterRequestMutation = (
  options?: UseCreateNewsletterRequestMutationParams,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postNewsletterRequest,
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: queries.newsletterRequests().queryKey,
      });
      options?.onSuccess?.(response);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};

export default useCreateNewsletterRequestMutation;
