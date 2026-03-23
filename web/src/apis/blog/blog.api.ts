import { fetcher } from '@bombom/shared/apis';

export type PostListItem = {
  postId: string;
  title: string;
  thumbnailImageUrl: string | null;
  categoryName: string;
  publishedAt: string;
  readingTime: number;
  description?: string;
};

export type PostDetail = {
  title: string;
  content: string;
  thumbnailImageUrl: string | null;
  categoryName: string;
  publishedAt: string;
  readingTime: number;
  hashTags: string[];
};

export type GetBlogPostsResponse = PostListItem[];

export const getBlogPosts = async () => {
  return await fetcher.get<GetBlogPostsResponse>({
    path: '/blog/posts',
  });
};

export type GetBlogPostDetailParams = {
  postId: string;
};
export type GetBlogPostDetailResponse = PostDetail;

export const getBlogPostDetail = async ({
  postId,
}: GetBlogPostDetailParams) => {
  return await fetcher.get<GetBlogPostDetailResponse>({
    path: `/blog/posts/${postId}`,
  });
};
