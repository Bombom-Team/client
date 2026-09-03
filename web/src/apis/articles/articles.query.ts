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

const STORAGE_ARTICLES_QUERY_OPTIONS = {
  staleTime: Infinity,
  gcTime: 1000 * 60 * 30,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
} as const;

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

  storageArticles: (params: GetArticlesParams) =>
    queryOptions({
      queryKey: ['articles', 'storage', { keyword: '', ...params }],
      queryFn: () => getArticles(params),
      ...STORAGE_ARTICLES_QUERY_OPTIONS,
    }),

  storageArticlesWithSearch: (params: GetArticlesWithSearchParams) =>
    queryOptions({
      queryKey: ['articles', 'storage', 'search', params],
      queryFn: () => getArticlesWithSearch(params),
      ...STORAGE_ARTICLES_QUERY_OPTIONS,
    }),

  infiniteArticles: (params: GetArticlesParams) =>
    infiniteQueryOptions({
      queryKey: ['articles', 'storage', 'infinite', { keyword: '', ...params }],
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
      ...STORAGE_ARTICLES_QUERY_OPTIONS,
    }),

  infiniteArticlesWithSearch: (params: GetArticlesWithSearchParams) =>
    infiniteQueryOptions({
      queryKey: ['articles', 'storage', 'search', 'infinite', params],
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
      ...STORAGE_ARTICLES_QUERY_OPTIONS,
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
