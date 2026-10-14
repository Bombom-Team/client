import { ApiError } from '@bombom/shared/apis';
import { isNotFound } from '@tanstack/react-router';
import { throwNotFoundForApiError } from './routeError';

jest.mock('@bombom/shared/apis', () => ({
  ApiError: class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
      super(message);
      this.name = 'ApiError';
      this.status = status;
    }
  },
}));

describe('throwNotFoundForApiError', () => {
  it.each([403, 404])('%i 응답은 라우터 NotFound로 변환한다.', (status) => {
    try {
      throwNotFoundForApiError(new ApiError(status, '조회 실패'), [403, 404]);
    } catch (error) {
      expect(isNotFound(error)).toBe(true);
      return;
    }

    throw new Error('NotFound 오류가 발생해야 합니다.');
  });

  it.each([400, 500])('%i 응답은 원래 오류를 유지한다.', (status) => {
    const error = new ApiError(status, '조회 실패');

    expect(() => throwNotFoundForApiError(error, [403, 404])).toThrow(error);
  });

  it('네트워크 오류는 원래 오류를 유지한다.', () => {
    const error = new TypeError('Failed to fetch');

    expect(() => throwNotFoundForApiError(error, [403, 404])).toThrow(error);
  });
});
