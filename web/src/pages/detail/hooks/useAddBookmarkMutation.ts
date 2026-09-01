import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateArticleBookmarkStatus } from '@/apis/articles/articles.cache';
import { postBookmark } from '@/apis/bookmark/bookmark.api';
import { queries } from '@/apis/queries';

const useAddBookmarkMutation = ({ articleId }: { articleId: number }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => postBookmark({ articleId }),
    onSuccess: () => {
      updateArticleBookmarkStatus(queryClient, articleId, true);
      queryClient.invalidateQueries({
        queryKey: queries.articleBookmarkStatus({ articleId }).queryKey,
      });
    },
  });
};

export default useAddBookmarkMutation;
