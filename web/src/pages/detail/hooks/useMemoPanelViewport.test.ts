import { act, renderHook } from '@testing-library/react';
import { useMemoPanelViewport } from './useMemoPanelViewport';

const ORIGINAL_VIEWPORT = Object.getOwnPropertyDescriptor(
  window,
  'visualViewport',
);

afterEach(() => {
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
    });
    expect(result.current['--memo-viewport-height']).toBe('320px');

    act(() => {
      viewport.offsetTop = 120;
      viewport.dispatchEvent(new Event('scroll'));
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
    });
    expect(result.current['--memo-viewport-width']).toBe('195px');

    act(() => {
      viewport.offsetLeft = 96;
      viewport.dispatchEvent(new Event('scroll'));
    });
    expect(result.current['--memo-viewport-left']).toBe('96px');

    act(() => {
      viewport.width = 390;
      viewport.offsetLeft = 0;
      viewport.dispatchEvent(new Event('resize'));
    });
    expect(result.current['--memo-viewport-width']).toBe('390px');
    expect(result.current['--memo-viewport-left']).toBe('0px');
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
