import { queryOptions } from '@tanstack/react-query';
import {
  getPreviousArticleDetail,
  getPreviousArticles,
  type GetPreviousArticleDetailParams,
  type GetPreviousArticlesParams,
} from './previousArticles.api';

export const previousArticlesQueries = {
  previousArticles: (params: GetPreviousArticlesParams) =>
    queryOptions({
      queryKey: ['articles', 'previous', params],
      queryFn: () => getPreviousArticles(params),
    }),

  previousArticleDetail: (params: GetPreviousArticleDetailParams) =>
    queryOptions({
      queryKey: ['articles', 'previous', params],
      queryFn: () => getPreviousArticleDetail(params),
    }),
};
