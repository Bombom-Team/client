import { fetcher } from '@bombom/shared/apis';
import { getOrCreateGuestId } from '@/utils/guestId';
import type { PageableResponse } from '@/apis/types/PageableResponse';
import type {
  InquiryCategory,
  InquiryMessage,
  InquiryRoom,
} from '@/types/inquiry';

const guestHeaders = (): Record<string, string> => ({
  'X-Guest-Id': getOrCreateGuestId(),
});

export const getInquiryCategories = () =>
  fetcher.get<InquiryCategory[]>({
    path: '/inquiries/categories',
    headers: guestHeaders(),
  });

export type GetInquiryRoomsParams = { page?: number; size?: number };

// 상세 화면에서 room의 status를 조회하기 위해 목록도 조회하므로(단일 room 조회
// API가 없음), 모든 room이 한 페이지에 들어오도록 넉넉한 size를 기본값으로 쓴다.
export const INQUIRY_ROOMS_DEFAULT_SIZE = 100;

export const getInquiryRooms = (params: GetInquiryRoomsParams = {}) =>
  fetcher.get<PageableResponse<InquiryRoom>>({
    path: '/inquiries/rooms',
    query: { size: INQUIRY_ROOMS_DEFAULT_SIZE, ...params },
    headers: guestHeaders(),
  });

export const createInquiryRoom = (categoryId: number) =>
  fetcher.post<{ categoryId: number }, InquiryRoom>({
    path: '/inquiries/rooms',
    body: { categoryId },
    headers: guestHeaders(),
  });

export type GetInquiryMessagesParams = { cursor?: number; size?: number };

export type InquiryMessagePage = {
  messages: InquiryMessage[];
  hasNext: boolean;
};

export const getInquiryMessages = (
  roomId: number,
  params: GetInquiryMessagesParams = {},
) =>
  fetcher.get<InquiryMessagePage>({
    path: `/inquiries/rooms/${roomId}/messages`,
    query: params,
    headers: guestHeaders(),
  });

export type SendInquiryMessageBody = {
  content?: string;
  imageUrls?: string[];
};

export const sendInquiryMessage = (
  roomId: number,
  body: SendInquiryMessageBody,
) =>
  fetcher.post<SendInquiryMessageBody, InquiryMessage>({
    path: `/inquiries/rooms/${roomId}/messages`,
    body,
    headers: guestHeaders(),
  });

export const updateInquiryMessage = (
  roomId: number,
  messageId: number,
  content: string,
) =>
  fetcher.patch<{ content: string }, InquiryMessage>({
    path: `/inquiries/rooms/${roomId}/messages/${messageId}`,
    body: { content },
    headers: guestHeaders(),
  });

export const deleteInquiryMessage = (roomId: number, messageId: number) =>
  fetcher.delete<never, void>({
    path: `/inquiries/rooms/${roomId}/messages/${messageId}`,
    headers: guestHeaders(),
  });

export type InquiryImageUploadResponse = { imageUrls: string[] };

export const uploadInquiryImages = (images: File[]) => {
  const formData = new FormData();
  images.forEach((image) => formData.append('images', image));

  return fetcher.post<FormData, InquiryImageUploadResponse>({
    path: '/inquiries/images',
    body: formData,
    headers: guestHeaders(),
  });
};
