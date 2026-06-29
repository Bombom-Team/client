import { fetcher } from '@bombom/shared/apis';
import type { components, operations } from '@/types/openapi';

export type GetArticlesParams =
  components['schemas']['ArticlesOptionsRequest'] &
    components['schemas']['Pageable'];

export type GetArticlesResponse = components['schemas']['PageArticleResponse'];

export const getArticles = async (params: GetArticlesParams) => {
  return await fetcher.get<GetArticlesResponse>({
    path: '/articles',
    query: params,
  });
};

export type GetArticlesWithSearchParams =
  components['schemas']['ArticleSearchOptionsRequest'] &
    components['schemas']['Pageable'];

export const getArticlesWithSearch = async (
  params: GetArticlesWithSearchParams,
) => {
  return await fetcher.get<GetArticlesResponse>({
    path: '/articles/search',
    query: params,
  });
};

export type DeleteArticlesParams =
  components['schemas']['DeleteArticlesRequest'];

export const deleteArticle = async (params: DeleteArticlesParams) => {
  return await fetcher.post({
    path: '/articles/delete',
    body: params,
  });
};

export type GetArticleByIdParams =
  operations['getArticleDetail']['parameters']['path'];
export type GetArticleByIdResponse =
  components['schemas']['ArticleDetailResponse'];

export const getArticleById = async ({ id }: GetArticleByIdParams) => {
  return await fetcher.get<GetArticleByIdResponse>({
    path: `/articles/${id}`,
  });
};

export type PatchArticleReadParams =
  operations['updateIsRead']['parameters']['path'];

export interface PatchArticleReadResponse {
  /** 읽기 카운트 토큰 소모 여부. 너무 빠른 읽기(어뷰징) 시 false로 내려온다. */
  readCountTokenConsumed: boolean;
}

export const patchArticleRead = async ({ id }: PatchArticleReadParams) => {
  return await fetcher.patch<never, PatchArticleReadResponse>({
    path: `/articles/${id}/read`,
  });
};

export type GetArticleStatisticsNewslettersParams =
  operations['getArticleNewsletterStatistics']['parameters']['query']['request'];

export type GetArticlesStatisticsNewslettersResponse =
  components['schemas']['ArticleNewsletterStatisticsResponse'];

export const getArticlesStatisticsNewsletters = async (
  params: GetArticleStatisticsNewslettersParams,
) => {
  return await fetcher.get<GetArticlesStatisticsNewslettersResponse>({
    path: '/articles/statistics/newsletters',
    query: params,
  });
};
