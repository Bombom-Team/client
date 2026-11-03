import { renderHook } from '@testing-library/react';
import { useChunkLoadErrorReload } from './useChunkLoadErrorReload';
import { captureChunkLoadError } from '@/libs/sentry/sentryUtils';

jest.mock('@/libs/sentry/sentryUtils', () => ({
  captureChunkLoadError: jest.fn(),
}));

const LAST_AUTO_RELOAD_AT_KEY = 'chunk-load-error-reloaded-at';
const MINUTE_MS = 60 * 1000;

const createChunkLoadError = () => {
  const error = new Error('Loading chunk 7568 failed.');
  error.name = 'ChunkLoadError';
  return error;
};

const setLastAutoReloadAt = (time: number) => {
  window.sessionStorage.setItem(LAST_AUTO_RELOAD_AT_KEY, JSON.stringify(time));
};

const getLastAutoReloadAt = () =>
  window.sessionStorage.getItem(LAST_AUTO_RELOAD_AT_KEY);

beforeEach(() => {
  window.sessionStorage.clear();
  jest.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(true);
  // jsdom은 location.reload를 구현하지 않아 콘솔 에러를 남긴다.
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('useChunkLoadErrorReload', () => {
  it('ChunkLoadError가 아니면 새로고침하지 않고 기록하지 않는다.', () => {
    const { result } = renderHook(() =>
      useChunkLoadErrorReload(new Error('render error')),
    );

    expect(result.current).toBe(false);
    expect(captureChunkLoadError).not.toHaveBeenCalled();
    expect(getLastAutoReloadAt()).toBeNull();
  });

  it('ChunkLoadError가 처음 나면 새로고침하고 자동 새로고침으로 기록한다.', () => {
    const error = createChunkLoadError();

    const { result } = renderHook(() => useChunkLoadErrorReload(error));

    expect(result.current).toBe(true);
    expect(captureChunkLoadError).toHaveBeenCalledWith({
      error,
      isAutoReload: true,
    });
    expect(getLastAutoReloadAt()).not.toBeNull();
  });

  it('5분 안에 자동 새로고침한 적이 있으면 새로고침하지 않는다.', () => {
    setLastAutoReloadAt(Date.now() - MINUTE_MS);
    const error = createChunkLoadError();

    const { result } = renderHook(() => useChunkLoadErrorReload(error));

    expect(result.current).toBe(false);
    expect(captureChunkLoadError).toHaveBeenCalledWith({
      error,
      isAutoReload: false,
    });
  });

  it('마지막 자동 새로고침 후 5분이 지났으면 다시 새로고침한다.', () => {
    setLastAutoReloadAt(Date.now() - 6 * MINUTE_MS);

    const { result } = renderHook(() =>
      useChunkLoadErrorReload(createChunkLoadError()),
    );

    expect(result.current).toBe(true);
  });

  it('오프라인이면 새로고침하지 않는다.', () => {
    jest.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(false);

    const { result } = renderHook(() =>
      useChunkLoadErrorReload(createChunkLoadError()),
    );

    expect(result.current).toBe(false);
    expect(getLastAutoReloadAt()).toBeNull();
  });

  it('sessionStorage에 저장하지 못하면 새로고침하지 않는다.', () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    const error = createChunkLoadError();

    const { result } = renderHook(() => useChunkLoadErrorReload(error));

    expect(result.current).toBe(false);
    expect(captureChunkLoadError).toHaveBeenCalledTimes(1);
    expect(captureChunkLoadError).toHaveBeenCalledWith({
      error,
      isAutoReload: false,
    });
  });
});
