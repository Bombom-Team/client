import FeaturedPostSkeleton from './FeaturedPostSkeleton';
import PostCardSkeleton from './PostCardSkeleton';
import { CardWrapper } from './PostList';
import { useDevice } from '@/hooks/useDevice';

const BLOG_POST_SKELETON_COUNT = 6;

const PostListSkeleton = () => {
  const device = useDevice();

  return (
    <>
      <FeaturedPostSkeleton />

      <CardWrapper device={device}>
        {Array.from({ length: BLOG_POST_SKELETON_COUNT }).map((_, index) => (
          <PostCardSkeleton key={`blog-post-skeleton-${index}`} />
        ))}
      </CardWrapper>
    </>
  );
};

export default PostListSkeleton;
