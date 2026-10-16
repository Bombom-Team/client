import { queryOptions } from '@tanstack/react-query';
import {
  getFlywayOverview,
  getMigrationScript,
  createWipIssue,
  refreshFlywayCache,
} from './flyway.api';

const OVERVIEW_STALE_TIME = 1000 * 60 * 60; // 1h (서버 캐시 TTL과 동일)
const SCRIPT_STALE_TIME = 1000 * 60 * 10; // 10m

export const flywayQueries = {
  all: ['flyway'] as const,

  overview: () =>
    queryOptions({
      queryKey: ['flyway', 'overview'] as const,
      queryFn: getFlywayOverview,
      staleTime: OVERVIEW_STALE_TIME,
    }),

  script: (fileName: string) =>
    queryOptions({
      queryKey: ['flyway', 'script', fileName] as const,
      queryFn: () => getMigrationScript(fileName),
      staleTime: SCRIPT_STALE_TIME,
      enabled: fileName.length > 0,
    }),

  mutation: {
    createWip: () => ({
      mutationFn: createWipIssue,
    }),
    refreshCache: () => ({
      mutationFn: refreshFlywayCache,
    }),
  },
};
