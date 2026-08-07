import { act, renderHook } from '@testing-library/react';
import { useArticleFontSize } from './useArticleFontSize';

const ARTICLE_FONT_SIZE_STORAGE_KEY = 'article-font-size-percentage';

beforeEach(() => {
  window.localStorage.clear();
});

describe('useArticleFontSize', () => {
  it('선택한 단계를 저장하고 다음 훅 인스턴스에서 복원한다.', () => {
    const firstHook = renderHook(() => useArticleFontSize());

    expect(firstHook.result.current.percentage).toBe(100);

    act(() => firstHook.result.current.increaseFontSize());
    expect(firstHook.result.current.percentage).toBe(110);

    firstHook.unmount();

    const secondHook = renderHook(() => useArticleFontSize());
    expect(secondHook.result.current.percentage).toBe(110);
  });

  it('지원하지 않는 저장값은 기본 단계로 보정한다.', () => {
    window.localStorage.setItem(
      ARTICLE_FONT_SIZE_STORAGE_KEY,
      JSON.stringify(999),
    );

    const { result } = renderHook(() => useArticleFontSize());

    expect(result.current.percentage).toBe(100);
    expect(result.current.canDecrease).toBe(true);
    expect(result.current.canIncrease).toBe(true);
  });

  it('지원 범위의 최솟값과 최댓값을 넘지 않는다.', () => {
    const { result } = renderHook(() => useArticleFontSize());

    for (let index = 0; index < 10; index += 1) {
      act(() => result.current.increaseFontSize());
    }

    expect(result.current.percentage).toBe(150);
    expect(result.current.canIncrease).toBe(false);

    act(() => result.current.increaseFontSize());
    expect(result.current.percentage).toBe(150);

    for (let index = 0; index < 10; index += 1) {
      act(() => result.current.decreaseFontSize());
    }

    expect(result.current.percentage).toBe(50);
    expect(result.current.canDecrease).toBe(false);

    act(() => result.current.decreaseFontSize());
    expect(result.current.percentage).toBe(50);
  });
});
