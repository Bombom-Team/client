import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postNewsletterRequest } from '@/apis/newsletterRequests/newsletterRequests.api';
import { queries } from '@/apis/queries';
import type { CreateNewsletterRequestResponse } from '@/types/newsletterRequest';

type UseCreateNewsletterRequestMutationOptions = {
  onSuccess?: (response: CreateNewsletterRequestResponse) => void;
  onError?: (error: Error) => void;
};

const useCreateNewsletterRequestMutation = (
  options?: UseCreateNewsletterRequestMutationOptions,
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
