import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import {
  getBlogPosts,
  getBlogPostDetail,
  type GetBlogPostDetailParams,
  type GetBlogPostsParams,
} from './blog.api';

export const blogQueries = {
  posts: {
    all: () => ['blog', 'posts'] as const,
    list: (params: GetBlogPostsParams) =>
      queryOptions({
        queryKey: [...blogQueries.posts.all(), params],
        queryFn: () => getBlogPosts(params),
      }),
    infiniteList: (params: GetBlogPostsParams) =>
      infiniteQueryOptions({
        queryKey: [...blogQueries.posts.all(), 'infinite', params],
        queryFn: ({ pageParam = 0 }) =>
          getBlogPosts({
            ...params,
            page: pageParam,
          }),
        getNextPageParam: (lastPage) => {
          if (!lastPage || lastPage.last) return;
          return (lastPage.number ?? 0) + 1;
        },
        initialPageParam: 0,
      }),
  },

  blogPostDetail: (params: GetBlogPostDetailParams) =>
    queryOptions({
      queryKey: ['blog', 'posts', params.postId],
      queryFn: () => getBlogPostDetail(params),
    }),
};
