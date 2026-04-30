import { queryOptions } from '@tanstack/react-query';
import {
  getAnswer,
  getMyAnswer,
  type GetAnswerParams,
} from './answer.api';

export const answerQueries = {
  answer: (params: GetAnswerParams) =>
    queryOptions({
      queryKey: ['maeil-mail', params.contentId, 'answer'],
      queryFn: () => getAnswer(params),
    }),
  myAnswer: (params: GetAnswerParams) =>
    queryOptions({
      queryKey: ['maeil-mail', params.contentId, 'answer', 'me'],
      queryFn: () => getMyAnswer(params),
    }),
};
