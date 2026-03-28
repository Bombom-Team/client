import styled from '@emotion/styled';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import FeaturedPost from '../FeaturedPost';
import PostCard from '../PostCard';
import PostCardSkeleton from './PostCardSkeleton';
import { CardWrapper } from './PostList';
import { queries } from '@/apis/queries';

const POSTS_PER_PAGE = 6;

const MobilePostList = () => {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data: infinitePosts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery(
    queries.posts.infiniteList({ size: POSTS_PER_PAGE }),
  );

  const posts = infinitePosts.pages.flatMap((page) => page?.content ?? []);
  const featuredPost = posts[0];

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

  return (
    <>
      {featuredPost && <FeaturedPost post={featuredPost} />}
      <CardWrapper device="mobile">
        {posts.map((post) => (
          <PostCard key={post.postId} post={post} />
        ))}
        {isFetchingNextPage &&
          Array.from({ length: POSTS_PER_PAGE }).map((_, index) => (
            <PostCardSkeleton key={`post-card-skeleton-${index}`} />
          ))}
      </CardWrapper>
      <LoadMoreTrigger ref={loadMoreRef} />
    </>
  );
};

export default MobilePostList;

const LoadMoreTrigger = styled.div`
  width: 100%;
  height: 1px;
`;
