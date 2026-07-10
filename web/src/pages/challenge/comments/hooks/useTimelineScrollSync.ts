import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import {
  canPreservePrependScroll,
  findVisibleDate,
  preservePrependScrollPosition,
} from '../utils/timelineScroll';
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
  const scrollHeightBeforePrependRef = useRef<number | null>(null);
  const shouldSkipNextDateSyncRef = useRef(false);

  const captureScrollBeforePrepend = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || !canPreservePrependScroll(container)) return false;

    scrollHeightBeforePrependRef.current = container.scrollHeight;
    return true;
  }, [scrollContainerRef]);

  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.scrollTop = 0;
  }, [resetKey, scrollContainerRef]);

  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    const scrollHeightBeforePrepend = scrollHeightBeforePrependRef.current;
    if (!container || scrollHeightBeforePrepend === null) return;

    const didPreserveScroll = preservePrependScrollPosition(
      container,
      scrollHeightBeforePrepend,
    );
    scrollHeightBeforePrependRef.current = null;

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
