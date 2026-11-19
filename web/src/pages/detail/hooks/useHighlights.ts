import { useQuery } from '@tanstack/react-query';
import { queries } from '@/apis/queries';
import type { Highlight } from '../types/highlight';

const EMPTY_HIGHLIGHTS: Highlight[] = [];

export const useHighlights = ({ articleId }: { articleId: number }) => {
  // 목록 조회(/highlights)는 글당 최신 10개까지만 내려 주므로, 글의 형광펜 전체를 주는 API를 쓴다.
  const { data: highlights, isSuccess } = useQuery(
    queries.articleHighlights({ articleId }),
  );

  return {
    highlights: highlights ?? EMPTY_HIGHLIGHTS,
    isHighlightLoaded: isSuccess,
  };
};
