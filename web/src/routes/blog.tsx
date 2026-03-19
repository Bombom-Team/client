import { createFileRoute, Outlet } from '@tanstack/react-router';
import BlogFooter from '@/pages/blog/components/BlogFooter';
import BlogHeader from '@/pages/blog/components/BlogHeader';

export const Route = createFileRoute('/blog')({
  component: BlogLayout,
});

function BlogLayout() {
  return (
    <>
      <BlogHeader />
      <Outlet />
      <BlogFooter />
    </>
  );
}
