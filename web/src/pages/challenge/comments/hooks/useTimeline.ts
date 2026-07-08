import {
  useInfiniteQuery,
  useIsFetching,
  useQueryClient,
} from '@tanstack/react-query';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { VISIBLE_COMMENTS_UNIT } from '../constants/comment';
import {
  canPreservePrependScroll,
  findVisibleDate,
  preservePrependScrollPosition,
} from '../utils/timelineScroll';
import { queries } from '@/apis/queries';
import { useIntersectionTrigger } from '@/hooks/useIntersectionTrigger';
import type { RefObject } from 'react';

const TIMELINE_EXPAND_UNIT = 1;

interface useTimelineParams {
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  challengeId: number;
  timelineDates: string[];
  initialDate: string;
  selectedDate: string;
  onVisibleDateChange: (date: string) => void;
}

export const useTimeline = ({
  scrollContainerRef,
  challengeId,
  timelineDates,
  initialDate,
  selectedDate,
  onVisibleDateChange,
}: useTimelineParams) => {
  const [visibleRange, setVisibleRange] = useState(() => {
    const initialDateIndex = Math.max(timelineDates.indexOf(initialDate), 0);
    return { newestIndex: initialDateIndex, oldestIndex: initialDateIndex };
  });

  const newerTimelineRef = useRef<HTMLDivElement>(null);
  const olderTimelineRef = useRef<HTMLDivElement>(null);
  const prependScrollHeightRef = useRef<number | null>(null);
  const ScrollSyncRef = useRef(false);
  const queryClient = useQueryClient();

  const visibleDates = useMemo(
    () =>
      timelineDates.slice(
        visibleRange.newestIndex,
        visibleRange.oldestIndex + 1,
      ),
    [visibleRange, timelineDates],
  );

  const visibleOldestDate = visibleDates.at(-1);
  const oldestDateQuery = useInfiniteQuery({
    ...queries.comments.infiniteList({
      challengeId,
      start: visibleOldestDate ?? '',
      end: visibleOldestDate ?? '',
      size: VISIBLE_COMMENTS_UNIT,
    }),
    enabled: false,
  });

  const newerDate =
    visibleRange.newestIndex > 0
      ? timelineDates[visibleRange.newestIndex - 1]
      : null;
  const canExpandNewer = Boolean(newerDate);
  const canExpandOlder = Boolean(timelineDates[visibleRange.oldestIndex + 1]);

  const canShowOlderTimeline =
    canExpandOlder &&
    Boolean(visibleOldestDate) &&
    oldestDateQuery.isSuccess &&
    !oldestDateQuery.hasNextPage;

  const expandNewer = useCallback(() => {
    setVisibleRange((prev) => {
      return prev.newestIndex > 0
        ? { ...prev, newestIndex: prev.newestIndex - TIMELINE_EXPAND_UNIT }
        : prev;
    });
  }, []);

  const expandOlder = useCallback(() => {
    setVisibleRange((prev) => {
      return prev.oldestIndex < timelineDates.length - 1
        ? { ...prev, oldestIndex: prev.oldestIndex + TIMELINE_EXPAND_UNIT }
        : prev;
    });
  }, [timelineDates.length]);

  const prependNewerDate = useCallback(() => {
    if (!newerDate) return;
    const container = scrollContainerRef.current;
    if (!container || !canPreservePrependScroll(container)) return;

    const doExpand = () => {
      prependScrollHeightRef.current = container.scrollHeight;
      expandNewer();
    };

    const newestDateQuery = queries.comments.infiniteList({
      challengeId,
      start: newerDate,
      end: newerDate,
      size: VISIBLE_COMMENTS_UNIT,
    });

    if (queryClient.getQueryData(newestDateQuery.queryKey)) {
      doExpand();
    } else {
      queryClient.prefetchInfiniteQuery(newestDateQuery).then(doExpand);
    }
  }, [challengeId, expandNewer, newerDate, queryClient, scrollContainerRef]);

  const isFetchingComments =
    useIsFetching({ queryKey: queries.comments.all(challengeId) }) > 0;

  useIntersectionTrigger({
    targetRef: newerTimelineRef,
    enabled: canExpandNewer && !isFetchingComments,
    onIntersect: prependNewerDate,
  });

  useIntersectionTrigger({
    targetRef: olderTimelineRef,
    enabled: canShowOlderTimeline && !isFetchingComments,
    onIntersect: expandOlder,
  });

  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.scrollTop = 0;
  }, [initialDate, scrollContainerRef]);

  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    const prependScrollHeight = prependScrollHeightRef.current;
    if (!container || prependScrollHeight === null) return;

    const didPreserveScroll = preservePrependScrollPosition(
      container,
      prependScrollHeight,
    );
    prependScrollHeightRef.current = null;

    if (didPreserveScroll) {
      ScrollSyncRef.current = true;
    }
  });

  const syncVisibleDate = useCallback(() => {
    if (ScrollSyncRef.current) {
      ScrollSyncRef.current = false;
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

  return {
    visibleDates,
    newerTimelineRef,
    olderTimelineRef,
    canShowNewerTimeline: canExpandNewer,
    canShowOlderTimeline,
  };
};
