export const NETWORK_NOISE_ERROR_PATTERNS = [
  /^(?:TypeError:\s*)?Failed to fetch(?: \([^)]+\))?$/i,
  /^(?:TypeError:\s*)?Load failed(?: \([^)]+\))?$/i,
  /^(?:TypeError:\s*)?NetworkError when attempting to fetch resource\.?(?: \([^)]+\))?$/i,
];

export const isNetworkNoiseError = (error: unknown) => {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : null;

  return (
    message !== null &&
    NETWORK_NOISE_ERROR_PATTERNS.some((pattern) => pattern.test(message))
  );
};

export const isChunkLoadError = (error: unknown) =>
  error instanceof Error && error.name === 'ChunkLoadError';

// CefSharp JS-.NET 브리지가 없는 객체 id로 promise를 거절할 때의 문자열.
// SDK 기본 ignore는 MethodName:simulateEvent만 맞아서 update 같은 호출은 통과한다.
// 스택이 없는 non-Error rejection이라 allowUrls로도 걸러지지 않는다.
export const CEFSHARP_BRIDGE_REJECTION_PATTERNS = [
  /Object Not Found Matching Id:\d+, MethodName:\w+, ParamCount:\d+/,
];
