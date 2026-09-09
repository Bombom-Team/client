import { fetcher } from '@bombom/shared/apis';
import { ENV } from '@bombom/shared/env';
import type { PageableResponse } from '@/apis/types/PageableResponse';
import type {
  InquiryCategory,
  InquiryMessage,
  InquiryRoom,
} from '@/types/inquiry';
import { getOrCreateGuestId } from '@/utils/guestId';

const guestHeaders = (): HeadersInit => ({
  'X-Guest-Id': getOrCreateGuestId(),
});

export const getInquiryCategories = () =>
  fetcher.get<InquiryCategory[]>({
    path: '/inquiries/categories',
    headers: guestHeaders(),
  });

export type GetInquiryRoomsParams = { page?: number; size?: number };

export const getInquiryRooms = (params: GetInquiryRoomsParams = {}) =>
  fetcher.get<PageableResponse<InquiryRoom>>({
    path: '/inquiries/rooms',
    query: params,
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

export const uploadInquiryImages = (
  images: File[],
): Promise<InquiryImageUploadResponse> => {
  const formData = new FormData();
  images.forEach((image) => formData.append('images', image));

  return fetch(`${ENV.baseUrl}/inquiries/images`, {
    method: 'POST',
    credentials: 'include',
    headers: guestHeaders(),
    body: formData,
  }).then((res) => res.json() as Promise<InquiryImageUploadResponse>);
};
