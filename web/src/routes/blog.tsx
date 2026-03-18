import { createFileRoute } from '@tanstack/react-router';
import { BLOG_POSTS } from '@/mocks/datas/blogPosts';
import BlogPostList from '@/pages/blog/components/BlogPostList';

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
  return <BlogPostList posts={BLOG_POSTS} />;
}
