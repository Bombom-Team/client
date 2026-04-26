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
