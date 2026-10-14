import { fetcher } from '@bombom/shared/apis';
import type { PageableResponse } from '@/apis/types/PageableResponse';
import type {
  InquiryRoom,
  InquiryRoomDetail,
  InquiryStatus,
} from '@/types/inquiry';

export type GetInquiryRoomsParams = {
  page?: number;
  size?: number;
  status?: InquiryStatus;
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
