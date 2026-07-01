import { useSearch } from '@tanstack/react-router';
import { useCallback } from 'react';
import { ARTICLE_SIZE } from '../constants/article';
import { useSearchParamState } from '@/hooks/useSearchParamState';
import type { GetArticlesWithSearchParams } from '@/apis/articles/articles.api';

export const useStorageFilters = () => {
  const {
    sort: sortParam,
    search: searchParam,
    newsletterId: newsletterIdParams,
  } = useSearch({ from: '/_bombom/_main/storage' });
  const [pageParam, setPage] = useSearchParamState<number>('page');
  const page = pageParam ?? 1;

  const baseQueryParams: GetArticlesWithSearchParams = {
    sort: ['arrivedDateTime', sortParam ?? 'DESC'],
    keyword: searchParam ?? '',
    size: ARTICLE_SIZE,
    newsletterId: newsletterIdParams,
    page,
  };

  const handlePageChange = useCallback(
    (value: number) => {
      setPage(value);
    },
    [setPage],
  );

  const resetPage = useCallback(() => {
    setPage(null);
  }, [setPage]);

  return {
    baseQueryParams,
    handlePageChange,
    resetPage,
    page,
  };
};
