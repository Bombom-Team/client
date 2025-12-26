import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchHighlight } from '@/apis/highlight/highlight.api';
import { queries } from '@/apis/queries';
import type { PatchHighlightParams } from '@/apis/highlight/highlight.api';

export const useUpdateHighlightMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: PatchHighlightParams) => patchHighlight(params),

    onSuccess: (_, params) => {
      queryClient.invalidateQueries({
        queryKey: queries.highlights({ articleId: params.id }).queryKey,
      });
    },
  });
};
