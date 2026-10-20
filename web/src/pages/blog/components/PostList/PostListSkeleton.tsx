import { useDevice } from '@bombom/shared/ui-web';
import PostCardSkeleton from './PostCardSkeleton';
import { CardWrapper } from './PostList';

const BLOG_POST_SKELETON_COUNT = 6;

const PostListSkeleton = () => {
  const device = useDevice();

  return (
    <>
      {/* <FeaturedPostSkeleton /> */}

      <CardWrapper device={device}>
        {Array.from({ length: BLOG_POST_SKELETON_COUNT }).map((_, index) => (
          <PostCardSkeleton key={`post-card-skeleton-${index}`} />
        ))}
      </CardWrapper>
    </>
  );
};

export default PostListSkeleton;
