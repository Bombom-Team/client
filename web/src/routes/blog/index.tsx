import styled from '@emotion/styled';
import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';
import { useDevice } from '@/hooks/useDevice';
import PostList from '@/pages/blog/components/PostList';
import PostListSkeleton from '@/pages/blog/components/PostListSkeleton';
import type { Device } from '@/hooks/useDevice';

export const Route = createFileRoute('/blog/')({
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
    <Container device={device}>
      <Suspense fallback={<PostListSkeleton />}>
        <PostList />
      </Suspense>
    </Container>
  );
}

const Container = styled.div<{ device: Device }>`
  padding-bottom: ${({ device }) => (device === 'mobile' ? '80px' : '240px')};
`;
