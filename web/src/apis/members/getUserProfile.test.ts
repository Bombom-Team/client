import { ApiError, fetcher } from '@bombom/shared/apis';
import { QueryClient } from '@tanstack/react-query';
import { getUserProfile } from './members.api';
import { membersQueries } from './members.query';

jest.mock('@bombom/shared/apis', () => ({
  ApiError: class ApiError extends Error {
    status: number;

    constructor(status: number) {
      super('API error');
      this.status = status;
    }
  },
  fetcher: { get: jest.fn() },
}));

const FETCHER_GET = fetcher.get as jest.Mock;

describe('프로필 조회 제한', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.useFakeTimers();
    FETCHER_GET.mockReset();
    queryClient = new QueryClient();
  });

  afterEach(() => {
    queryClient.clear();
    jest.useRealTimers();
  });

  it('두 요청이 모두 응답하지 않으면 6.3초 후 실패한다', async () => {
    const signals: AbortSignal[] = [];
    FETCHER_GET.mockImplementation(({ signal }: { signal: AbortSignal }) => {
      signals.push(signal);
      return new Promise((_, reject) => {
        signal.addEventListener('abort', () => reject(new Error('aborted')));
      });
    });
    const result = expect(
      queryClient.fetchQuery(membersQueries.userProfile()),
    ).rejects.toThrow('aborted');

    await jest.advanceTimersByTimeAsync(2999);
    expect(signals[0]?.aborted).toBe(false);
    await jest.advanceTimersByTimeAsync(1);
    expect(signals[0]?.aborted).toBe(true);
    await jest.advanceTimersByTimeAsync(299);
    expect(FETCHER_GET).toHaveBeenCalledTimes(1);
    await jest.advanceTimersByTimeAsync(1);
    expect(FETCHER_GET).toHaveBeenCalledTimes(2);
    expect(signals[1]).not.toBe(signals[0]);
    await jest.advanceTimersByTimeAsync(3000);
    await result;
    expect(signals[1]?.aborted).toBe(true);
    await jest.advanceTimersByTimeAsync(3000);
    expect(FETCHER_GET).toHaveBeenCalledTimes(2);
  });

  it('재시도에 성공하면 프로필을 반환한다', async () => {
    const profile = { id: 1, email: 'test@example.com', nickname: '봄봄' };
    FETCHER_GET.mockRejectedValueOnce(new Error('network error'));
    FETCHER_GET.mockResolvedValueOnce(profile);
    const result = queryClient.fetchQuery(membersQueries.userProfile());

    await jest.advanceTimersByTimeAsync(300);
    await expect(result).resolves.toEqual(profile);
    expect(FETCHER_GET).toHaveBeenCalledTimes(2);
  });

  it('401이면 재시도하지 않는다', async () => {
    FETCHER_GET.mockRejectedValue(new ApiError(401, 'unauthorized'));

    await expect(
      queryClient.fetchQuery(membersQueries.userProfile()),
    ).rejects.toBeInstanceOf(ApiError);
    expect(FETCHER_GET).toHaveBeenCalledTimes(1);
  });

  it('프로필 갱신에 실패해도 기존 프로필 캐시를 삭제하지 않는다', async () => {
    const query = membersQueries.userProfile();
    const profile = { id: 1, email: 'test@example.com', nickname: '봄봄' };
    queryClient.setQueryData(query.queryKey, profile);
    FETCHER_GET.mockRejectedValue(new Error('network error'));
    const result = expect(
      queryClient.fetchQuery({ ...query, staleTime: 0 }),
    ).rejects.toThrow('network error');

    await jest.advanceTimersByTimeAsync(300);
    await result;
    expect(queryClient.getQueryData(query.queryKey)).toEqual(profile);
  });

  it('요청이 성공하면 타임아웃 타이머를 정리한다', async () => {
    FETCHER_GET.mockResolvedValue({ nickname: '봄봄' });

    await getUserProfile();
    const signal = FETCHER_GET.mock.calls[0][0].signal as AbortSignal;
    await jest.advanceTimersByTimeAsync(3000);
    expect(signal.aborted).toBe(false);
  });
});
