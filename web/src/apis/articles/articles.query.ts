import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import {
  getArticleById,
  getArticles,
  getArticlesStatisticsNewsletters,
  getArticlesWithSearch,
  type GetArticleByIdParams,
  type GetArticlesParams,
  type GetArticleStatisticsNewslettersParams,
  type GetArticlesWithSearchParams,
} from './articles.api';

export const articlesQueries = {
  articles: (params: GetArticlesParams) =>
    queryOptions({
      queryKey: ['articles', { keyword: '', ...params }],
      queryFn: () => getArticles(params),
    }),

  articlesWithSearch: (params: GetArticlesWithSearchParams) =>
    queryOptions({
      queryKey: ['articles', 'search', params],
      queryFn: () => getArticlesWithSearch(params),
    }),

  infiniteArticles: (params: GetArticlesParams) =>
    infiniteQueryOptions({
      queryKey: ['articles', 'infinite', { keyword: '', ...params }],
      queryFn: ({ pageParam = 0 }) =>
        getArticles({
          ...params,
          page: pageParam,
        }),
      getNextPageParam: (lastPage) => {
        if (!lastPage || lastPage.last) return undefined;

        return (lastPage.number ?? 0) + 1;
      },
      initialPageParam: 0,
    }),

  infiniteArticlesWithSearch: (params: GetArticlesWithSearchParams) =>
    infiniteQueryOptions({
      queryKey: ['articles', 'search', 'infinite', params],
      queryFn: ({ pageParam = 0 }) =>
        getArticlesWithSearch({
          ...params,
          page: pageParam,
        }),
      getNextPageParam: (lastPage) => {
        if (!lastPage || lastPage.last) return undefined;

        return (lastPage.number ?? 0) + 1;
      },
      initialPageParam: 0,
    }),

  articleById: (params: GetArticleByIdParams) =>
    queryOptions({
      queryKey: ['articles', params.id],
      queryFn: () => getArticleById(params),
    }),

  articlesStatisticsNewsletters: (
    params: GetArticleStatisticsNewslettersParams,
  ) =>
    queryOptions({
      queryKey: ['articles', 'statistics', 'newsletters', params],
      queryFn: () => getArticlesStatisticsNewsletters(params),
    }),
};
