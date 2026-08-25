import { act, renderHook } from '@testing-library/react';
import { useArticleFontSize } from './useArticleFontSize';

const ARTICLE_FONT_SIZE_STORAGE_KEY = 'article-font-size-percentage';

beforeEach(() => {
  window.localStorage.clear();
});

describe('useArticleFontSize', () => {
  it('선택한 프리셋을 저장하고 다음 훅 인스턴스에서 복원한다.', () => {
    const firstHook = renderHook(() => useArticleFontSize());

    expect(firstHook.result.current.percentage).toBe(100);

    act(() => firstHook.result.current.selectFontSize(115));
    expect(firstHook.result.current.percentage).toBe(115);

    firstHook.unmount();

    const secondHook = renderHook(() => useArticleFontSize());
    expect(secondHook.result.current.percentage).toBe(115);
  });

  it('지원하지 않는 저장값은 기본 프리셋으로 해석한다.', () => {
    window.localStorage.setItem(
      ARTICLE_FONT_SIZE_STORAGE_KEY,
      JSON.stringify(999),
    );

    const { result } = renderHook(() => useArticleFontSize());

    expect(result.current.percentage).toBe(100);
  });

  it('상태가 같으면 반환 객체와 조절 함수 참조를 유지한다.', () => {
    const { result, rerender } = renderHook(() => useArticleFontSize());
    const initialResult = result.current;

    rerender();

    expect(result.current).toBe(initialResult);

    act(() => result.current.selectFontSize(130));

    expect(result.current.selectFontSize).toBe(initialResult.selectFontSize);
  });

  it('지원하는 프리셋을 그대로 선택한다.', () => {
    const { result } = renderHook(() => useArticleFontSize());

    act(() => result.current.selectFontSize(150));
    expect(result.current.percentage).toBe(150);

    act(() => result.current.selectFontSize(90));
    expect(result.current.percentage).toBe(90);
  });
});
