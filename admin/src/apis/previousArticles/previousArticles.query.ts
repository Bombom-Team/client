import { queryOptions } from '@tanstack/react-query';
import {
  getPreviousArticles,
  type GetPreviousArticlesParams,
} from './previousArticles.api';

export const previousArticlesQueries = {
  list: (params: GetPreviousArticlesParams) =>
    queryOptions({
      queryKey: ['articles', 'previous', params] as const,
      queryFn: () => getPreviousArticles(params),
    }),
};
