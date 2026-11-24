import { act, renderHook } from '@testing-library/react';
import { useKeyboardInset } from './useKeyboardInset';

const ORIGINAL_VIEWPORT = Object.getOwnPropertyDescriptor(
  window,
  'visualViewport',
);
const ORIGINAL_INNER_HEIGHT = window.innerHeight;

const mockVisualViewport = () => {
  const viewport = Object.assign(new EventTarget(), {
    height: 800,
    offsetTop: 0,
  });
  Object.defineProperty(window, 'visualViewport', {
    configurable: true,
    value: viewport,
  });
  Object.defineProperty(window, 'innerHeight', {
    configurable: true,
    value: 800,
  });

  return viewport;
};

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
  Object.defineProperty(window, 'innerHeight', {
    configurable: true,
    value: ORIGINAL_INNER_HEIGHT,
  });

  if (ORIGINAL_VIEWPORT) {
    Object.defineProperty(window, 'visualViewport', ORIGINAL_VIEWPORT);
  } else {
    Reflect.deleteProperty(window, 'visualViewport');
  }
});

describe('useKeyboardInset', () => {
  it('키보드가 열려 보이는 영역이 줄어들면 가려진 높이를 반환한다', () => {
    const viewport = mockVisualViewport();
    const { result, unmount } = renderHook(() =>
      useKeyboardInset({ enabled: true }),
    );
    expect(result.current).toBe(0);

    act(() => {
      viewport.height = 500;
      viewport.dispatchEvent(new Event('resize'));
      jest.advanceTimersByTime(16);
    });
    expect(result.current).toBe(300);

    act(() => {
      viewport.offsetTop = 100;
      viewport.dispatchEvent(new Event('scroll'));
      jest.advanceTimersByTime(16);
    });
    expect(result.current).toBe(200);

    const removeListener = jest.spyOn(viewport, 'removeEventListener');
    unmount();
    expect(removeListener).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(removeListener).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('사용하지 않으면 보이는 영역 변화를 구독하지 않는다', () => {
    const viewport = mockVisualViewport();
    const addListener = jest.spyOn(viewport, 'addEventListener');

    const { result } = renderHook(() => useKeyboardInset({ enabled: false }));

    expect(addListener).not.toHaveBeenCalled();
    expect(result.current).toBe(0);
  });
});
