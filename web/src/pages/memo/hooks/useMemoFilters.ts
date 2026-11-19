import { useQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { useCallback, useState } from 'react';
import { queries } from '@/apis/queries';

export const useMemoFilters = () => {
  const { newsletterId: newsletterIdParams } = useSearch({
    from: '/_bombom/_main/memo',
  });
  const [page, setPage] = useState(0);
  const [prevNewsletterId, setPrevNewsletterId] = useState(newsletterIdParams);

  // 뉴스레터를 바꾸면 메모 수가 달라지므로, 이전 쪽 번호로 요청하기 전에 첫 쪽으로 되돌린다.
  if (prevNewsletterId !== newsletterIdParams) {
    setPrevNewsletterId(newsletterIdParams);
    setPage(0);
  }

  const baseQueryParams = {
    keyword: '',
    size: 12,
    newsletterId: newsletterIdParams,
    page,
  };

  const { data: newsletterCounts } = useQuery(
    queries.highlightStatisticsNewsletter(),
  );

  const handlePageChange = useCallback((value: number) => {
    setPage(value);
  }, []);

  const resetPage = useCallback(() => {
    setPage(0);
  }, []);

  return {
    baseQueryParams,
    newsletterCounts,
    handlePageChange,
    resetPage,
    page,
  };
};
