import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateArticleBookmarkStatus } from '@/apis/articles/articles.cache';
import { deleteBookmark } from '@/apis/bookmark/bookmark.api';
import { queries } from '@/apis/queries';

const useRemoveBookmarkMutation = ({ articleId }: { articleId: number }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteBookmark({ articleId }),
    onSuccess: () => {
      updateArticleBookmarkStatus(queryClient, articleId, false);
      queryClient.invalidateQueries({
        queryKey: queries.articleBookmarkStatus({ articleId }).queryKey,
      });
    },
  });
};

export default useRemoveBookmarkMutation;
