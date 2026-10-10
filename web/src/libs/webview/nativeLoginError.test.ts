import { ApiError } from '@bombom/shared/apis';
/* eslint-disable import/named */
import { captureException, dedupeIntegration } from '@sentry/react';
/* eslint-enable import/named */
import {
  captureNativeLoginError,
  getWebViewLoginFailureReason,
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

describe('getWebViewLoginFailureReason', () => {
  it.each([
    [new TypeError('Failed to fetch'), 'network_error'],
    [new ApiError(408, 'private response'), 'network_error'],
    [new ApiError(401, 'private response'), 'reauthentication_required'],
    [new ApiError(400, 'private response'), 'token_exchange_rejected'],
    [new ApiError(403, 'private response'), 'token_exchange_rejected'],
    [new ApiError(429, 'private response'), 'too_many_requests'],
    [new ApiError(500, 'private response'), 'server_unavailable'],
    [new ApiError(503, 'private response'), 'server_unavailable'],
    [new Error('private error'), 'token_exchange_failed'],
  ])(
    '토큰 교환 실패를 사용자 안내에 필요한 원인으로 구분한다.',
    (error, reason) => {
      expect(getWebViewLoginFailureReason(error, 'token_exchange')).toBe(
        reason,
      );
    },
  );

  it('인증 정보 검증 실패에는 서버 오류 원문 대신 분류 값만 반환한다.', () => {
    expect(
      getWebViewLoginFailureReason(
        new Error('private credential'),
        'credential_validation',
      ),
    ).toBe('credential_validation_failed');
  });
});

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
