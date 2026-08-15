import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchArticleRead } from '@/apis/articles/articles.api';
import { queries } from '@/apis/queries';
import { toast } from '@/components/Toast/utils/toastActions';
import { trackRetentionEvent } from '@/libs/googleAnalytics/retentionEvents';
import { formatDate } from '@/utils/date';

interface UseArticleAsReadMutationParams {
  articleId: number;
  newsletterCategory?: string;
}

const useArticleAsReadMutation = ({
  articleId,
  newsletterCategory,
}: UseArticleAsReadMutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => patchArticleRead({ id: articleId }),
    onSuccess: (data) => {
      // 너무 빠른 읽기로 읽기 카운트가 적립되지 않은 경우 천천히 읽기를 안내한다.
      if (data?.readCountTokenConsumed === false) {
        toast.info('너무 빠르게 읽으면 읽기 활동에 반영되지 않아요');
      }

      if (data?.readCountTokenConsumed === true) {
        trackRetentionEvent('article_read_completed', {
          ...(newsletterCategory && {
            newsletter_category: newsletterCategory,
          }),
        });
      }

      const today = new Date();

      queryClient.invalidateQueries({
        queryKey: queries.articleById({ id: articleId }).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: queries.articles({ date: formatDate(today, '-') }).queryKey,
      });
    },
  });
};

export default useArticleAsReadMutation;
