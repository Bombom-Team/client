import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useRef } from 'react';
import { queries } from '@/apis/queries';

const POSTS_PER_PAGE = 6;

export const useInfinitePostScroll = () => {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data: infinitePosts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery(
    queries.posts.infiniteList({ size: POSTS_PER_PAGE }),
  );

  const posts = useMemo(
    () => infinitePosts.pages.flatMap((page) => page?.content ?? []),
    [infinitePosts.pages],
  );
  const featuredPost = null; // 임시로 비활성화

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return { posts, featuredPost, isFetchingNextPage, loadMoreRef };
};
