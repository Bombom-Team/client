import { fetcher } from '@bombom/shared/apis';
import type { PageableResponse } from '@/apis/types/PageableResponse';
import type {
  Event,
  EventNotificationSchedule,
  EventStatus,
} from '@/types/event';

export type GetEventsParams = {
  keyword?: string;
  status?: EventStatus;
  page?: number;
  size?: number;
  sort?: string[];
};

export type GetEventsResponse = PageableResponse<Event>;

export const getEvents = async (params: GetEventsParams = {}) => {
  return fetcher.get<GetEventsResponse>({
    path: '/events',
    query: params,
  });
};

export const getEventDetail = async (eventId: number) => {
  return fetcher.get<Event>({
    path: `/events/${eventId}`,
  });
};

export const getEventSchedules = async (eventId: number) => {
  return fetcher.get<EventNotificationSchedule[]>({
    path: `/events/${eventId}/schedules`,
  });
};
