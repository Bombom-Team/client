import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import {
  captureTopSectionAnchor,
  findVisibleDate,
  restoreTopSectionAnchor,
} from '../utils/timelineScroll';
import type { TopSectionAnchor } from '../utils/timelineScroll';
import type { RefObject } from 'react';

interface UseTimelineScrollSyncParams {
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  resetKey: string;
  selectedDate: string;
  onVisibleDateChange: (date: string) => void;
}

export const useTimelineScrollSync = ({
  scrollContainerRef,
  resetKey,
  selectedDate,
  onVisibleDateChange,
}: UseTimelineScrollSyncParams) => {
  const prependAnchorRef = useRef<TopSectionAnchor | null>(null);
  const shouldSkipNextDateSyncRef = useRef(false);

  const captureScrollBeforePrepend = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return false;

    const anchor = captureTopSectionAnchor(container);
    if (!anchor) return false;

    prependAnchorRef.current = anchor;
    return true;
  }, [scrollContainerRef]);

  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.scrollTop = 0;
  }, [resetKey, scrollContainerRef]);

  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    const anchor = prependAnchorRef.current;
    if (!container || !anchor) return;

    const didPreserveScroll = restoreTopSectionAnchor(container, anchor);
    prependAnchorRef.current = null;

    if (didPreserveScroll) {
      shouldSkipNextDateSyncRef.current = true;
    }
  });

  const syncVisibleDate = useCallback(() => {
    if (shouldSkipNextDateSyncRef.current) {
      shouldSkipNextDateSyncRef.current = false;
      return;
    }

    const container = scrollContainerRef.current;
    if (!container) return;

    const visibleDate = findVisibleDate(container);
    if (visibleDate && visibleDate !== selectedDate) {
      onVisibleDateChange(visibleDate);
    }
  }, [onVisibleDateChange, scrollContainerRef, selectedDate]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', syncVisibleDate);
    return () => container.removeEventListener('scroll', syncVisibleDate);
  }, [scrollContainerRef, syncVisibleDate]);

  return { captureScrollBeforePrepend };
};
