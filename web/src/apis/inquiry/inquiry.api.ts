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

export const INQUIRY_ROOMS_DEFAULT_SIZE = 20;

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
