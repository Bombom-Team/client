import { ApiError, fetcher } from '@bombom/shared/apis';

export type GetPreviousArticlesParams = { newsletterId: number };

export type PreviousArticle = {
  id: number;
  title: string;
  contents: string;
  contentsSummary: string;
  expectedReadTime: number;
  arrivedDateTime: string;
  isFixed: boolean;
  newsletterId: number;
};

export const getPreviousArticles = async (
  params: GetPreviousArticlesParams,
) => {
  try {
    return await fetcher.get<PreviousArticle[]>({
      path: `/newsletters/${params.newsletterId}/articles/previous`,
    });
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.status === 404 || error.message.includes('존재하지 않는 데이터'))
    ) {
      return [];
    }
    throw error;
  }
};
