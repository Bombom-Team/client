import { queryOptions } from '@tanstack/react-query';
import {
  getBlogPostDetail,
  getBlogPosts,
  type GetBlogPostDetailParams,
} from './blog.api';

export const blogQueries = {
  blogPosts: () =>
    queryOptions({
      queryKey: ['blog', 'posts'],
      queryFn: getBlogPosts,
    }),

  blogPostDetail: (params: GetBlogPostDetailParams) =>
    queryOptions({
      queryKey: ['blog', 'posts', params.postId],
      queryFn: () => getBlogPostDetail(params),
    }),
};
