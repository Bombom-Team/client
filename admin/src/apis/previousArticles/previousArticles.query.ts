import { queryOptions, useMutation } from '@tanstack/react-query';
import {
  createPreviousArticle,
  getPreviousArticleDetail,
  getPreviousArticles,
  type CreatePreviousArticleParams,
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

export const useCreatePreviousArticle = () => {
  return useMutation({
    mutationFn: (params: CreatePreviousArticleParams) =>
      createPreviousArticle(params),
  });
};
