import { useLayoutEffect, useState } from 'react';
import type { RefObject } from 'react';

const MIN_SCROLL_OVERFLOW_PX = 1;

interface UseTimelineBottomSpacerParams {
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  sectionListRef: RefObject<HTMLDivElement | null>;
  visibleDates: string[];
}

export const useTimelineBottomSpacer = ({
  scrollContainerRef,
  sectionListRef,
  visibleDates,
}: UseTimelineBottomSpacerParams) => {
  const [spacerHeight, setSpacerHeight] = useState(0);

  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    const sectionList = sectionListRef.current;
    if (!container || !sectionList) return;

    const updateSpacerHeight = () => {
      const lastSection = sectionList.lastElementChild as HTMLElement | null;
      const lastSectionHeight = lastSection?.offsetHeight ?? 0;

      setSpacerHeight(
        Math.max(
          0,
          container.clientHeight - lastSectionHeight + MIN_SCROLL_OVERFLOW_PX,
        ),
      );
    };

    updateSpacerHeight();

    const resizeObserver = new ResizeObserver(updateSpacerHeight);
    resizeObserver.observe(container);
    resizeObserver.observe(sectionList);
    return () => resizeObserver.disconnect();
  }, [scrollContainerRef, sectionListRef, visibleDates]);

  return spacerHeight;
};
