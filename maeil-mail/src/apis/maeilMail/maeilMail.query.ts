import { queryOptions } from '@tanstack/react-query';
import {
  getMaeilMailAnswer,
  getMaeilMailMyAnswer,
  type GetMaeilMailAnswerParams,
} from './maeilMail.api';

export const maeilMailQueries = {
  maeilMailAnswer: (params: GetMaeilMailAnswerParams) =>
    queryOptions({
      queryKey: ['maeil-mail', params.contentId, 'answer'],
      queryFn: () => getMaeilMailAnswer(params),
    }),
  maeilMailMyAnswer: (params: GetMaeilMailAnswerParams) =>
    queryOptions({
      queryKey: ['maeil-mail', params.contentId, 'answer', 'me'],
      queryFn: () => getMaeilMailMyAnswer(params),
    }),
};
