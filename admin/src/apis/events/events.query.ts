import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import {
  createEvent,
  createEventSchedule,
  deleteEventSchedule,
  getEventDetail,
  getEvents,
  getEventSchedules,
  updateEvent,
} from './events.api';
import type {
  CreateEventPayload,
  CreateEventSchedulePayload,
  GetEventsParams,
  UpdateEventPayload,
} from './events.api';

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

  detail: (eventId: number) =>
    queryOptions({
      queryKey: ['events', 'detail', eventId] as const,
      queryFn: () => getEventDetail(eventId),
      staleTime: EVENTS_STALE_TIME,
      gcTime: EVENTS_GC_TIME,
    }),

  schedules: (eventId: number) =>
    queryOptions({
      queryKey: ['events', 'schedules', eventId] as const,
      queryFn: () => getEventSchedules(eventId),
      staleTime: EVENTS_STALE_TIME,
      gcTime: EVENTS_GC_TIME,
    }),
  mutation: {
    create: () => ({
      mutationFn: (payload: CreateEventPayload) => createEvent(payload),
    }),
    createSchedule: () => ({
      mutationFn: ({
        eventId,
        payload,
      }: {
        eventId: number;
        payload: CreateEventSchedulePayload;
      }) => createEventSchedule({ eventId, payload }),
    }),
    deleteSchedule: () => ({
      mutationFn: ({
        eventId,
        scheduleId,
      }: {
        eventId: number;
        scheduleId: number;
      }) => deleteEventSchedule({ eventId, scheduleId }),
    }),
    update: () => ({
      mutationFn: ({
        eventId,
        payload,
      }: {
        eventId: number;
        payload: UpdateEventPayload;
      }) => updateEvent({ eventId, payload }),
    }),
  },
};
