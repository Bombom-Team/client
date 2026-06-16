import { queryOptions } from '@tanstack/react-query';
import {
  getFlywayOverview,
  getMigrationScript,
  createWipIssue,
} from './flyway.api';

const OVERVIEW_STALE_TIME = 1000 * 30; // 30s
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
  },
};
