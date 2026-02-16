import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { getEvents } from './events.api';
import type { GetEventsParams } from './events.api';

const EVENTS_STALE_TIME = 1000 * 60; // 1 minute
const EVENTS_GC_TIME = 1000 * 60 * 5; // 5 minutes

export const eventsQueries = {
  all: ['events'] as const,

  list: (params: GetEventsParams = {}) =>
    queryOptions({
      queryKey: ['events', params] as const,
      queryFn: () => getEvents(params),
      placeholderData: keepPreviousData,
      staleTime: EVENTS_STALE_TIME,
      gcTime: EVENTS_GC_TIME,
    }),
};
