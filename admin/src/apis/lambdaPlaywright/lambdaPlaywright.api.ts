import { fetcher } from '@bombom/shared/apis';

export type GetLambdaPlaywrightSourceResponse = {
  content: string;
};

export type UpdateLambdaPlaywrightSourceRequest = {
  content: string;
};

export const getLambdaPlaywrightSource = async () => {
  return fetcher.get<GetLambdaPlaywrightSourceResponse>({
    path: '/lambda-playwright/source',
  });
};

export const updateLambdaPlaywrightSource = async (
  data: UpdateLambdaPlaywrightSourceRequest,
) => {
  return fetcher.put<UpdateLambdaPlaywrightSourceRequest, void>({
    path: '/lambda-playwright/source',
    body: data,
  });
};
