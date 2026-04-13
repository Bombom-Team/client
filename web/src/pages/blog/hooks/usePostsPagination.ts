import { useCallback, useState } from 'react';
import type { GetBlogPostsParams } from '@/apis/blog/blog.api';

const POSTS_PER_PAGE = 6;

export const usePostsPagination = () => {
  const [page, setPage] = useState(1);

  const queryParams: GetBlogPostsParams = {
    page: page - 1,
    size: POSTS_PER_PAGE,
  };

  const changePage = useCallback((value: number) => {
    setPage(value);
  }, []);

  return {
    page,
    queryParams,
    changePage,
  };
};
