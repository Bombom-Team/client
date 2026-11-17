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
    // 응답이 오기 전에 다른 글로 넘어가도 요청한 글의 목록을 갱신하도록 글 id를 기억한다.
    onMutate: () => ({ articleId }),
    onSuccess: (_data, _params, mutatedArticle) => {
      queryClient.invalidateQueries({
        queryKey: queries.articleHighlights({
          articleId: mutatedArticle.articleId,
        }).queryKey,
      });
    },
  });
};
