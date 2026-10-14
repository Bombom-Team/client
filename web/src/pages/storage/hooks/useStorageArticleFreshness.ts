import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { syncNewArticleStorageCaches } from '@/apis/articles/articles.cache';
import { queries } from '@/apis/queries';
import type { GetArticlesResponse } from '@/apis/articles/articles.api';

/**
 * 보관함 진입 시 최신 아티클 1건을 확인해 목록 캐시를 필요한 경우에만 동기화한다.
 *
 * 전체 목록을 요청하기 전에 최신 ID만 비교하는 경량 확인 절차다.
 *
 * @remarks
 * - 첫 성공 요청에서는 비교 기준만 저장한다.
 * - 이후 최신 ID가 달라진 경우에만 활성 보관함 목록과 통계를 동기화한다.
 * - 확인 요청이 실패하면 기존 보관함 캐시를 유지한다.
 */
export const useStorageArticleFreshness = (): void => {
  const queryClient = useQueryClient();
  const latestArticleQuery = queries.latestArticle();

  // 새 요청의 응답을 받기 전에, 이전 방문에서 저장한 최신 ID를 비교 기준으로 읽는다.
  const cachedLatestArticles = queryClient.getQueryData<GetArticlesResponse>(
    latestArticleQuery.queryKey,
  );
  // 응답이 빈 목록이어도 유효한 비교 기준이므로, 응답 존재 여부를 ID와 분리해 보관한다.
  const hasPreviousLatestResponse = useRef(cachedLatestArticles !== undefined);
  const previousLatestArticleId = useRef(
    cachedLatestArticles?.content?.[0]?.articleId ?? null,
  );
  const { data: latestArticles, isFetching } = useQuery(latestArticleQuery);
  const hasLatestArticle = latestArticles !== undefined;
  const latestArticleId = latestArticles?.content?.[0]?.articleId ?? null;

  // 응답 객체 전체가 바뀔 때마다 effect가 실행되지 않도록, 비교에 필요한 파생값만 dependency로 사용한다.
  useEffect(() => {
    // 요청 중이거나 응답이 없으면 비교하지 않는다. 응답이 없는 경우는 요청 실패일 수 있다.
    if (isFetching || !hasLatestArticle) return;

    if (
      hasPreviousLatestResponse.current &&
      previousLatestArticleId.current !== latestArticleId
    ) {
      // 목록 캐시를 삭제하지 않고, 현재 화면에서 사용 중인 query만 백그라운드 갱신한다.
      void syncNewArticleStorageCaches(queryClient);
    }

    // 이번 응답을 다음 보관함 진입 때 사용할 비교 기준으로 저장한다.
    hasPreviousLatestResponse.current = true;
    previousLatestArticleId.current = latestArticleId;
  }, [hasLatestArticle, isFetching, latestArticleId, queryClient]);
};
