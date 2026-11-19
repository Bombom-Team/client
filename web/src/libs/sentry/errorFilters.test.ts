import {
  CEFSHARP_BRIDGE_REJECTION_PATTERNS,
  isNetworkNoiseError,
} from './errorFilters';

const UPDATE_REJECTION =
  'Non-Error promise rejection captured with value: Object Not Found Matching Id:5, MethodName:update, ParamCount:4';

// Sentry ignoreErrors는 이벤트 메시지에 패턴 중 하나라도 test()로 맞으면 이벤트를 버린다.
const isIgnored = (message: string) =>
  CEFSHARP_BRIDGE_REJECTION_PATTERNS.some((pattern) => pattern.test(message));

describe('CEFSHARP_BRIDGE_REJECTION_PATTERNS', () => {
  it('MethodName:update 거절 문자열을 걸러낸다.', () => {
    expect(isIgnored(UPDATE_REJECTION)).toBe(true);
    expect(isIgnored(`UnhandledRejection: ${UPDATE_REJECTION}`)).toBe(true);
  });

  it('같은 형식의 다른 메서드명과 id도 걸러낸다.', () => {
    expect(
      isIgnored(
        'Non-Error promise rejection captured with value: Object Not Found Matching Id:2, MethodName:simulateEvent, ParamCount:1',
      ),
    ).toBe(true);
    expect(
      isIgnored(
        'Object Not Found Matching Id:12, MethodName:focus, ParamCount:0',
      ),
    ).toBe(true);
  });

  it('같은 문자열을 반복 검사해도 계속 맞는다.', () => {
    expect(isIgnored(UPDATE_REJECTION)).toBe(true);
    expect(isIgnored(UPDATE_REJECTION)).toBe(true);
  });

  it('형식이 다른 오류는 통과시킨다.', () => {
    expect(isIgnored('Object Not Found Matching Id:5')).toBe(false);
    expect(isIgnored('MethodName:update, ParamCount:4')).toBe(false);
    expect(
      isIgnored(
        "TypeError: Cannot read properties of undefined (reading 'update')",
      ),
    ).toBe(false);
    expect(
      isIgnored(
        'Object Not Found Matching Id:5, MethodName:update.now, ParamCount:4',
      ),
    ).toBe(false);
  });

  it('네트워크 노이즈 판정과는 분리된다.', () => {
    expect(isNetworkNoiseError(UPDATE_REJECTION)).toBe(false);
    expect(isIgnored('Failed to fetch')).toBe(false);
  });
});
