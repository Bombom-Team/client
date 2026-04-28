import { fetcher } from '@bombom/shared/apis';

export type GetMaeilMailAnswerParams = {
  contentId: string;
};

export type GetMaeilMailAnswerResponse = {
  title: string;
  answer: string;
};

export type GetMaeilMailMyAnswerResponse = {
  answer: string;
};

export const getMaeilMailAnswer = async ({
  contentId,
}: GetMaeilMailAnswerParams) => {
  return await fetcher.get<GetMaeilMailAnswerResponse>({
    path: `/maeil-mail/${contentId}/answer`,
  });
};

export const getMaeilMailMyAnswer = async ({
  contentId,
}: GetMaeilMailAnswerParams) => {
  return await fetcher.get<GetMaeilMailMyAnswerResponse>({
    path: `/maeil-mail/${contentId}/answer/me`,
  });
};
