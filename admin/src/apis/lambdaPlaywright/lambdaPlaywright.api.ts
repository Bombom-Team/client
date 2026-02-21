import { fetcher } from '@bombom/shared/apis';

export type GetLambdaPlaywrightSourceResponse = {
  content: string;
};

export const getLambdaPlaywrightSource = async () => {
  return fetcher.get<GetLambdaPlaywrightSourceResponse>({
    path: '/lambda-playwright/source',
  });
};
