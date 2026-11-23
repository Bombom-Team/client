import { fetcher } from '@bombom/shared/apis';
import type { PageableResponse } from '@/apis/types/PageableResponse';
import type {
  InquiryRoom,
  InquiryRoomDetail,
  InquiryStatus,
} from '@/types/inquiry';

// TODO(BOM-1311): 백엔드 배포 후 OpenAPI 타입으로 교체
export type GetInquiryRoomsParams = {
  page?: number;
  size?: number;
  // 비어 있으면 상태 조건 없이 전체를 조회한다. 쿼리에는 쉼표로 이어 붙여 보낸다.
  statuses?: InquiryStatus[];
  assigneeId?: number;
  categoryId?: number;
};

export type GetInquiryRoomsResponse = PageableResponse<InquiryRoom>;

export const getInquiryRooms = async (params: GetInquiryRoomsParams = {}) => {
  return fetcher.get<GetInquiryRoomsResponse>({
    path: '/inquiries/rooms',
    query: params,
  });
};

export const getInquiryRoomDetail = async (roomId: number) => {
  return fetcher.get<InquiryRoomDetail>({
    path: `/inquiries/rooms/${roomId}`,
  });
};

export const assignInquiryRoom = async ({
  roomId,
  assigneeId,
}: {
  roomId: number;
  assigneeId: number;
}) => {
  return fetcher.patch<{ assigneeId: number }, void>({
    path: `/inquiries/rooms/${roomId}/assignee`,
    body: { assigneeId },
  });
};

export const updateInquiryRoomStatus = async ({
  roomId,
  status,
}: {
  roomId: number;
  status: InquiryStatus;
}) => {
  return fetcher.patch<{ status: InquiryStatus }, void>({
    path: `/inquiries/rooms/${roomId}/status`,
    body: { status },
  });
};

export const updateInquiryRoomCategory = async ({
  roomId,
  categoryId,
}: {
  roomId: number;
  categoryId: number;
}) => {
  return fetcher.patch<{ categoryId: number }, void>({
    path: `/inquiries/rooms/${roomId}/category`,
    body: { categoryId },
  });
};
