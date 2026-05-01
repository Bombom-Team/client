import { fetcher } from '@bombom/shared/apis';

export type GetAnswerParams = {
  contentId: string;
};

export type GetMyAnswerParams = {
  articleId: number;
};

export type GetAnswerResponse = {
  title: string;
  answer: string;
};

export type GetMyAnswerResponse = {
  answer: string;
};

export const getAnswer = async ({ contentId }: GetAnswerParams) => {
  return await fetcher.get<GetAnswerResponse>({
    path: `/maeil-mail/${contentId}/answer`,
  });
};

export const getMyAnswer = async ({ articleId }: GetMyAnswerParams) => {
  return await fetcher.get<GetMyAnswerResponse>({
    path: `/maeil-mail/articles/${articleId}/answers/me`,
  });
};
