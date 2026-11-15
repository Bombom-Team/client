import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchHighlight } from '@/apis/highlight/highlight.api';
import { queries } from '@/apis/queries';
import type { PatchHighlightParams } from '@/apis/highlight/highlight.api';

interface UseUpdateHighlightMutationParams {
  articleId: number;
}

export const useUpdateHighlightMutation = ({
  articleId,
}: UseUpdateHighlightMutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: PatchHighlightParams) => patchHighlight(params),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.articleHighlights({ articleId }).queryKey,
      });
    },
  });
};
