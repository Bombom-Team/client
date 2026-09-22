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

const STORAGE_LIST_QUERY_BEHAVIOR = {
  staleTime: Infinity,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
} as const;

const PC_STORAGE_QUERY_OPTIONS = {
  ...STORAGE_LIST_QUERY_BEHAVIOR,
  gcTime: 5 * 60 * 1000, // 5분
} as const;

const MOBILE_STORAGE_INFINITE_QUERY_OPTIONS = {
  ...STORAGE_LIST_QUERY_BEHAVIOR,
  gcTime: Infinity,
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

  latestArticle: () =>
    queryOptions({
      queryKey: ['articles', 'latest'],
      queryFn: () =>
        getArticles({
          page: 0,
          size: 1,
          sort: ['arrivedDateTime', 'DESC'],
        }),
      staleTime: 0,
      gcTime: Infinity,
      refetchOnMount: 'always',
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }),

  storageArticles: (params: GetArticlesParams) =>
    queryOptions({
      queryKey: ['articles', 'storage', { keyword: '', ...params }],
      queryFn: () => getArticles(params),
      ...PC_STORAGE_QUERY_OPTIONS,
    }),

  storageArticlesWithSearch: (params: GetArticlesWithSearchParams) =>
    queryOptions({
      queryKey: ['articles', 'storage', 'search', params],
      queryFn: () => getArticlesWithSearch(params),
      ...PC_STORAGE_QUERY_OPTIONS,
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
      ...MOBILE_STORAGE_INFINITE_QUERY_OPTIONS,
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
      ...MOBILE_STORAGE_INFINITE_QUERY_OPTIONS,
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
      staleTime: Infinity,
    }),
};
