import styled from '@emotion/styled';
import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';
import { useDevice } from '@/hooks/useDevice';
import PostList from '@/pages/blog/components/PostList/PostList';
import PostListSkeleton from '@/pages/blog/components/PostList/PostListSkeleton';
import type { Device } from '@/hooks/useDevice';

export const Route = createFileRoute('/blog/')({
  head: () => ({
    meta: [
      { name: 'robots', content: 'index, follow' },
      { title: '봄봄 | 블로그' },
      {
        name: 'description',
        content: '봄봄 블로그 - 뉴스레터 정보를 한 눈에',
      },
      { property: 'og:title', content: '봄봄 | 블로그' },
      {
        property: 'og:description',
        content: '봄봄 블로그 - 뉴스레터 정보를 한 눈에',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://www.bombom.news/blog' },
      {
        property: 'og:image',
        content: 'https://www.bombom.news/assets/png/og-image.png',
      },
      { property: 'og:image:alt', content: '봄봄 로고' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: '봄봄 | 블로그' },
      {
        name: 'twitter:description',
        content: '봄봄 블로그 - 뉴스레터 정보를 한 눈에',
      },
      {
        name: 'twitter:image',
        content: 'https://www.bombom.news/assets/png/og-image.png',
      },
      { name: 'twitter:image:alt', content: '봄봄 로고' },
    ],
    links: [{ rel: 'canonical', href: 'https://www.bombom.news/blog' }],
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
  padding-bottom: ${({ device }) => (device === 'mobile' ? '80px' : '100px')};
`;
