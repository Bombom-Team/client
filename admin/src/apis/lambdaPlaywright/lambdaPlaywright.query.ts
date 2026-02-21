import { queryOptions } from '@tanstack/react-query';
import { getLambdaPlaywrightSource } from './lambdaPlaywright.api';

const LAMBDA_PLAYWRIGHT_STALE_TIME = 1000 * 30;
const LAMBDA_PLAYWRIGHT_GC_TIME = 1000 * 60 * 5;

export const lambdaPlaywrightQueries = {
  all: ['lambda-playwright'] as const,

  source: () =>
    queryOptions({
      queryKey: ['lambda-playwright', 'source'] as const,
      queryFn: getLambdaPlaywrightSource,
      staleTime: LAMBDA_PLAYWRIGHT_STALE_TIME,
      gcTime: LAMBDA_PLAYWRIGHT_GC_TIME,
    }),
};
