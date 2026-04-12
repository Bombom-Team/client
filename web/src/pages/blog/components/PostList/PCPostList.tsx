import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import { usePostsPagination } from '../../hooks/usePostsPagination';
import FeaturedPost from '../FeaturedPost';
import PostCard from '../PostCard';
import { CardWrapper } from './PostList';
import { queries } from '@/apis/queries';
import Pagination from '@/components/Pagination/Pagination';
import { useDevice } from '@/hooks/useDevice';

const PCPostList = () => {
  const device = useDevice();
  const { page, queryParams, changePage } = usePostsPagination();

  const { data: postsData } = useSuspenseQuery(queries.posts.list(queryParams));
  const featuredPost = null; // 임시로 비활성화
  const posts = postsData.content ?? [];

  return (
    <>
      {featuredPost && <FeaturedPost post={featuredPost} />}
      <CardWrapper device={device}>
        {posts.map((post) => (
          <PostCard key={post.postId} post={post} />
        ))}
      </CardWrapper>
      <PaginationWrapper>
        <Pagination
          currentPage={page}
          totalPages={postsData?.totalPages ?? 1}
          onPageChange={changePage}
        />
      </PaginationWrapper>
    </>
  );
};

export default PCPostList;

const PaginationWrapper = styled.div`
  margin-top: 100px;

  display: flex;
  justify-content: center;
`;
