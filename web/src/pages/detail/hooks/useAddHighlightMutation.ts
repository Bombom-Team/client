import { toast } from '@bombom/shared/ui-web';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addHighlightToDOM } from '../utils/highlight';
import { postHighlight } from '@/apis/highlight/highlight.api';
import { queries } from '@/apis/queries';
import type { Highlight } from '../types/highlight';
import type { PostHighlightParams } from '@/apis/highlight/highlight.api';
import type { RefObject } from 'react';

interface UseAddHighlightMutationParams {
  articleId: number;
  contentRef: RefObject<HTMLDivElement | null>;
}

export const useAddHighlightMutation = ({
  articleId,
  contentRef,
}: UseAddHighlightMutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: PostHighlightParams) => postHighlight(params),
    onSuccess: (addedHighlight) => {
      // 응답이 오기 전에 다른 글로 넘어갔으면 지금 보이는 글에는 그리지 않는다.
      if (contentRef.current && addedHighlight.articleId === articleId) {
        addHighlightToDOM(contentRef.current, addedHighlight as Highlight);
      }
      queryClient.invalidateQueries({
        queryKey: queries.articleHighlights({
          articleId: addedHighlight.articleId,
        }).queryKey,
      });
    },
    onError: () => {
      toast.error('형광펜을 저장하지 못했어요. 잠시 후 다시 시도해주세요.');
    },
  });
};
