import type { PostDetail } from '@/pages/blog/types/post';

const SITE_URL = 'https://www.bombom.news';

export const createBlogPostingSchema = (
  post: PostDetail,
  postId: string,
  slug: string,
) => {
  const url = `${SITE_URL}/blog/post/${postId}/${slug}`;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.content.slice(0, 200),
    datePublished: post.publishedAt,
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    author: {
      '@type': 'Organization',
      name: '봄봄',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: '봄봄',
      url: SITE_URL,
    },
    keywords: post.hashTags.join(', '),
  };

  if (post.thumbnailImageUrl) {
    schema.image = post.thumbnailImageUrl;
  }

  return JSON.stringify(schema);
};
