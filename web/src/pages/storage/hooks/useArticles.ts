import { useQuery } from '@tanstack/react-query';
import { isValidKeyword } from '../utils/isValidKeyword';
import { queries } from '@/apis/queries';
import type { GetStorageArticlesParams } from '@/apis/articles/articles.api';

const useArticles = (params: GetStorageArticlesParams) => {
  const { keyword, unreadOnly, date, ...commonParams } = params;

  return useQuery(
    isValidKeyword(keyword)
      ? queries.storageArticlesWithSearch({ keyword, ...commonParams })
      : queries.storageArticles({ unreadOnly, date, ...commonParams }),
  );
};

export default useArticles;
