import { ApiError } from '@bombom/shared/apis';
/* eslint-disable import/named */
import { captureException, dedupeIntegration } from '@sentry/react';
/* eslint-enable import/named */
import {
  captureNativeLoginError,
  normalizeNativeLoginError,
} from './nativeLoginError';
import type { ErrorEvent } from '@sentry/react';

jest.mock('@bombom/shared/apis', () => ({
  ApiError: class ApiError extends Error {
    status: number;
    rawBody?: Record<string, string>;

    constructor(
      status: number,
      message: string,
      rawBody?: Record<string, string>,
    ) {
      super(message);
      this.name = 'ApiError';
      this.status = status;
      this.rawBody = rawBody;
    }
  },
}));

jest.mock('@sentry/react', () => ({
  ...jest.requireActual('@sentry/react'),
  captureException: jest.fn(),
}));

describe('normalizeNativeLoginError', () => {
  it.each([
    new TypeError('Failed to fetch'),
    new TypeError('Load failed'),
    new TypeError('NetworkError when attempting to fetch resource.'),
  ])('사용자 네트워크 오류는 수집 대상에서 제외한다.', (error) => {
    expect(normalizeNativeLoginError(error, 'token_exchange')).toBeNull();
  });

  it('ApiError는 상태 코드만 보존하고 원본 메시지와 body는 제거한다.', () => {
    const result = normalizeNativeLoginError(
      new ApiError(500, 'server secret', { token: 'secret' }),
      'token_exchange',
    );

    expect(result).toBeInstanceOf(ApiError);
    expect(result).toMatchObject({
      status: 500,
      message: 'Native login token exchange failed',
      rawBody: undefined,
    });
  });
});

describe('captureNativeLoginError', () => {
  it('같은 호출 경로의 400·500·401 오류를 SDK가 중복으로 제거하지 않는다.', () => {
    const dedupe = dedupeIntegration();
    const client = {} as Parameters<NonNullable<typeof dedupe.processEvent>>[2];
    const receivedStatuses: number[] = [];

    for (const status of [400, 500, 401]) {
      captureNativeLoginError({
        provider: 'google',
        error: new ApiError(status, 'private server message'),
        stage: 'token_exchange',
      });

      const [error, context] = jest.mocked(captureException).mock.calls.at(-1)!;
      const event: ErrorEvent = {
        type: undefined,
        exception: {
          values: [{ type: 'ApiError', value: (error as Error).message }],
        },
        fingerprint:
          typeof context === 'object' && 'fingerprint' in context
            ? context.fingerprint
            : undefined,
      };

      const result = dedupe.processEvent?.(event, {}, client);
      if (result) receivedStatuses.push(status);
    }

    expect(receivedStatuses).toEqual([400, 500, 401]);
  });
});
