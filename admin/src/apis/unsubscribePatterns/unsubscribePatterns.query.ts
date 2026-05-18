import { queryOptions, useMutation } from '@tanstack/react-query';
import {
  createUnsubscribePattern,
  type GetUnsubscribePatternsParams,
  getUnsubscribePattern,
  getUnsubscribePatterns,
  updateUnsubscribePattern,
} from './unsubscribePatterns.api';

const UNSUBSCRIBE_PATTERNS_STALE_TIME = 1000 * 30;
const UNSUBSCRIBE_PATTERNS_GC_TIME = 1000 * 60 * 5;

export const unsubscribePatternsQueries = {
  all: ['unsubscribe-patterns'] as const,

  list: (params: GetUnsubscribePatternsParams = {}) =>
    queryOptions({
      queryKey: ['unsubscribe-patterns', 'list', params] as const,
      queryFn: () => getUnsubscribePatterns(params),
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
