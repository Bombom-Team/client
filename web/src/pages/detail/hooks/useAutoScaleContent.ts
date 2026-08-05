import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const layout = layoutRef.current;
    const content = contentRef.current;
    if (!layout || !content) return;

    const recompute = () => {
      const layoutWidth = layout.clientWidth;
      const contentWidth = content.scrollWidth;
      const newScale =
        contentWidth > layoutWidth ? layoutWidth / contentWidth : 1;

      setScale(newScale);

      layout.style.height =
        newScale === 1 ? '' : `${content.scrollHeight * newScale}px`;
    };

    recompute();

    const observer = new ResizeObserver(recompute);
    observer.observe(content);
    window.addEventListener('resize', recompute);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', recompute);
    };
  }, [layoutRef, contentRef]);

  return scale;
};
