import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteArticle } from '@/apis/articles/articles.api';
import {
  isStorageNormalArticleListQueryKey,
  syncDeletedArticleCaches,
} from '@/apis/articles/articles.cache';
import { queries } from '@/apis/queries';
import { formatDate } from '@/utils/date';

export const useDeleteArticlesMutation = (
  deleteType: 'today' | 'article' | 'bookmark' = 'article',
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (articleIds: number[]) =>
      deleteArticle({ articleIds: articleIds }),
    onSuccess: (_, articleIds) => {
      syncDeletedArticleCaches(queryClient, articleIds);

      if (deleteType === 'today') {
        queryClient.invalidateQueries({
          queryKey: queries.articles({ date: formatDate(new Date(), '-') })
            .queryKey,
        });
      } else if (deleteType === 'article') {
        queryClient.invalidateQueries({
          predicate: (query) =>
            isStorageNormalArticleListQueryKey(query.queryKey),
          refetchType: 'active',
        });
      }
    },
  });
};
