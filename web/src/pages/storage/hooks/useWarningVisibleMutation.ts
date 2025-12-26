import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postWarningVisible } from '@/apis/members/members.api';
import { queries } from '@/apis/queries';
import type { PostWarningVisibleParams } from '@/apis/members/members.api';

const useWarningVisibleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: PostWarningVisibleParams) =>
      postWarningVisible(params),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.warningVisibleStatus().queryKey,
      });
    },
  });
};

export default useWarningVisibleMutation;
