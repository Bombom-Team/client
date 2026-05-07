import { ApiError, fetcher } from '@bombom/shared/apis';

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

export interface GetMaeilMailAnswerParams {
  articleId: number;
}

export interface GetMaeilMailAnswerResponse {
  answer: string;
}

export const getMaeilMailAnswer = async ({
  articleId,
}: GetMaeilMailAnswerParams): Promise<string | null> => {
  try {
    const { answer } = await fetcher.get<GetMaeilMailAnswerResponse>({
      path: `/maeil-mail/articles/${articleId}/answers/me`,
    });
    return answer;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
};

export interface PostMaeilMailAnswerParams {
  articleId: number;
  answer: string;
}

export const postMaeilMailAnswer = async ({
  articleId,
  answer,
}: PostMaeilMailAnswerParams) => {
  return await fetcher.post({
    path: `/maeil-mail/articles/${articleId}/answers/me`,
    body: { answer },
  });
};
