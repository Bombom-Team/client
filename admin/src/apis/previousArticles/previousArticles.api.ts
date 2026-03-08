import { ApiError, fetcher } from '@bombom/shared/apis';

export type GetPreviousArticlesParams = { newsletterId: number };
export type GetPreviousArticleDetailParams = {
  newsletterId: number;
  articleId: number;
};
export type CreatePreviousArticleParams = {
  newsletterId: number;
  payload: CreatePreviousArticleRequest;
};
export type DeletePreviousArticleParams = {
  newsletterId: number;
  articleId: number;
};
export type UpdatePreviousArticleParams = {
  newsletterId: number;
  articleId: number;
  payload: UpdatePreviousArticleRequest;
};

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

export type PreviousArticleDetail = {
  id: number;
  title: string;
  contents: string;
  contentsSummary: string;
  expectedReadTime: number;
  arrivedDateTime: string;
  isFixed: boolean;
  newsletterId: number;
};

export type CreatePreviousArticleRequest = {
  title: string;
  contents: string;
  arrivedDateTime: string;
  isFixed: boolean;
};
export type UpdatePreviousArticleRequest =
  Partial<CreatePreviousArticleRequest>;

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

export const getPreviousArticleDetail = async (
  params: GetPreviousArticleDetailParams,
) => {
  try {
    return await fetcher.get<PreviousArticleDetail>({
      path: `/newsletters/${params.newsletterId}/articles/previous/${params.articleId}`,
    });
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.status === 404 || error.message.includes('존재하지 않는 데이터'))
    ) {
      throw new ApiError(404, '해당 지난 뉴스레터를 찾을 수 없습니다.');
    }
    throw error;
  }
};

export const createPreviousArticle = async ({
  newsletterId,
  payload,
}: CreatePreviousArticleParams) => {
  return fetcher.post<CreatePreviousArticleRequest, PreviousArticleDetail>({
    path: `/newsletters/${newsletterId}/articles/previous`,
    body: payload,
  });
};

export const deletePreviousArticle = async ({
  newsletterId,
  articleId,
}: DeletePreviousArticleParams) => {
  return fetcher.delete<never, void>({
    path: `/newsletters/${newsletterId}/articles/previous/${articleId}`,
  });
};

export const updatePreviousArticle = async ({
  newsletterId,
  articleId,
  payload,
}: UpdatePreviousArticleParams) => {
  return fetcher.patch<UpdatePreviousArticleRequest, PreviousArticleDetail>({
    path: `/newsletters/${newsletterId}/articles/previous/${articleId}`,
    body: payload,
  });
};
