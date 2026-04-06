import { fetcher } from '@bombom/shared/apis';
import type { components, operations } from '@/types/openapi';

export type PostListItem = components['schemas']['BlogPostResponse'];

export type GetBlogPostsParams =
  operations['getPublishedPosts']['parameters']['query']['pageable'];
export type GetBlogPostsResponse =
  components['schemas']['PageBlogPostResponse'];

export const getBlogPosts = async (params: GetBlogPostsParams) => {
  return await fetcher.get<GetBlogPostsResponse>({
    path: '/blog/posts',
    query: params,
  });
};

export type GetBlogPostDetailParams =
  operations['getPublishedPostDetail']['parameters']['path'];
export type GetBlogPostDetailResponse =
  components['schemas']['BlogPostDetailResponse'];

export const getBlogPostDetail = async ({
  postId,
}: GetBlogPostDetailParams) => {
  return await fetcher.get<GetBlogPostDetailResponse>({
    path: `/blog/posts/${postId}`,
  });
};
