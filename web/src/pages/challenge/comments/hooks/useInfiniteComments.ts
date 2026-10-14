import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { useMemo, useRef } from 'react';
import { VISIBLE_COMMENTS_UNIT } from '../constants/comment';
import { queries } from '@/apis/queries';
import { useIntersectionTrigger } from '@/hooks/useIntersectionTrigger';

interface UseInfiniteCommentsParams {
  challengeId: number;
  date: string;
}

export const useInfiniteComments = ({
  challengeId,
  date,
}: UseInfiniteCommentsParams) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery(
      queries.comments.infiniteList({
        challengeId,
        start: date,
        end: date,
        size: VISIBLE_COMMENTS_UNIT,
      }),
    );

  useIntersectionTrigger({
    targetRef: loadMoreRef,
    enabled: Boolean(hasNextPage) && !isFetchingNextPage,
    onIntersect: fetchNextPage,
  });

  const comments = useMemo(
    () => data.pages.flatMap((page) => page.content ?? []),
    [data],
  );

  return {
    comments,
    isEmpty: comments.length === 0,
    hasNextPage,
    isFetchingNextPage,
    loadMoreRef,
  };
};
