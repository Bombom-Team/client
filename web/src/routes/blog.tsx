import styled from '@emotion/styled';
import { createFileRoute } from '@tanstack/react-router';
import { useDevice } from '@/hooks/useDevice';
import { BLOG_POSTS } from '@/mocks/datas/blogPosts';
import BlogFooter from '@/pages/blog/components/BlogFooter';
import BlogHeader from '@/pages/blog/components/BlogHeader';
import PostList from '@/pages/blog/components/PostList';
import type { Device } from '@/hooks/useDevice';

export const Route = createFileRoute('/blog')({
  head: () => ({
    meta: [
      {
        name: 'robots',
        content: 'index, follow',
      },
      {
        title: '봄봄 | 블로그',
      },
    ],
  }),
  component: Blog,
});

function Blog() {
  const device = useDevice();

  return (
    <>
      <BlogHeader />
      <Container device={device}>
        <PostList posts={BLOG_POSTS} />
      </Container>
      <BlogFooter />
    </>
  );
}

const Container = styled.main<{ device: Device }>`
  width: 100%;
  min-height: 100dvh;
  max-width: ${({ device }) => {
    if (device === 'mobile') return '400px';
    return device === 'tablet' ? '760px' : '1280px';
  }};
  margin: 0 auto;
  padding: ${({ device }) =>
    device === 'mobile' ? '32px 20px 80px 20px' : '48px 60px 240px 60px'};

  display: flex;
  flex-direction: column;
`;
