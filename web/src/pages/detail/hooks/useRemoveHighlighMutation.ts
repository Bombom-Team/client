import { toast } from '@bombom/shared/ui-web';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeHighlightFromDOM } from '../utils/highlight';
import { deleteHighlight } from '@/apis/highlight/highlight.api';
import { queries } from '@/apis/queries';
import type { DeleteHighlightParams } from '@/apis/highlight/highlight.api';

interface UseRemoveHighlightMutationParams {
  articleId: number;
}

export const useRemoveHighlightMutation = ({
  articleId,
}: UseRemoveHighlightMutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: DeleteHighlightParams) => deleteHighlight(params),
    // 응답이 오기 전에 다른 글로 넘어가도 요청한 글의 목록을 갱신하도록 글 id를 기억한다.
    onMutate: () => ({ articleId }),
    onSuccess: (_, params, mutatedArticle) => {
      removeHighlightFromDOM(params.id);
      queryClient.invalidateQueries({
        queryKey: queries.articleHighlights({
          articleId: mutatedArticle.articleId,
        }).queryKey,
      });
    },
    onError: () => {
      toast.error('형광펜을 지우지 못했어요. 잠시 후 다시 시도해주세요.');
    },
  });
};
