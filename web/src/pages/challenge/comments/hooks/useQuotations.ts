import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { queries } from '@/apis/queries';

interface UseQuotationsParams {
  articleId: number | null;
}

const useQuotations = ({ articleId }: UseQuotationsParams) => {
  const { data: highlights } = useQuery({
    ...queries.challengeArticleHighlights({
      articleId: articleId!,
      page: 0,
      size: 100,
    }),
    enabled: articleId !== null,
  });

  const quotations = useMemo(() => {
    return (
      highlights?.content?.map(({ highlightId, text, memo }) => ({
        id: highlightId,
        text,
        memo,
      })) ?? []
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(highlights?.content)]);

  return quotations;
};

export default useQuotations;
