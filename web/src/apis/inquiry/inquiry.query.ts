import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import {
  getInquiryCategories,
  getInquiryMessages,
  getInquiryRooms,
  type GetInquiryRoomsParams,
} from './inquiry.api';

export const INQUIRY_ROOMS_QUERY_KEY = ['inquiries', 'room-list'] as const;

export const inquiryQueries = {
  inquiryCategories: () =>
    queryOptions({
      queryKey: ['inquiries', 'categories'],
      queryFn: getInquiryCategories,
    }),
  inquiryRooms: (params?: GetInquiryRoomsParams) =>
    queryOptions({
      queryKey: [...INQUIRY_ROOMS_QUERY_KEY, params],
      queryFn: () => getInquiryRooms(params ?? {}),
    }),
  infiniteInquiryRooms: () =>
    infiniteQueryOptions({
      queryKey: [...INQUIRY_ROOMS_QUERY_KEY, 'infinite'],
      queryFn: ({ pageParam = 0 }) => getInquiryRooms({ page: pageParam }),
      getNextPageParam: (lastPage) => {
        if (!lastPage || lastPage.last) return undefined;
        return (lastPage.number ?? 0) + 1;
      },
      initialPageParam: 0,
    }),
  inquiryMessages: (roomId: number) =>
    infiniteQueryOptions({
      queryKey: ['inquiries', 'rooms', roomId, 'messages'],
      queryFn: ({ pageParam }: { pageParam?: number }) =>
        getInquiryMessages(roomId, { cursor: pageParam }),
      getNextPageParam: (lastPage) => {
        if (!lastPage.hasNext) return undefined;
        const messages = lastPage.messages ?? [];
        return messages[messages.length - 1]?.id;
      },
      initialPageParam: undefined as number | undefined,
    }),
};
