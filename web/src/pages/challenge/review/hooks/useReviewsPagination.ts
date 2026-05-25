import { useCallback, useState } from 'react';
import type { GetChallengeReviewsPageParams } from '@/apis/challenge/challenge.api';

const REVIEWS_SIZE = 10;

interface UseReviewsPaginationProps {
  challengeId: number;
}

export const useReviewsPagination = ({
  challengeId,
}: UseReviewsPaginationProps) => {
  const [page, setPage] = useState(1);

  const baseQueryParams: GetChallengeReviewsPageParams = {
    challengeId,
    page,
    size: REVIEWS_SIZE,
  };

  const changePage = useCallback((value: number) => {
    setPage(value);
  }, []);

  return {
    baseQueryParams,
    changePage,
    page,
  };
};
