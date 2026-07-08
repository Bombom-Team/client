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

interface UseTimelineScrollBehaviorParams {
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  challengeId: number;
  timelineDates: string[];
  initialDate: string;
  selectedDate: string;
  onVisibleDateChange: (date: string) => void;
}

export const useTimelineScrollBehavior = ({
  scrollContainerRef,
  challengeId,
  timelineDates,
  initialDate,
  selectedDate,
  onVisibleDateChange,
}: UseTimelineScrollBehaviorParams) => {
  const [range, setRange] = useState(() => {
    const initialIndex = Math.max(timelineDates.indexOf(initialDate), 0);
    return { newestIndex: initialIndex, oldestIndex: initialIndex };
  });

  const visibleDates = useMemo(
    () => timelineDates.slice(range.newestIndex, range.oldestIndex + 1),
    [range, timelineDates],
  );

  const newerDate =
    range.newestIndex > 0 ? timelineDates[range.newestIndex - 1] : undefined;
  const canExpandNewer = Boolean(newerDate);
  const canExpandOlder = Boolean(timelineDates[range.oldestIndex + 1]);

  const expandNewer = useCallback(() => {
    setRange((prev) =>
      prev.newestIndex > 0
        ? { ...prev, newestIndex: prev.newestIndex - 1 }
        : prev,
    );
  }, []);

  const expandOlder = useCallback(() => {
    setRange((prev) =>
      prev.oldestIndex < timelineDates.length - 1
        ? { ...prev, oldestIndex: prev.oldestIndex + 1 }
        : prev,
    );
  }, [timelineDates.length]);

  const topSentinelRef = useRef<HTMLDivElement>(null);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);
  const prependScrollHeightRef = useRef<number | null>(null);
  const skipScrollSyncRef = useRef(false);
  const queryClient = useQueryClient();

  const isFetchingComments =
    useIsFetching({ queryKey: queries.comments.all(challengeId) }) > 0;

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
      skipScrollSyncRef.current = true;
    }
  });

  const syncVisibleDate = useCallback(() => {
    if (skipScrollSyncRef.current) {
      skipScrollSyncRef.current = false;
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

  const bottomDate = visibleDates.at(-1);
  const bottomQuery = useInfiniteQuery({
    ...queries.comments.infiniteList({
      challengeId,
      start: bottomDate ?? '',
      end: bottomDate ?? '',
      size: VISIBLE_COMMENTS_UNIT,
    }),
    enabled: false,
  });
  const showBottomSentinel =
    canExpandOlder &&
    Boolean(bottomDate) &&
    bottomQuery.isSuccess &&
    !bottomQuery.hasNextPage;

  const prependNewerDate = useCallback(() => {
    if (!newerDate) return;
    const container = scrollContainerRef.current;
    if (!container || !canPreservePrependScroll(container)) return;

    const doExpand = () => {
      prependScrollHeightRef.current = container.scrollHeight;
      expandNewer();
    };

    const newerQuery = queries.comments.infiniteList({
      challengeId,
      start: newerDate,
      end: newerDate,
      size: VISIBLE_COMMENTS_UNIT,
    });

    // 스켈레톤 높이로 보정되지 않도록 데이터를 먼저 받은 뒤 레이어를 추가한다.
    if (queryClient.getQueryData(newerQuery.queryKey)) {
      doExpand();
    } else {
      queryClient.prefetchInfiniteQuery(newerQuery).then(doExpand);
    }
  }, [challengeId, expandNewer, newerDate, queryClient, scrollContainerRef]);

  useIntersectionTrigger({
    targetRef: topSentinelRef,
    enabled: canExpandNewer && !isFetchingComments,
    onIntersect: prependNewerDate,
  });

  useIntersectionTrigger({
    targetRef: bottomSentinelRef,
    enabled: showBottomSentinel && !isFetchingComments,
    onIntersect: expandOlder,
  });

  return {
    visibleDates,
    topSentinelRef,
    bottomSentinelRef,
    showTopSentinel: canExpandNewer,
    showBottomSentinel,
  };
};
