import { queryOptions } from '@tanstack/react-query';
import {
  getPreviousArticleDetail,
  getPreviousArticles,
  type GetPreviousArticleDetailParams,
  type GetPreviousArticlesParams,
} from './previousArticles.api';

export const previousArticlesQueries = {
  list: (params: GetPreviousArticlesParams) =>
    queryOptions({
      queryKey: ['articles', 'previous', params] as const,
      queryFn: () => getPreviousArticles(params),
    }),
  detail: (params: GetPreviousArticleDetailParams) =>
    queryOptions({
      queryKey: ['articles', 'previous', 'detail', params] as const,
      queryFn: () => getPreviousArticleDetail(params),
    }),
};
