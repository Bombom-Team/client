import {
  InfiniteQueryObserver,
  QueryClient,
  type InfiniteData,
} from '@tanstack/react-query';
import {
  consumeStorageArticleRefreshRequest,
  removeArticlesFromArticleCache,
  requestStorageArticleRefresh,
  syncDeletedArticleCaches,
  updateArticleBookmarkStatus,
  updateArticleReadStatus,
} from './articles.cache';
import type { GetArticlesResponse } from './articles.api';

const NORMAL_ARTICLES_QUERY_KEY = ['articles', { page: 0 }] as const;
const NORMAL_SEARCH_ARTICLES_QUERY_KEY = [
  'articles',
  'search',
  { keyword: 'news', page: 0 },
] as const;
const STORAGE_ARTICLES_QUERY_KEY = [
  'articles',
  'storage',
  { keyword: '', sort: ['arrivedDateTime', 'DESC'], page: 0 },
] as const;
const INFINITE_ARTICLES_QUERY_KEY = [
  'articles',
  'storage',
  'infinite',
  {},
] as const;
const INFINITE_SEARCH_ARTICLES_QUERY_KEY = [
  'articles',
  'storage',
  'search',
  'infinite',
  {},
] as const;
const ARTICLE_DETAIL_QUERY_KEY = ['articles', 1] as const;
const ARTICLE_STATISTICS_QUERY_KEY = [
  'articles',
  'statistics',
  'newsletters',
] as const;
const BOOKMARKS_QUERY_KEY = ['bookmarks', { size: 100 }] as const;

const createPage = (articleIds: number[]): GetArticlesResponse => {
  return {
    content: articleIds.map((articleId) => ({
      articleId,
      title: `article-${articleId}`,
      contentsSummary: '',
      arrivedDateTime: '2026-07-11T00:00:00.000Z',
      expectedReadTime: 1,
      isRead: false,
      isBookmarked: false,
      newsletter: {
        name: 'newsletter',
        imageUrl: '',
        category: 'category',
      },
    })),
    size: 2,
    totalElements: 3,
    totalPages: 2,
    numberOfElements: articleIds.length,
    empty: articleIds.length === 0,
  };
};

const setArticles = (
  queryClient: QueryClient,
  queryKey: readonly unknown[],
) => {
  queryClient.setQueryData(queryKey, createPage([1, 2]));
};

const setInfiniteArticles = (
  queryClient: QueryClient,
  queryKey: readonly unknown[],
) => {
  queryClient.setQueryData(queryKey, {
    pages: [createPage([1, 2]), createPage([3])],
    pageParams: [0, 1],
  });
};

describe('articles cache', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    setArticles(queryClient, NORMAL_ARTICLES_QUERY_KEY);
    setArticles(queryClient, NORMAL_SEARCH_ARTICLES_QUERY_KEY);
    setInfiniteArticles(queryClient, INFINITE_ARTICLES_QUERY_KEY);
    setInfiniteArticles(queryClient, INFINITE_SEARCH_ARTICLES_QUERY_KEY);
    queryClient.setQueryData(ARTICLE_DETAIL_QUERY_KEY, { isRead: false });
  });

  it('삭제한 기사를 일반·무한 기사 캐시에서 제거하고 메타데이터를 보정한다', () => {
    removeArticlesFromArticleCache(queryClient, [2, 3]);

    const normalArticles = queryClient.getQueryData<GetArticlesResponse>(
      NORMAL_ARTICLES_QUERY_KEY,
    );
    const infiniteArticles = queryClient.getQueryData<
      InfiniteData<GetArticlesResponse>
    >(INFINITE_ARTICLES_QUERY_KEY);

    expect(normalArticles?.content).toHaveLength(1);
    expect(normalArticles?.totalElements).toBe(2);
    expect(normalArticles?.numberOfElements).toBe(1);
    expect(
      infiniteArticles?.pages.flatMap((page) => page.content),
    ).toHaveLength(1);
    expect(infiniteArticles?.pages[0]?.totalElements).toBe(1);
    expect(infiniteArticles?.pages[1]?.totalElements).toBe(1);
    expect(infiniteArticles?.pages[1]?.empty).toBe(true);
  });

  it('읽음·북마크 상태를 일반·무한·검색 기사 캐시에 반영한다', () => {
    updateArticleReadStatus(queryClient, 1);
    updateArticleBookmarkStatus(queryClient, 3, true);

    const normalArticles = queryClient.getQueryData<GetArticlesResponse>(
      NORMAL_ARTICLES_QUERY_KEY,
    );
    const searchedArticles = queryClient.getQueryData<GetArticlesResponse>(
      NORMAL_SEARCH_ARTICLES_QUERY_KEY,
    );
    const infiniteArticles = queryClient.getQueryData<
      InfiniteData<GetArticlesResponse>
    >(INFINITE_ARTICLES_QUERY_KEY);
    const searchedInfiniteArticles = queryClient.getQueryData<
      InfiniteData<GetArticlesResponse>
    >(INFINITE_SEARCH_ARTICLES_QUERY_KEY);

    expect(normalArticles?.content?.[0]?.isRead).toBe(true);
    expect(searchedArticles?.content?.[0]?.isRead).toBe(true);
    expect(infiniteArticles?.pages[0]?.content?.[0]?.isRead).toBe(true);
    expect(infiniteArticles?.pages[1]?.content?.[0]?.isBookmarked).toBe(true);
    expect(searchedInfiniteArticles?.pages[1]?.content?.[0]?.isBookmarked).toBe(
      true,
    );
    expect(queryClient.getQueryData(ARTICLE_DETAIL_QUERY_KEY)).toEqual({
      isRead: false,
    });
  });

  it('새 아티클 확인 시 보관함 캐시만 제거하고 새로고침 요청을 기억한다', () => {
    setArticles(queryClient, STORAGE_ARTICLES_QUERY_KEY);

    requestStorageArticleRefresh(queryClient);

    expect(
      queryClient.getQueryData(STORAGE_ARTICLES_QUERY_KEY),
    ).toBeUndefined();
    expect(queryClient.getQueryData(NORMAL_ARTICLES_QUERY_KEY)).toBeDefined();
    expect(consumeStorageArticleRefreshRequest()).toBe(true);
    expect(consumeStorageArticleRefreshRequest()).toBe(false);
  });

  it('삭제 후 inactive 보관함 캐시를 비워 다음 진입을 첫 페이지부터 시작한다', async () => {
    setArticles(queryClient, STORAGE_ARTICLES_QUERY_KEY);
    queryClient.setQueryData(ARTICLE_STATISTICS_QUERY_KEY, { totalCount: 3 });
    queryClient.setQueryData(BOOKMARKS_QUERY_KEY, { content: [1, 2] });

    await syncDeletedArticleCaches(queryClient, [2]);

    expect(
      queryClient.getQueryData(STORAGE_ARTICLES_QUERY_KEY),
    ).toBeUndefined();
    expect(
      queryClient.getQueryState(ARTICLE_STATISTICS_QUERY_KEY)?.isInvalidated,
    ).toBe(true);
    expect(queryClient.getQueryState(BOOKMARKS_QUERY_KEY)?.isInvalidated).toBe(
      true,
    );
  });

  it('삭제 후 활성 무한 목록의 로드한 페이지를 다시 요청해 offset 경계를 맞춘다', async () => {
    const refetchedPages = [createPage([2, 3]), createPage([4, 5])];
    const queryFn = jest
      .fn()
      .mockImplementation(({ pageParam }: { pageParam: number }) =>
        Promise.resolve(refetchedPages[pageParam] ?? createPage([])),
      );
    const observer = new InfiniteQueryObserver(queryClient, {
      queryKey: INFINITE_ARTICLES_QUERY_KEY,
      queryFn,
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage.last ? undefined : (lastPage.number ?? 0) + 1,
      staleTime: Infinity,
    });
    const unsubscribe = observer.subscribe(() => undefined);

    await syncDeletedArticleCaches(queryClient, [1]);

    expect(queryFn).toHaveBeenCalledTimes(2);
    expect(observer.getCurrentResult().data?.pages).toEqual(refetchedPages);

    unsubscribe();
  });
});
