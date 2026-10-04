import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import {
  getInquiryCategories,
  getInquiryMessages,
  getInquiryRooms,
  type GetInquiryRoomsParams,
} from './inquiry.api';

export const inquiryQueries = {
  inquiryCategories: () =>
    queryOptions({
      queryKey: ['inquiries', 'categories'],
      queryFn: getInquiryCategories,
    }),
  inquiryRooms: (params?: GetInquiryRoomsParams) =>
    queryOptions({
      queryKey: ['inquiries', 'rooms', params],
      queryFn: () => getInquiryRooms(params ?? {}),
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
