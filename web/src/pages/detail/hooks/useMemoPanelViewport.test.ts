import { act, renderHook } from '@testing-library/react';
import { useMemoPanelViewport } from './useMemoPanelViewport';

const ORIGINAL_VIEWPORT = Object.getOwnPropertyDescriptor(
  window,
  'visualViewport',
);

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();

  if (ORIGINAL_VIEWPORT) {
    Object.defineProperty(window, 'visualViewport', ORIGINAL_VIEWPORT);
  } else {
    Reflect.deleteProperty(window, 'visualViewport');
  }
});

describe('useMemoPanelViewport', () => {
  it('키보드가 열리고 화면이 이동하면 보이는 영역의 높이와 위치를 갱신한다', () => {
    const viewport = Object.assign(new EventTarget(), {
      height: 800,
      offsetTop: 0,
      width: 390,
      offsetLeft: 0,
    });
    Object.defineProperty(window, 'visualViewport', {
      configurable: true,
      value: viewport,
    });

    const { result, unmount } = renderHook(() => useMemoPanelViewport());
    expect(result.current['--memo-viewport-height']).toBe('800px');

    act(() => {
      viewport.height = 320;
      viewport.dispatchEvent(new Event('resize'));
      jest.advanceTimersByTime(16);
    });
    expect(result.current['--memo-viewport-height']).toBe('320px');

    act(() => {
      viewport.offsetTop = 120;
      viewport.dispatchEvent(new Event('scroll'));
      jest.advanceTimersByTime(16);
    });
    expect(result.current['--memo-viewport-top']).toBe('120px');

    const removeListener = jest.spyOn(viewport, 'removeEventListener');
    unmount();
    expect(removeListener).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(removeListener).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('화면을 확대하고 가로로 이동하면 보이는 영역의 너비와 가로 위치를 갱신한다', () => {
    const viewport = Object.assign(new EventTarget(), {
      height: 800,
      offsetTop: 0,
      width: 390,
      offsetLeft: 0,
    });
    Object.defineProperty(window, 'visualViewport', {
      configurable: true,
      value: viewport,
    });

    const { result } = renderHook(() => useMemoPanelViewport());
    expect(result.current['--memo-viewport-width']).toBe('390px');
    expect(result.current['--memo-viewport-left']).toBe('0px');

    act(() => {
      viewport.width = 195;
      viewport.dispatchEvent(new Event('resize'));
      jest.advanceTimersByTime(16);
    });
    expect(result.current['--memo-viewport-width']).toBe('195px');

    act(() => {
      viewport.offsetLeft = 96;
      viewport.dispatchEvent(new Event('scroll'));
      jest.advanceTimersByTime(16);
    });
    expect(result.current['--memo-viewport-left']).toBe('96px');

    act(() => {
      viewport.width = 390;
      viewport.offsetLeft = 0;
      viewport.dispatchEvent(new Event('resize'));
      jest.advanceTimersByTime(16);
    });
    expect(result.current['--memo-viewport-width']).toBe('390px');
    expect(result.current['--memo-viewport-left']).toBe('0px');
  });

  it('한 프레임에 여러 이벤트가 발생하면 마지막 화면 영역을 한 번만 반영한다', () => {
    const viewport = Object.assign(new EventTarget(), {
      height: 800,
      offsetTop: 0,
      width: 390,
      offsetLeft: 0,
    });
    Object.defineProperty(window, 'visualViewport', {
      configurable: true,
      value: viewport,
    });
    const requestAnimationFrame = jest.spyOn(window, 'requestAnimationFrame');
    const { result } = renderHook(() => useMemoPanelViewport());

    act(() => {
      viewport.height = 320;
      viewport.dispatchEvent(new Event('resize'));
      viewport.offsetTop = 120;
      viewport.offsetLeft = 96;
      viewport.width = 195;
      viewport.dispatchEvent(new Event('scroll'));
    });

    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
    expect(result.current['--memo-viewport-height']).toBe('800px');

    act(() => jest.advanceTimersByTime(16));

    expect(result.current).toEqual({
      '--memo-viewport-height': '320px',
      '--memo-viewport-top': '120px',
      '--memo-viewport-width': '195px',
      '--memo-viewport-left': '96px',
    });

    act(() => {
      viewport.height = 400;
      viewport.dispatchEvent(new Event('resize'));
      jest.advanceTimersByTime(16);
    });

    expect(result.current['--memo-viewport-height']).toBe('400px');
  });

  it('예약된 갱신이 있을 때 unmount하면 다음 프레임 실행을 취소한다', () => {
    const viewport = Object.assign(new EventTarget(), {
      height: 800,
      offsetTop: 0,
      width: 390,
      offsetLeft: 0,
    });
    Object.defineProperty(window, 'visualViewport', {
      configurable: true,
      value: viewport,
    });
    const requestAnimationFrame = jest.spyOn(window, 'requestAnimationFrame');
    const cancelAnimationFrame = jest.spyOn(window, 'cancelAnimationFrame');
    const { unmount } = renderHook(() => useMemoPanelViewport());

    act(() => viewport.dispatchEvent(new Event('resize')));
    unmount();

    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
    expect(cancelAnimationFrame).toHaveBeenCalledWith(
      requestAnimationFrame.mock.results[0]?.value,
    );
  });

  it('VisualViewport 미지원 환경에서는 CSS의 화면 높이를 사용한다', () => {
    Object.defineProperty(window, 'visualViewport', {
      configurable: true,
      value: undefined,
    });

    const { result } = renderHook(() => useMemoPanelViewport());
    expect(result.current).toEqual({});
  });
});
