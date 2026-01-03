import { useQuery } from '@tanstack/react-query';
import { queries } from '@/apis/queries';

interface UseQuotationsParams {
  articleId: number | null;
}

const useQuotations = ({ articleId }: UseQuotationsParams) => {
  const { data: highlights } = useQuery({
    ...queries.highlights({ articleId: articleId! }),
    enabled: articleId !== null,
  });

  const quotations =
    highlights?.content?.map(({ id, text, memo }) => ({
      id,
      text,
      memo,
    })) ?? [];

  return quotations;
};

export default useQuotations;
