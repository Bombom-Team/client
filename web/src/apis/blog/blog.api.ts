import { fetcher } from '@bombom/shared/apis';
import type { components, operations } from '@/types/openapi';

export type PostListItem = components['schemas']['BlogPostResponse'];

export type GetBlogPostsParams =
  operations['getPublishedPosts']['parameters']['query']['pageable'];
export type GetBlogPostsResponse =
  components['schemas']['PageBlogPostResponse'];

const PUBLIC_BLOG_REQUEST_CREDENTIALS = 'omit';

export const getBlogPosts = async (params: GetBlogPostsParams) => {
  return await fetcher.get<GetBlogPostsResponse>({
    path: '/blog/posts',
    query: params,
    credentials: PUBLIC_BLOG_REQUEST_CREDENTIALS,
  });
};

export type GetBlogPostDetailParams =
  operations['getPublishedPostDetail']['parameters']['path'];
export type GetBlogPostDetailResponse =
  components['schemas']['BlogPostDetailResponse'];

export type BlogCategory = components['schemas']['BlogCategoryResponse'];

export const getBlogPostDetail = async ({
  postId,
}: GetBlogPostDetailParams) => {
  return await fetcher.get<GetBlogPostDetailResponse>({
    path: `/blog/posts/${postId}`,
    credentials: PUBLIC_BLOG_REQUEST_CREDENTIALS,
  });
};

export const getBlogCategories = async () => {
  return await fetcher.get<BlogCategory[]>({
    path: '/blog/categories',
  });
};
