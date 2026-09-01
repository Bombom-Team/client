/**
 * @file articles.cache.ts
 * @summary 아티클 TanStack Query 캐시 수동 패치 및 정합성 동기화 모듈
 *
 * - 캐시 직접 수정: 읽음/북마크 변경 시 서버 재요청 없이 UI 즉시 반영
 * - 삭제 정합성: Offset 페이징 누락 방지 및 메타데이터(총 개수, 마지막 페이지 등) 보정
 * - 보관함 갱신: 투데이 새 글 도착 시 보관함 캐시 리셋 플래그 관리
 */

import type { GetArticlesResponse } from './articles.api';
import type {
  InfiniteData,
  QueryClient,
  QueryKey,
} from '@tanstack/react-query';

/** 투데이 화면에서 '새 아티클' 감지 시 보관함 캐시 리셋 여부를 관리하는 세션 플래그 */
let storageArticleRefreshRequested = false;

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

/**
 * 아티클 무한 스크롤(useInfiniteQuery) 쿼리 키 여부 확인
 * @description 일반/검색 무한 스크롤 쿼리를 모두 판별합니다.
 * @example `['articles', 'storage', 'infinite', ...]`, `['articles', 'storage', 'search', 'infinite', ...]`
 */
const isInfiniteArticleQueryKey = (queryKey: QueryKey): boolean => {
  return (
    queryKey[0] === 'articles' &&
    queryKey[1] === 'storage' &&
    (queryKey[2] === 'infinite' || queryKey[3] === 'infinite')
  );
};

/**
 * 일반 페이지네이션(비-무한스크롤) 아티클 목록 쿼리 키 여부 확인
 * @description 투데이 목록, PC 보관함 목록, 검색 목록 포함
 */
export const isNormalArticleListQueryKey = (queryKey: QueryKey): boolean => {
  if (queryKey[0] !== 'articles') return false;

  if (queryKey[1] === 'storage') {
    return (
      isObject(queryKey[2]) ||
      (queryKey[2] === 'search' && isObject(queryKey[3]))
    );
  }

  return (
    isObject(queryKey[1]) || (queryKey[1] === 'search' && isObject(queryKey[2]))
  );
};

/**
 * 보관함 아티클 쿼리 키 여부 확인
 * @example `['articles', 'storage', ...]`
 */
const isStorageArticleQueryKey = (queryKey: QueryKey): boolean => {
  return queryKey[0] === 'articles' && queryKey[1] === 'storage';
};

/**
 * PC 보관함(일반 페이지네이션) 쿼리 키 여부 확인
 */
export const isStorageNormalArticleListQueryKey = (
  queryKey: QueryKey,
): boolean => {
  return (
    isStorageArticleQueryKey(queryKey) && isNormalArticleListQueryKey(queryKey)
  );
};

/**
 * 투데이에서 새 아티클 발견 시 보관함 캐시 갱신을 요청
 * - 보관함 캐시 제거 (`removeQueries`) -> 다음 보관함 진입 시 1페이지부터 조회
 * - 통계 쿼리 무효화 (`invalidateQueries`)
 * - `storageArticleRefreshRequested` 플래그를 `true`로 설정
 */
export const requestStorageArticleRefresh = (
  queryClient: QueryClient,
): void => {
  storageArticleRefreshRequested = true;
  queryClient.removeQueries({
    predicate: (query) => isStorageArticleQueryKey(query.queryKey),
  });
  queryClient.invalidateQueries({
    queryKey: ['articles', 'statistics', 'newsletters'],
  });
};

/**
 * 보관함 진입 시 갱신 플래그를 조회하고 `false`로 리셋
 * @returns {boolean} 갱신 요청이 있었는지 여부 (true면 첫 페이지로 스크롤/진입 처리)
 */
export const consumeStorageArticleRefreshRequest = (): boolean => {
  const requested = storageArticleRefreshRequested;
  storageArticleRefreshRequested = false;
  return requested;
};

/**
 * 일반 목록과 무한 스크롤 목록 캐시의 모든 페이지에 변환 함수 일괄 적용
 * @param queryClient TanStack QueryClient
 * @param updatePage 단일 페이지 변환 함수
 */
const updateArticlePages = (
  queryClient: QueryClient,
  updatePage: (page: GetArticlesResponse) => GetArticlesResponse,
): void => {
  // 1) 일반 페이지네이션 목록 캐시 수정
  queryClient.setQueriesData<GetArticlesResponse>(
    {
      predicate: (query) => isNormalArticleListQueryKey(query.queryKey),
    },
    (data) => (data ? updatePage(data) : data),
  );

  // 2) 무한 스크롤(InfiniteData) 목록 캐시의 모든 페이지 수정
  queryClient.setQueriesData<InfiniteData<GetArticlesResponse>>(
    {
      predicate: (query) => isInfiniteArticleQueryKey(query.queryKey),
    },
    (data) => {
      if (!data) return data;

      return {
        ...data,
        pages: data.pages.map(updatePage),
      };
    },
  );
};

/**
 * 아티클 삭제 후 페이지 메타데이터(총 개수, 총 페이지 수, 마지막 페이지 여부) 재계산
 */
const updatePageMetadata = (
  page: GetArticlesResponse,
  content: NonNullable<GetArticlesResponse['content']>,
  removedCount: number,
): GetArticlesResponse => {
  const totalElements =
    typeof page.totalElements === 'number'
      ? Math.max(0, page.totalElements - removedCount)
      : page.totalElements;
  const totalPages =
    typeof totalElements === 'number' && page.size
      ? Math.ceil(totalElements / page.size)
      : page.totalPages;

  return {
    ...page,
    content,
    numberOfElements: content.length,
    totalElements,
    totalPages,
    empty: content.length === 0,
    last:
      typeof page.number === 'number' && typeof totalPages === 'number'
        ? page.number >= totalPages - 1
        : page.last,
  };
};

/**
 * 단일 페이지에서 특정 아티클 ID들을 제외하고 메타데이터 갱신
 */
const removeArticlesFromPage = (
  page: GetArticlesResponse,
  articleIdSet: Set<number>,
): GetArticlesResponse => {
  const content = page.content ?? [];
  const nextContent = content.filter(
    (article) => !articleIdSet.has(article.articleId),
  );
  const removedCount = content.length - nextContent.length;

  if (removedCount === 0) return page;

  return updatePageMetadata(page, nextContent, removedCount);
};

/**
 * 캐시된 모든 목록(일반/무한 스크롤)에서 지정한 아티클 ID들을 직접 제거
 * @description 서버 응답 대기 없이 UI에서 글을 즉시 숨김 처리
 */
export const removeArticlesFromArticleCache = (
  queryClient: QueryClient,
  articleIds: number[],
): void => {
  const articleIdSet = new Set(articleIds);

  // 일반 목록 캐시 처리
  queryClient.setQueriesData<GetArticlesResponse>(
    {
      predicate: (query) => isNormalArticleListQueryKey(query.queryKey),
    },
    (data) => (data ? removeArticlesFromPage(data, articleIdSet) : data),
  );

  // 무한 스크롤 캐시 처리
  queryClient.setQueriesData<InfiniteData<GetArticlesResponse>>(
    {
      predicate: (query) => isInfiniteArticleQueryKey(query.queryKey),
    },
    (data) => {
      if (!data) return data;

      const contents = data.pages.map((page) => page.content ?? []);
      const nextContents = contents.map((content) =>
        content.filter((article) => !articleIdSet.has(article.articleId)),
      );
      const removedCount = contents.reduce(
        (count, content, index) =>
          count + content.length - (nextContents[index]?.length ?? 0),
        0,
      );

      if (removedCount === 0) return data;

      return {
        ...data,
        pages: data.pages.map((page, index) =>
          updatePageMetadata(page, nextContents[index] ?? [], removedCount),
        ),
      };
    },
  );
};

/**
 * 아티클 삭제 후 캐시 정합성 동기화
 *
 * 1. `removeArticlesFromArticleCache`: 캐시에서 ID 즉시 삭제 (UI 즉시 반영)
 * 2. `removeQueries`: 비활성(Inactive) 보관함 캐시 제거 (다음 진입 시 1페이지부터)
 * 3. `invalidateQueries({ refetchType: 'active' })`: 활성 무한 목록 백그라운드 재조회 (Offset 누락 복구)
 * 4. `invalidateQueries`: 통계 및 북마크 쿼리 최신화
 *
 * @returns 활성 무한 목록의 refetch Promise
 */
export const syncDeletedArticleCaches = (
  queryClient: QueryClient,
  articleIds: number[],
) => {
  removeArticlesFromArticleCache(queryClient, articleIds);

  queryClient.removeQueries({
    predicate: (query) =>
      isStorageArticleQueryKey(query.queryKey) && !query.isActive(),
  });

  const refetchActiveInfiniteStorage = queryClient.invalidateQueries({
    predicate: (query) => isInfiniteArticleQueryKey(query.queryKey),
    refetchType: 'active',
  });

  queryClient.invalidateQueries({
    queryKey: ['articles', 'statistics'],
  });
  queryClient.invalidateQueries({
    queryKey: ['bookmarks'],
  });

  return refetchActiveInfiniteStorage;
};

/**
 * 아티클 읽음 상태 캐시 수동 패치 (`isRead = true`)
 */
export const updateArticleReadStatus = (
  queryClient: QueryClient,
  articleId: number,
): void => {
  updateArticlePages(queryClient, (page) => ({
    ...page,
    content: page.content?.map((article) =>
      article.articleId === articleId ? { ...article, isRead: true } : article,
    ),
  }));
};

/**
 * 아티클 북마크 상태 캐시 수동 패치 (`isBookmarked = true / false`)
 */
export const updateArticleBookmarkStatus = (
  queryClient: QueryClient,
  articleId: number,
  isBookmarked: boolean,
): void => {
  updateArticlePages(queryClient, (page) => ({
    ...page,
    content: page.content?.map((article) =>
      article.articleId === articleId ? { ...article, isBookmarked } : article,
    ),
  }));
};
