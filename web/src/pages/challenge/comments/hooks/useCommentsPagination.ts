import { useCallback, useState } from 'react';
import type { GetChallengeCommentsParams } from '@/apis/challenge/challenge.api';

const COMMENTS_SIZE = 6;

interface UseCommentsPaginationProps {
  challengeId: number;
  selectedDate: string;
}

export const useCommentsPagination = ({
  challengeId,
  selectedDate,
}: UseCommentsPaginationProps) => {
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
