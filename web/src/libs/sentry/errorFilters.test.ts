import {
  CEFSHARP_BRIDGE_REJECTION_PATTERNS,
  isCefSharpBridgeRejection,
  isNetworkNoiseError,
} from './errorFilters';

const UPDATE_REJECTION =
  'Non-Error promise rejection captured with value: Object Not Found Matching Id:5, MethodName:update, ParamCount:4';

describe('isCefSharpBridgeRejection', () => {
  it('MethodName:update 거절 문자열을 걸러낸다.', () => {
    expect(isCefSharpBridgeRejection(UPDATE_REJECTION)).toBe(true);
    expect(
      isCefSharpBridgeRejection(`UnhandledRejection: ${UPDATE_REJECTION}`),
    ).toBe(true);
  });

  it('같은 형식의 다른 메서드명과 id도 걸러낸다.', () => {
    expect(
      isCefSharpBridgeRejection(
        'Non-Error promise rejection captured with value: Object Not Found Matching Id:2, MethodName:simulateEvent, ParamCount:1',
      ),
    ).toBe(true);
    expect(
      isCefSharpBridgeRejection(
        'Object Not Found Matching Id:12, MethodName:focus, ParamCount:0',
      ),
    ).toBe(true);
  });

  it('같은 문자열을 반복 검사해도 계속 맞는다.', () => {
    expect(CEFSHARP_BRIDGE_REJECTION_PATTERNS.length).toBeGreaterThan(0);

    for (const pattern of CEFSHARP_BRIDGE_REJECTION_PATTERNS) {
      expect(pattern.test(UPDATE_REJECTION)).toBe(true);
      expect(pattern.test(UPDATE_REJECTION)).toBe(true);
    }
  });

  it('형식이 다른 오류는 통과시킨다.', () => {
    expect(isCefSharpBridgeRejection('Object Not Found Matching Id:5')).toBe(
      false,
    );
    expect(isCefSharpBridgeRejection('MethodName:update, ParamCount:4')).toBe(
      false,
    );
    expect(
      isCefSharpBridgeRejection(
        "TypeError: Cannot read properties of undefined (reading 'update')",
      ),
    ).toBe(false);
    expect(
      isCefSharpBridgeRejection(
        'Object Not Found Matching Id:5, MethodName:update.now, ParamCount:4',
      ),
    ).toBe(false);
    expect(isCefSharpBridgeRejection(new TypeError('Failed to fetch'))).toBe(
      false,
    );
    expect(isCefSharpBridgeRejection(null)).toBe(false);
  });

  it('네트워크 노이즈 판정과는 분리된다.', () => {
    expect(isNetworkNoiseError(UPDATE_REJECTION)).toBe(false);
    expect(isCefSharpBridgeRejection('Failed to fetch')).toBe(false);
  });
});
