import { fetcher } from '@bombom/shared/apis';

export interface GetMaeilMailContentParams {
  articleId: number;
}

export interface GetMaeilMailContentResponse {
  contentId: number;
}

export const getMaeilMailContent = async ({
  articleId,
}: GetMaeilMailContentParams) => {
  return await fetcher.get<GetMaeilMailContentResponse>({
    path: '/maeil-mail/content',
    query: { articleId },
  });
};

export interface PostMaeilMailAnswerParams {
  contentId: number;
  answer: string;
}

export const postMaeilMailAnswer = async ({
  contentId,
  answer,
}: PostMaeilMailAnswerParams) => {
  return await fetcher.post({
    path: `/maeil-mail/${contentId}/answer/me`,
    body: { contentId, answer },
  });
};
