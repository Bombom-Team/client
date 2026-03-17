import { createFileRoute } from '@tanstack/react-router';

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
  return;
}
