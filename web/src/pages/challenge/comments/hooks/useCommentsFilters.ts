import { useCallback, useState } from 'react';
import type { GetChallengeCommentsParams } from '@/apis/challenge/challenge.api';

const COMMENTS_SIZE = 6;

interface UseCommentsFiltersProps {
  challengeId: number;
  selectedDate: string;
}

export const useCommentsFilters = ({
  challengeId,
  selectedDate,
}: UseCommentsFiltersProps) => {
  const [page, setPage] = useState(1);

  const baseQueryParams: GetChallengeCommentsParams = {
    challengeId,
    start: selectedDate,
    end: selectedDate,
    page,
    size: COMMENTS_SIZE,
  };

  const changePage = useCallback((value: number) => {
    setPage(value);
  }, []);

  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  return {
    baseQueryParams,
    changePage,
    resetPage,
    page,
  };
};
