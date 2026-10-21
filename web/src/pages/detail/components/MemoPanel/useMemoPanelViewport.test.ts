import { act, renderHook } from '@testing-library/react';
import { useMemoPanelViewport } from './useMemoPanelViewport';

const originalViewport = Object.getOwnPropertyDescriptor(
  window,
  'visualViewport',
);

afterEach(() => {
  if (originalViewport) {
    Object.defineProperty(window, 'visualViewport', originalViewport);
  } else {
    Reflect.deleteProperty(window, 'visualViewport');
  }
});

describe('useMemoPanelViewport', () => {
  it('키보드가 열리고 화면이 이동하면 보이는 영역의 높이와 위치를 갱신한다', () => {
    const viewport = Object.assign(new EventTarget(), {
      height: 800,
      offsetTop: 0,
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

  it('VisualViewport 미지원 환경에서는 CSS의 화면 높이를 사용한다', () => {
    Object.defineProperty(window, 'visualViewport', {
      configurable: true,
      value: undefined,
    });

    const { result } = renderHook(() => useMemoPanelViewport());
    expect(result.current).toEqual({});
  });
});
