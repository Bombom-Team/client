import {
  InfiniteQueryObserver,
  QueryClient,
  QueryObserver,
} from '@tanstack/react-query';
import { articlesQueries } from './articles.query';

jest.mock('@bombom/shared/env', () => ({
  ENV: {
    baseUrl: 'http://localhost',
    eventBaseUrl: 'http://localhost',
    notificationBaseUrl: 'http://localhost',
    blogBaseUrl: 'http://localhost',
  },
}));

describe('보관함 query cache 수명', () => {
  it('PC 목록은 5분으로 유지하고, 모바일 무한 목록과 모든 기기의 최신-ID 확인값은 세션 동안 보관한다', () => {
    const params = {
      page: 0,
      size: 6,
      sort: ['arrivedDateTime', 'DESC'],
    };

    expect(articlesQueries.storageArticles(params).gcTime).toBe(5 * 60 * 1000);
    expect(articlesQueries.infiniteArticles(params).gcTime).toBe(Infinity);
    expect(
      articlesQueries.infiniteArticlesWithSearch({
        ...params,
        keyword: 'frontend',
      }).gcTime,
    ).toBe(Infinity);
    expect(articlesQueries.latestArticle().gcTime).toBe(Infinity);
  });
});

describe('보관함 목록 쿼리가 비활성화된 후 캐시를 유지하는 시간', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.useFakeTimers();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
  });

  afterEach(() => {
    queryClient.clear();
    jest.useRealTimers();
  });

  it('PC 보관함 목록은 inactive가 된 지 5분 뒤 cache에서 제거한다', () => {
    const query = articlesQueries.storageArticles({
      page: 0,
      size: 6,
      sort: ['arrivedDateTime', 'DESC'],
    });
    const observer = new QueryObserver(queryClient, query);
    const cachedPage = { content: [] };

    queryClient.setQueryData(query.queryKey, cachedPage);
    const unsubscribe = observer.subscribe(() => undefined);
    unsubscribe();

    jest.advanceTimersByTime(299_999);
    expect(queryClient.getQueryData(query.queryKey)).toEqual(cachedPage);

    jest.advanceTimersByTime(1);
    expect(queryClient.getQueryData(query.queryKey)).toBeUndefined();
  });

  it('모바일 무한 목록은 inactive가 된 뒤 5분이 지나도 cache를 유지한다', () => {
    const query = articlesQueries.infiniteArticles({
      page: 0,
      size: 6,
      sort: ['arrivedDateTime', 'DESC'],
    });
    const observer = new InfiniteQueryObserver(queryClient, query);
    const cachedPages = { pages: [{ content: [] }], pageParams: [0] };

    queryClient.setQueryData(query.queryKey, cachedPages);
    const unsubscribe = observer.subscribe(() => undefined);
    unsubscribe();

    jest.advanceTimersByTime(300_000);
    expect(queryClient.getQueryData(query.queryKey)).toEqual(cachedPages);
  });
});
