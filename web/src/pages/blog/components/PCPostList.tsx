import { useSuspenseQueries } from '@tanstack/react-query';
import FeaturedPost from './FeaturedPost';
import PostCard from './PostCard';
import { CardWrapper } from './PostList';
import { usePostsPagination } from '../hooks/usePostsPagination';
import { queries } from '@/apis/queries';
import Pagination from '@/components/Pagination/Pagination';
import { useDevice } from '@/hooks/useDevice';

const PCPostList = () => {
  const device = useDevice();
  const { page, queryParams, changePage } = usePostsPagination();

  const [{ data: featuredData }, { data: postsData }] = useSuspenseQueries({
    queries: [queries.posts.featured(), queries.posts.list(queryParams)],
  });
  const featuredPost = featuredData.content?.[0];
  const posts = postsData.content ?? [];

  return (
    <>
      {featuredPost && <FeaturedPost post={featuredPost} />}
      <CardWrapper device={device}>
        {posts.map((post) => (
          <PostCard key={post.postId} post={post} />
        ))}
      </CardWrapper>
      <Pagination
        currentPage={page}
        totalPages={postsData?.totalPages ?? 1}
        onPageChange={changePage}
      />
    </>
  );
};

export default PCPostList;
