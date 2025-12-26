import { queryOptions } from '@tanstack/react-query';
import {
  getHighlights,
  getHighlightStatisticsNewsletter,
  type GetHighlightsParams,
} from './highlight.api';

export const highlightQueries = {
  highlights: (params?: GetHighlightsParams) =>
    queryOptions({
      queryKey: ['highlights', params],
      queryFn: () => getHighlights(params ?? {}),
    }),

  highlightStatisticsNewsletter: () =>
    queryOptions({
      queryKey: ['highlights', 'statistics', 'newsletters'],
      queryFn: getHighlightStatisticsNewsletter,
    }),
};
