import { queryOptions, useMutation } from '@tanstack/react-query';
import {
  createPreviousArticle,
  deletePreviousArticle,
  getPreviousArticleDetail,
  getPreviousArticles,
  updatePreviousArticle,
  type CreatePreviousArticleParams,
  type DeletePreviousArticleParams,
  type GetPreviousArticleDetailParams,
  type GetPreviousArticlesParams,
  type UpdatePreviousArticleParams,
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

export const useUpdatePreviousArticle = () => {
  return useMutation({
    mutationFn: (params: UpdatePreviousArticleParams) =>
      updatePreviousArticle(params),
  });
};
