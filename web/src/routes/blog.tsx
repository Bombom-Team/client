import styled from '@emotion/styled';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useDevice } from '@/hooks/useDevice';
import BlogFooter from '@/pages/blog/components/BlogFooter';
import BlogHeader from '@/pages/blog/components/BlogHeader';
import type { Device } from '@/hooks/useDevice';

export const Route = createFileRoute('/blog')({
  component: BlogLayout,
});

function BlogLayout() {
  const device = useDevice();

  return (
    <>
      <BlogHeader />
      <Main device={device}>
        <Outlet />
      </Main>
      <BlogFooter />
    </>
  );
}

const Main = styled.main<{ device: Device }>`
  width: 100%;
  min-height: 100dvh;
  max-width: ${({ device }) => {
    if (device === 'mobile') return '25rem';
    return device === 'tablet' ? '47.5rem' : '80rem';
  }};
  margin: 0 auto;
  padding: ${({ device }) =>
    device === 'mobile' ? '2rem 1.25rem 0 1.25rem' : '3rem 3.75rem 0 3.75rem'};

  display: flex;
  flex-direction: column;
`;
