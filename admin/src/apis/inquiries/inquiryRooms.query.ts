import {
  keepPreviousData,
  queryOptions,
  useMutation,
} from '@tanstack/react-query';
import {
  assignInquiryRoom,
  getInquiryRoomDetail,
  getInquiryRooms,
  updateInquiryRoomStatus,
} from './inquiryRooms.api';
import type { GetInquiryRoomsParams } from './inquiryRooms.api';

const INQUIRY_ROOMS_STALE_TIME = 1000 * 30;
const INQUIRY_ROOMS_GC_TIME = 1000 * 60 * 5;

export const inquiryRoomsQueries = {
  all: ['inquiryRooms'] as const,

  list: (params: GetInquiryRoomsParams = {}) =>
    queryOptions({
      queryKey: ['inquiryRooms', params] as const,
      queryFn: () => getInquiryRooms(params),
      placeholderData: keepPreviousData,
      staleTime: INQUIRY_ROOMS_STALE_TIME,
      gcTime: INQUIRY_ROOMS_GC_TIME,
    }),

  detail: (roomId: number) =>
    queryOptions({
      queryKey: ['inquiryRooms', 'detail', roomId] as const,
      queryFn: () => getInquiryRoomDetail(roomId),
      staleTime: INQUIRY_ROOMS_STALE_TIME,
      gcTime: INQUIRY_ROOMS_GC_TIME,
    }),
};

export const useAssignInquiryRoomMutation = () => {
  return useMutation({
    mutationFn: assignInquiryRoom,
  });
};

export const useUpdateInquiryRoomStatusMutation = () => {
  return useMutation({
    mutationFn: updateInquiryRoomStatus,
  });
};
