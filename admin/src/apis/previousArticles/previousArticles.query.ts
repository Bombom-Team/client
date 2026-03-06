import { queryOptions, useMutation } from '@tanstack/react-query';
import {
  createPreviousArticle,
  deletePreviousArticle,
  getPreviousArticleDetail,
  getPreviousArticles,
  type CreatePreviousArticleParams,
  type DeletePreviousArticleParams,
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

export const useDeletePreviousArticle = () => {
  return useMutation({
    mutationFn: (params: DeletePreviousArticleParams) =>
      deletePreviousArticle(params),
  });
};
