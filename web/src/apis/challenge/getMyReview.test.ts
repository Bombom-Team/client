import { ApiError, fetcher } from '@bombom/shared/apis';
import { QueryClient } from '@tanstack/react-query';
import { getMyReview } from './challenge.api';
import { challengeQueries } from './challenge.query';
import type { MyReview } from './challenge.api';

jest.mock('@bombom/shared/apis', () => ({
  ApiError: class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
      super(message);
      this.name = 'ApiError';
      this.status = status;
    }
  },
  fetcher: {
    get: jest.fn(),
  },
}));

const fetcherGet = fetcher.get as jest.Mock;

const myReview: MyReview = {
  reviewId: 1,
  nickname: '나밍곰',
  comment: '좋았어요',
  isPrivate: false,
};

describe('getMyReview', () => {
  beforeEach(() => {
    fetcherGet.mockReset();
  });

  it('작성한 리뷰가 있으면 리뷰를 반환한다.', async () => {
    fetcherGet.mockResolvedValue(myReview);

    await expect(getMyReview(9)).resolves.toEqual(myReview);
    expect(fetcherGet).toHaveBeenCalledWith({
      path: '/challenges/9/reviews/me',
    });
  });

  it('리뷰가 없어 404이면 null을 반환한다.', async () => {
    fetcherGet.mockRejectedValue(new ApiError(404, 'not found'));

    await expect(getMyReview(9)).resolves.toBeNull();
  });

  it('404가 아닌 API 오류는 다시 던진다.', async () => {
    const error = new ApiError(500, 'server error');
    fetcherGet.mockRejectedValue(error);

    await expect(getMyReview(9)).rejects.toBe(error);
  });

  it('리뷰 없음은 reviews.me 쿼리를 성공 상태로 완료한다.', async () => {
    fetcherGet.mockRejectedValue(new ApiError(404, 'not found'));
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const query = challengeQueries.reviews.me(9);

    await expect(queryClient.fetchQuery(query)).resolves.toBeNull();
    expect(queryClient.getQueryState(query.queryKey)).toMatchObject({
      status: 'success',
      data: null,
    });
  });
});
