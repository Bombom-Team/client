import { useCallback, useEffect, useState } from 'react';
import type { RefObject } from 'react';

interface UseAutoScaleContentParams {
  layoutRef: RefObject<HTMLDivElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
}

export const useAutoScaleContent = ({
  layoutRef,
  contentRef,
}: UseAutoScaleContentParams) => {
  const [scale, setScale] = useState(1);

  const recalculateScale = useCallback(() => {
    const layout = layoutRef.current;
    const content = contentRef.current;
    if (!layout || !content) return;

    const layoutWidth = layout.clientWidth;
    const contentWidth = content.scrollWidth;
    const newScale = contentWidth > layoutWidth ? layoutWidth / contentWidth : 1;

    setScale(newScale);
    layout.style.height =
      newScale === 1 ? '' : `${content.scrollHeight * newScale}px`;
  }, [contentRef, layoutRef]);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    recalculateScale();

    const observer = new ResizeObserver(recalculateScale);
    observer.observe(content);
    window.addEventListener('resize', recalculateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', recalculateScale);
    };
  }, [contentRef, recalculateScale]);

  return { scale, recalculateScale };
};
