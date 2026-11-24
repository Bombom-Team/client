import { useLayoutEffect, useState } from 'react';
import type { RefObject } from 'react';

interface UseElementHeightParams {
  elementRef: RefObject<HTMLElement | null>;
  enabled: boolean;
}

/**
 * 요소의 높이를 추적한다. 이미지 미리보기나 줄바꿈으로 높이가 바뀌어도 따라간다.
 */
export const useElementHeight = ({
  elementRef,
  enabled,
}: UseElementHeightParams) => {
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!enabled || !element) return;

    const updateHeight = () => setHeight(element.offsetHeight);

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, [elementRef, enabled]);

  return height;
};
