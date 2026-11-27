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

// 담당자 변경 API는 요청자가 화면에서 본 담당자(currentAssigneeId)를 함께 받는다.
// 그 사이 다른 운영자가 담당자를 바꿨으면 서버가 409로 거절한다.

// TODO(BOM-1311): 백엔드 배포 후 OpenAPI 타입으로 교체
export type PatchInquiryRoomAssigneeParams = {
  assigneeId: number;
  // 미지정이면 null이다.
  currentAssigneeId: number | null;
};

export const patchInquiryRoomAssignee = async ({
  roomId,
  ...body
}: PatchInquiryRoomAssigneeParams & { roomId: number }) => {
  return fetcher.patch<PatchInquiryRoomAssigneeParams, void>({
    path: `/inquiries/rooms/${roomId}/assignee`,
    body,
  });
};

// TODO(BOM-1311): 백엔드 배포 후 OpenAPI 타입으로 교체
export type DeleteInquiryRoomAssigneeParams = {
  currentAssigneeId: number;
};

// PATCH는 assigneeId를 비울 수 없어, 미지정으로 되돌릴 때는 DELETE를 쓴다.
export const deleteInquiryRoomAssignee = async ({
  roomId,
  currentAssigneeId,
}: DeleteInquiryRoomAssigneeParams & { roomId: number }) => {
  return fetcher.delete<never, void>({
    path: `/inquiries/rooms/${roomId}/assignee`,
    query: { currentAssigneeId },
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
