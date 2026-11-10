import {
  infiniteQueryOptions,
  keepPreviousData,
  queryOptions,
  useMutation,
} from '@tanstack/react-query';
import {
  assignInquiryRoom,
  getInquiryRoomDetail,
  getInquiryRooms,
  updateInquiryRoomCategory,
  updateInquiryRoomStatus,
} from './inquiryRooms.api';
import type {
  GetInquiryRoomsParams,
  GetInquiryRoomsResponse,
} from './inquiryRooms.api';
import type { InquiryStatus } from '@/types/inquiry';

const INQUIRY_ROOMS_STALE_TIME = 1000 * 30;
const INQUIRY_ROOMS_GC_TIME = 1000 * 60 * 5;
const INQUIRY_ROOMS_INFINITE_PAGE_SIZE = 20;

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

  // 서버 목록 API는 offset 기반(page)만 지원하므로, 순차적으로 다음 page를 이어붙이는
  // 방식으로 무한스크롤을 구현한다(커서 기반 API가 아니다).
  infiniteList: (params: Omit<GetInquiryRoomsParams, 'page' | 'size'> = {}) =>
    infiniteQueryOptions({
      queryKey: ['inquiryRooms', 'infinite', params] as const,
      queryFn: ({ pageParam }) =>
        getInquiryRooms({
          ...params,
          page: pageParam,
          size: INQUIRY_ROOMS_INFINITE_PAGE_SIZE,
        }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage.number + 1 < lastPage.totalPages
          ? lastPage.number + 1
          : undefined,
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

  // 상태 탭에 붙일 건수. 목록 API에 집계 전용 응답이 없어 size=1로 조회하고
  // totalElements만 쓴다.
  statusCount: (
    status: InquiryStatus,
    params: Omit<GetInquiryRoomsParams, 'page' | 'size' | 'status'> = {},
  ) =>
    queryOptions({
      queryKey: ['inquiryRooms', 'statusCount', status, params] as const,
      queryFn: () => getInquiryRooms({ ...params, status, size: 1 }),
      select: (page: GetInquiryRoomsResponse) => page.totalElements,
      // 건수는 목록과 달리 틀려도 눈에 띄지 않는다. 필터를 되돌리거나 다시 들어왔을 때
      // 캐시된 옛 숫자를 그대로 보여주지 않도록 매번 다시 확인한다.
      staleTime: 0,
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

export const useUpdateInquiryRoomCategoryMutation = () => {
  return useMutation({
    mutationFn: updateInquiryRoomCategory,
  });
};
