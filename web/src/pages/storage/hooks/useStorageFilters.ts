import { useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback } from 'react';
import { ARTICLE_SIZE } from '../constants/article';
import type { GetArticlesWithSearchParams } from '@/apis/articles/articles.api';

export const useStorageFilters = () => {
  const navigate = useNavigate();
  const {
    sort: sortParam,
    search: searchParam,
    newsletterId: newsletterIdParams,
    page: pageParam,
  } = useSearch({ from: '/_bombom/_main/storage' });
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
      navigate({
        search: (prev) =>
          ({ ...(prev as Record<string, unknown>), page: value }) as never,
        replace: true,
        resetScroll: false,
      });
    },
    [navigate],
  );

  const resetPage = useCallback(() => {
    navigate({
      search: (prev) => {
        const next = { ...(prev as Record<string, unknown>) };
        delete next.page;
        return next as never;
      },
      replace: true,
      resetScroll: false,
    });
  }, [navigate]);

  return {
    baseQueryParams,
    handlePageChange,
    resetPage,
    page,
  };
};
