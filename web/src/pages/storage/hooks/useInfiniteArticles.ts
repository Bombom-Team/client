import { useInfiniteQuery } from '@tanstack/react-query';
import { isValidKeyword } from '../utils/isValidKeyword';
import { queries } from '@/apis/queries';
import type { GetStorageArticlesParams } from '@/apis/articles/articles.api';

const useInfiniteArticles = (params: GetStorageArticlesParams) => {
  const { keyword, unreadOnly, date, ...commonParams } = params;

  return useInfiniteQuery(
    isValidKeyword(keyword)
      ? queries.infiniteArticlesWithSearch({ keyword, ...commonParams })
      : queries.infiniteArticles({ unreadOnly, date, ...commonParams }),
  );
};

export default useInfiniteArticles;
