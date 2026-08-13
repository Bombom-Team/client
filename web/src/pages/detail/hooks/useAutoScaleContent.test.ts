import { renderHook } from '@testing-library/react';
import { useAutoScaleContent } from './useAutoScaleContent';
import type { RefObject } from 'react';

describe('useAutoScaleContent', () => {
  it('상태가 같으면 반환 객체와 재계산 함수 참조를 유지한다.', () => {
    const ref: RefObject<HTMLDivElement | null> = { current: null };
    const { result, rerender } = renderHook(() => useAutoScaleContent(ref));
    const initialResult = result.current;

    rerender();

    expect(result.current).toBe(initialResult);
    expect(result.current.recalculateScale).toBe(
      initialResult.recalculateScale,
    );
  });
});
