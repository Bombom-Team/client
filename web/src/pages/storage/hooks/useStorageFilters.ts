import { useSearch } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import { ARTICLE_SIZE } from '../constants/article';
import { consumeStorageArticleRefreshRequest } from '@/apis/articles/articles.cache';
import { useSearchParamState } from '@/hooks/useSearchParamState';
import type { GetStorageArticlesParams } from '@/apis/articles/articles.api';

export const useStorageFilters = () => {
  const {
    sort: sortParam,
    search: searchParam,
    newsletterId: newsletterIdParams,
    unreadOnly: unreadOnlyParam,
  } = useSearch({ from: '/_bombom/_main/storage' });
  const [pageParam, setPage] = useSearchParamState<number>('page');
  const [isRefreshPending, setIsRefreshPending] = useState(
    consumeStorageArticleRefreshRequest,
  );
  const page = isRefreshPending ? 1 : (pageParam ?? 1);

  const baseQueryParams: GetStorageArticlesParams = {
    sort: ['arrivedDateTime', sortParam ?? 'DESC'],
    keyword: searchParam ?? '',
    size: ARTICLE_SIZE,
    newsletterId: newsletterIdParams,
    unreadOnly: unreadOnlyParam ?? false,
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

  useEffect(() => {
    if (!isRefreshPending) return;

    if (pageParam !== null && pageParam !== undefined) {
      setPage(null);
      return;
    }

    setIsRefreshPending(false);
  }, [isRefreshPending, pageParam, setPage]);

  return {
    baseQueryParams,
    handlePageChange,
    resetPage,
    page,
  };
};
