import { queryOptions } from '@tanstack/react-query';
import {
  getAnswer,
  getMyAnswer,
  type GetAnswerParams,
  type GetMyAnswerParams,
} from './answer.api';

export const answerQueries = {
  answer: (params: GetAnswerParams) =>
    queryOptions({
      queryKey: ['maeil-mail', params.contentId, 'answer'],
      queryFn: () => getAnswer(params),
    }),
  myAnswer: (params: GetMyAnswerParams) =>
    queryOptions({
      queryKey: ['maeil-mail', 'articles', params.articleId, 'answers', 'me'],
      queryFn: () => getMyAnswer(params),
    }),
};
