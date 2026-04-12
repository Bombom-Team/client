import styled from '@emotion/styled';
import FeaturedPost from '../FeaturedPost';
import PostCard from '../PostCard';
import PostCardSkeleton from './PostCardSkeleton';
import { CardWrapper } from './PostList';
import { useInfinitePostScroll } from '@/pages/blog/hooks/useInfinitePostScroll';

const POSTS_PER_PAGE = 6;

const MobilePostList = () => {
  const { posts, featuredPost, isFetchingNextPage, loadMoreRef } =
    useInfinitePostScroll();

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
