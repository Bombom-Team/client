import { ApiError } from '@bombom/shared/apis';
import { beforeBreadcrumb, beforeSend } from './beforeSend';
import type {
  Breadcrumb,
  BreadcrumbHint,
  ErrorEvent,
  EventHint,
} from '@sentry/react';

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

const runBeforeSend = (event: Partial<ErrorEvent>, hint: Partial<EventHint>) =>
  beforeSend(event as ErrorEvent, hint as EventHint);

const runBeforeBreadcrumb = (breadcrumb: Breadcrumb, hint: BreadcrumbHint) => {
  return beforeBreadcrumb(breadcrumb, hint);
};

describe('beforeSend', () => {
  it('NOT_FOUND 태그가 붙은 이벤트는 P2 warning으로 분류한다.', () => {
    const result = runBeforeSend({ tags: { error_type: 'NOT_FOUND' } }, {});

    expect(result?.level).toBe('warning');
    expect(result?.tags).toMatchObject({
      error_type: 'NOT_FOUND',
      priority: 'P2',
    });
  });

  it('5xx ApiError는 P1 error로 분류하고 http_status를 남긴다.', () => {
    const result = runBeforeSend(
      {},
      { originalException: new ApiError(500, 'server error') },
    );

    expect(result?.level).toBe('error');
    expect(result?.tags).toMatchObject({
      error_type: 'API_ERROR',
      priority: 'P1',
      http_status: 500,
    });
  });

  it('4xx ApiError는 P2 warning으로 분류한다.', () => {
    const result = runBeforeSend(
      {},
      { originalException: new ApiError(404, 'not found') },
    );

    expect(result?.level).toBe('warning');
    expect(result?.tags).toMatchObject({
      error_type: 'API_ERROR',
      priority: 'P2',
      http_status: 404,
    });
  });

  it('에러 바운더리 렌더 크래시는 P1 fatal로 분류한다.', () => {
    const result = runBeforeSend(
      {
        exception: {
          values: [
            { mechanism: { type: 'auto.function.react.error_boundary' } },
          ],
        },
      },
      {},
    );

    expect(result?.level).toBe('fatal');
    expect(result?.tags).toMatchObject({
      error_type: 'RENDER_CRASH',
      priority: 'P1',
    });
  });

  it('분류되지 않는 에러는 JS_RUNTIME P2 warning으로 폴백한다.', () => {
    const result = runBeforeSend({}, {});

    expect(result?.level).toBe('warning');
    expect(result?.tags).toMatchObject({
      error_type: 'JS_RUNTIME',
      priority: 'P2',
    });
  });
});

describe('beforeBreadcrumb', () => {
  it('ApiError 원본 객체가 포함된 console breadcrumb는 제거한다.', () => {
    const result = runBeforeBreadcrumb(
      { category: 'console', message: 'server secret' },
      { input: [new ApiError(500, 'server secret')] },
    );

    expect(result).toBeNull();
  });

  it('ApiError와 무관한 breadcrumb는 유지한다.', () => {
    const breadcrumb = { category: 'console', message: 'login started' };

    const result = runBeforeBreadcrumb(breadcrumb, {
      input: ['login started'],
    });

    expect(result).toBe(breadcrumb);
  });
});
