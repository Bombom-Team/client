import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { useStorageArticleFreshness } from './useStorageArticleFreshness';
import { queries } from '@/apis/queries';
import type { GetArticlesResponse } from '@/apis/articles/articles.api';

const mockGetArticles = jest.fn();
const mockSyncNewArticleStorageCaches = jest.fn();

jest.mock('@bombom/shared/env', () => ({
  ENV: {
    baseUrl: 'http://localhost',
    eventBaseUrl: 'http://localhost',
    notificationBaseUrl: 'http://localhost',
    blogBaseUrl: 'http://localhost',
  },
}));

jest.mock('@/apis/articles/articles.api', () => ({
  getArticles: (...args: unknown[]) => mockGetArticles(...args),
}));

jest.mock('@/apis/articles/articles.cache', () => ({
  syncNewArticleStorageCaches: (...args: unknown[]) =>
    mockSyncNewArticleStorageCaches(...args),
}));

const createResponse = (articleId: number): GetArticlesResponse => ({
  content: [
    {
      articleId,
      title: `article-${articleId}`,
      contentsSummary: '',
      arrivedDateTime: '2026-09-06T00:00:00.000Z',
      expectedReadTime: 1,
      isRead: false,
      isBookmarked: false,
      newsletter: {
        name: 'newsletter',
        imageUrl: '',
        category: 'category',
      },
    },
  ],
});

const renderFreshnessHook = (cachedArticleId?: number) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const latestArticleQuery = queries.latestArticle();

  if (cachedArticleId !== undefined) {
    queryClient.setQueryData(
      latestArticleQuery.queryKey,
      createResponse(cachedArticleId),
    );
  }

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const { unmount } = renderHook(() => useStorageArticleFreshness(), {
    wrapper,
  });

  return { queryClient, latestArticleQuery, unmount };
};

describe('useStorageArticleFreshness', () => {
  beforeEach(() => {
    mockGetArticles.mockReset();
    mockSyncNewArticleStorageCaches.mockReset();
    mockSyncNewArticleStorageCaches.mockResolvedValue(undefined);
  });

  it('날짜와 무관한 최신 아티클 ID가 바뀌면 보관함 캐시 동기화를 요청한다', async () => {
    mockGetArticles.mockResolvedValue(createResponse(2));
    const { queryClient, unmount } = renderFreshnessHook(1);

    await waitFor(() => {
      expect(mockSyncNewArticleStorageCaches).toHaveBeenCalledWith(queryClient);
    });
    expect(mockGetArticles).toHaveBeenCalledWith({
      page: 0,
      size: 1,
      sort: ['arrivedDateTime', 'DESC'],
    });

    unmount();
  });

  it('날짜가 바뀌어도 동일한 최신 아티클 query key를 사용한다', () => {
    expect(queries.latestArticle().queryKey).toEqual(['articles', 'latest']);
  });

  it('최신 아티클 ID가 같으면 보관함 캐시를 동기화하지 않는다', async () => {
    mockGetArticles.mockResolvedValue(createResponse(1));
    const { queryClient, latestArticleQuery, unmount } = renderFreshnessHook(1);

    await waitFor(() => {
      expect(
        queryClient.getQueryState(latestArticleQuery.queryKey)?.fetchStatus,
      ).toBe('idle');
      expect(mockSyncNewArticleStorageCaches).not.toHaveBeenCalled();
    });

    unmount();
  });

  it('최초 최신 아티클 확인에서는 보관함 캐시를 동기화하지 않는다', async () => {
    mockGetArticles.mockResolvedValue(createResponse(1));
    const { queryClient, latestArticleQuery, unmount } = renderFreshnessHook();

    await waitFor(() => {
      expect(
        queryClient.getQueryState(latestArticleQuery.queryKey)?.fetchStatus,
      ).toBe('idle');
      expect(mockSyncNewArticleStorageCaches).not.toHaveBeenCalled();
    });

    unmount();
  });

  it('최신 아티클 확인 요청이 실패하면 보관함 캐시를 동기화하지 않는다', async () => {
    mockGetArticles.mockRejectedValue(new Error('network error'));
    const { queryClient, latestArticleQuery, unmount } = renderFreshnessHook(1);

    await waitFor(() => {
      expect(
        queryClient.getQueryState(latestArticleQuery.queryKey)?.fetchStatus,
      ).toBe('idle');
      expect(mockSyncNewArticleStorageCaches).not.toHaveBeenCalled();
    });

    unmount();
  });
});
