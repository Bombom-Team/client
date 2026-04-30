import { queryOptions } from '@tanstack/react-query';
import {
  getMaeilMailAnswer,
  getMaeilMailContent,
  type GetMaeilMailAnswerParams,
  type GetMaeilMailContentParams,
} from './maeilMail.api';

export const maeilMailQueries = {
  contentByArticleId: (params: GetMaeilMailContentParams) =>
    queryOptions({
      queryKey: ['maeil-mail', 'content', params.articleId],
      queryFn: () => getMaeilMailContent(params),
    }),
  answerByContentId: (params: GetMaeilMailAnswerParams) =>
    queryOptions({
      queryKey: ['maeil-mail', 'answer', 'me', params.contentId],
      queryFn: () => getMaeilMailAnswer(params),
    }),
};
