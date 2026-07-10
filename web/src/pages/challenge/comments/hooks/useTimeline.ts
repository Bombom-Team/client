import {
  useInfiniteQuery,
  useIsFetching,
  useQueryClient,
} from '@tanstack/react-query';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useTimelineScrollSync } from './useTimelineScrollSync';
import { VISIBLE_COMMENTS_UNIT } from '../constants/comment';
import { queries } from '@/apis/queries';
import { useIntersectionTrigger } from '@/hooks/useIntersectionTrigger';
import type { RefObject } from 'react';

interface UseTimelineParams {
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  challengeId: number;
  challengeDates: string[];
  initialDate: string;
  selectedDate: string;
  onVisibleDateChange: (date: string) => void;
}

export const useTimeline = ({
  scrollContainerRef,
  challengeId,
  challengeDates,
  initialDate,
  selectedDate,
  onVisibleDateChange,
}: UseTimelineParams) => {
  const timelineDates = useMemo(
    () => [...challengeDates].reverse(),
    [challengeDates],
  );
  const [renderedRange, setRenderedRange] = useState(() => {
    const initialDateIndex = Math.max(timelineDates.indexOf(initialDate), 0);
    return { startIndex: initialDateIndex, endIndex: initialDateIndex };
  });

  const newerDateTriggerRef = useRef<HTMLDivElement>(null);
  const olderDateTriggerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { captureScrollBeforePrepend } = useTimelineScrollSync({
    scrollContainerRef,
    resetKey: initialDate,
    selectedDate,
    onVisibleDateChange,
  });

  const visibleDates = useMemo(
    () =>
      timelineDates.slice(renderedRange.startIndex, renderedRange.endIndex + 1),
    [renderedRange, timelineDates],
  );

  const lastVisibleDate = visibleDates.at(-1);
  const nextNewerDate =
    renderedRange.startIndex > 0
      ? timelineDates[renderedRange.startIndex - 1]
      : null;
  const hasOlderDate = Boolean(timelineDates[renderedRange.endIndex + 1]);

  const getDateCommentsQueryOptions = (challengeId: number, date: string) =>
    queries.comments.infiniteList({
      challengeId,
      start: date,
      end: date,
      size: VISIBLE_COMMENTS_UNIT,
    });

  // CommentDateSection에서 실행하는 동일 query key의 캐시 상태만 구독한다.
  const lastVisibleDateCommentsState = useInfiniteQuery({
    ...getDateCommentsQueryOptions(challengeId, lastVisibleDate ?? ''),
    enabled: false,
  });

  const canShowOlderDateTrigger =
    hasOlderDate &&
    Boolean(lastVisibleDate) &&
    lastVisibleDateCommentsState.isSuccess &&
    !lastVisibleDateCommentsState.hasNextPage;

  const expandToNewerDate = useCallback(() => {
    setRenderedRange((prev) => {
      return prev.startIndex > 0
        ? { ...prev, startIndex: prev.startIndex - 1 }
        : prev;
    });
  }, []);

  const expandToOlderDate = useCallback(() => {
    setRenderedRange((prev) => {
      return prev.endIndex < timelineDates.length - 1
        ? { ...prev, endIndex: prev.endIndex + 1 }
        : prev;
    });
  }, [timelineDates.length]);

  const loadNewerDate = useCallback(() => {
    if (!nextNewerDate) return;

    const prependNewerDate = () => {
      if (!captureScrollBeforePrepend()) return;
      expandToNewerDate();
    };

    const nextNewerDateQuery = getDateCommentsQueryOptions(
      challengeId,
      nextNewerDate,
    );

    if (queryClient.getQueryData(nextNewerDateQuery.queryKey)) {
      prependNewerDate();
    } else {
      queryClient
        .prefetchInfiniteQuery(nextNewerDateQuery)
        .then(prependNewerDate);
    }
  }, [
    captureScrollBeforePrepend,
    challengeId,
    expandToNewerDate,
    nextNewerDate,
    queryClient,
  ]);

  const isAnyCommentQueryFetching =
    useIsFetching({ queryKey: queries.comments.all(challengeId) }) > 0;

  useIntersectionTrigger({
    targetRef: newerDateTriggerRef,
    enabled: Boolean(nextNewerDate) && !isAnyCommentQueryFetching,
    onIntersect: loadNewerDate,
  });

  useIntersectionTrigger({
    targetRef: olderDateTriggerRef,
    enabled: canShowOlderDateTrigger && !isAnyCommentQueryFetching,
    onIntersect: expandToOlderDate,
  });

  return {
    visibleDates,
    newerDateTriggerRef,
    olderDateTriggerRef,
    canShowNewerDateTrigger: Boolean(nextNewerDate),
    canShowOlderDateTrigger,
  };
};
