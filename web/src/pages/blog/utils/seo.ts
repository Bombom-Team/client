import type { PostDetail } from '@/pages/blog/types/post';

export const createBlogPostingSchema = (post: PostDetail) => {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Organization',
      name: '봄봄',
    },
    keywords: post.hashTags.join(', '),
  };

  if (post.thumbnailImageUrl) {
    schema.image = post.thumbnailImageUrl;
  }

  return JSON.stringify(schema);
};
