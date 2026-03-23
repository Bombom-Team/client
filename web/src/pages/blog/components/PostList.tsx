import styled from '@emotion/styled';
import FeaturedPost from './FeaturedPost';
import PostCard from './PostCard';
import { useDevice } from '@/hooks/useDevice';
import type { PostListItem } from '@/apis/blog/blog.api';
import type { Device } from '@/hooks/useDevice';

interface PostListProps {
  posts: PostListItem[];
}

const PostList = ({ posts }: PostListProps) => {
  const device = useDevice();

  if (posts.length === 0) {
    return null;
  }

  const [featuredPost, ...restPosts] = posts;

  return (
    <>
      {featuredPost && <FeaturedPost post={featuredPost} />}
      <CardWrapper device={device}>
        {restPosts.map((post) => (
          <PostCard key={post.postId} post={post} />
        ))}
      </CardWrapper>
    </>
  );
};

export default PostList;

const CardWrapper = styled.section<{ device: Device }>`
  margin-top: ${({ device }) => (device === 'mobile' ? '56px' : '80px')};

  display: grid;
  gap: ${({ device }) => (device === 'mobile' ? '40px' : '64px 40px')};

  grid-template-columns: ${({ device }) =>
    device === 'mobile' ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))'};
`;
