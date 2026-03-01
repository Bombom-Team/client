import { queryOptions, useMutation } from '@tanstack/react-query';
import {
  createUnsubscribePattern,
  getUnsubscribePattern,
  getUnsubscribePatterns,
  updateUnsubscribePattern,
} from './unsubscribePatterns.api';

const UNSUBSCRIBE_PATTERNS_STALE_TIME = 1000 * 30;
const UNSUBSCRIBE_PATTERNS_GC_TIME = 1000 * 60 * 5;

export const unsubscribePatternsQueries = {
  all: ['unsubscribe-patterns'] as const,

  list: () =>
    queryOptions({
      queryKey: ['unsubscribe-patterns', 'list'] as const,
      queryFn: getUnsubscribePatterns,
      staleTime: UNSUBSCRIBE_PATTERNS_STALE_TIME,
      gcTime: UNSUBSCRIBE_PATTERNS_GC_TIME,
    }),
  detail: (id: number) =>
    queryOptions({
      queryKey: ['unsubscribe-patterns', 'detail', id] as const,
      queryFn: () => getUnsubscribePattern(id),
      staleTime: UNSUBSCRIBE_PATTERNS_STALE_TIME,
      gcTime: UNSUBSCRIBE_PATTERNS_GC_TIME,
    }),
};

export const useCreateUnsubscribePatternMutation = () => {
  return useMutation({
    mutationFn: createUnsubscribePattern,
  });
};

export const useUpdateUnsubscribePatternMutation = () => {
  return useMutation({
    mutationFn: updateUnsubscribePattern,
  });
};
