import { act, renderHook } from '@testing-library/react';
import { useTimelineScrollSync } from './useTimelineScrollSync';
import {
  canPreservePrependScroll,
  findVisibleDate,
  preservePrependScrollPosition,
} from '../utils/timelineScroll';

jest.mock('../utils/timelineScroll');

const mockCanPreservePrependScroll = jest.mocked(canPreservePrependScroll);
const mockPreservePrependScrollPosition = jest.mocked(
  preservePrependScrollPosition,
);
const mockFindVisibleDate = jest.mocked(findVisibleDate);

const SELECTED_DATE = '2026-07-09';

const createScrollContainer = () => {
  const container = document.createElement('div');
  Object.defineProperty(container, 'scrollHeight', {
    configurable: true,
    value: 900,
  });
  return container;
};

const renderScrollSync = (container: HTMLElement) => {
  const onVisibleDateChange = jest.fn();

  const view = renderHook(
    ({ resetKey }: { resetKey: string }) =>
      useTimelineScrollSync({
        scrollContainerRef: { current: container as HTMLDivElement },
        resetKey,
        selectedDate: SELECTED_DATE,
        onVisibleDateChange,
      }),
    { initialProps: { resetKey: SELECTED_DATE } },
  );

  return { onVisibleDateChange, ...view };
};

const scroll = (container: HTMLElement) => {
  act(() => {
    container.dispatchEvent(new Event('scroll'));
  });
};

describe('날짜 선택 시 스크롤 리셋', () => {
  it('다른 날짜를 선택(resetKey 변경)하면 해당 날짜의 코멘트가 바로 보이도록 스크롤을 최상단으로 리셋한다', () => {
    const container = createScrollContainer();
    const { rerender } = renderScrollSync(container);
    container.scrollTop = 500;

    rerender({ resetKey: '2026-07-08' });

    expect(container.scrollTop).toBe(0);
  });
});

describe('최신 날짜 prepend 시 스크롤 위치 유지', () => {
  it('컨테이너가 스크롤 가능하면 현재 높이를 기억하고 true를 반환한다', () => {
    mockCanPreservePrependScroll.mockReturnValue(true);
    const container = createScrollContainer();
    const { result } = renderScrollSync(container);

    let captured = false;
    act(() => {
      captured = result.current.captureScrollBeforePrepend();
    });

    expect(captured).toBe(true);
  });

  it('위에 최신 날짜 섹션이 추가된 뒤 렌더링되면 기억해 둔 높이로 보던 위치를 보정한다', () => {
    mockCanPreservePrependScroll.mockReturnValue(true);
    const container = createScrollContainer();
    const { result, rerender } = renderScrollSync(container);

    act(() => {
      result.current.captureScrollBeforePrepend();
    });
    rerender({ resetKey: SELECTED_DATE });

    expect(mockPreservePrependScrollPosition).toHaveBeenCalledWith(
      container,
      900,
    );
  });

  it('컨테이너가 스크롤 불가능하면 false를 반환하고 위치를 보정하지 않는다', () => {
    mockCanPreservePrependScroll.mockReturnValue(false);
    const container = createScrollContainer();
    const { result, rerender } = renderScrollSync(container);

    let captured = true;
    act(() => {
      captured = result.current.captureScrollBeforePrepend();
    });
    rerender({ resetKey: SELECTED_DATE });

    expect(captured).toBe(false);
    expect(mockPreservePrependScrollPosition).not.toHaveBeenCalled();
  });
});

describe('스크롤 시 보이는 날짜를 필터에 동기화', () => {
  it('스크롤로 다른 날짜 섹션이 보이면 해당 날짜로 필터를 바꾸도록 알린다', () => {
    mockFindVisibleDate.mockReturnValue('2026-07-08');
    const container = createScrollContainer();
    const { onVisibleDateChange } = renderScrollSync(container);

    scroll(container);

    expect(onVisibleDateChange).toHaveBeenCalledWith('2026-07-08');
  });

  it('보이는 날짜가 이미 선택된 날짜와 같으면 알리지 않는다', () => {
    mockFindVisibleDate.mockReturnValue(SELECTED_DATE);
    const container = createScrollContainer();
    const { onVisibleDateChange } = renderScrollSync(container);

    scroll(container);

    expect(onVisibleDateChange).not.toHaveBeenCalled();
  });

  it('prepend 위치 보정 직후의 스크롤은 무시해 필터가 되돌아가지 않도록 한다', () => {
    mockCanPreservePrependScroll.mockReturnValue(true);
    mockPreservePrependScrollPosition.mockReturnValue(true);
    mockFindVisibleDate.mockReturnValue('2026-07-08');
    const container = createScrollContainer();
    const { result, rerender, onVisibleDateChange } =
      renderScrollSync(container);

    act(() => {
      result.current.captureScrollBeforePrepend();
    });
    rerender({ resetKey: SELECTED_DATE });

    scroll(container);
    expect(onVisibleDateChange).not.toHaveBeenCalled();

    scroll(container);
    expect(onVisibleDateChange).toHaveBeenCalledWith('2026-07-08');
  });
});
