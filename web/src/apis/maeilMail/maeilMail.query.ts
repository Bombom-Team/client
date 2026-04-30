import { queryOptions } from '@tanstack/react-query';
import {
  getMaeilMailContent,
  type GetMaeilMailContentParams,
} from './maeilMail.api';

export const maeilMailQueries = {
  contentByArticleId: (params: GetMaeilMailContentParams) =>
    queryOptions({
      queryKey: ['maeil-mail', 'content', params.articleId],
      queryFn: () => getMaeilMailContent(params),
    }),
};
