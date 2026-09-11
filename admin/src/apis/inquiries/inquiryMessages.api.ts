import { fetcher, ApiError } from '@bombom/shared/apis';
import { ENV } from '@bombom/shared/env';
import type { InquiryMessage, InquiryMessagePage } from '@/types/inquiry';

export const getInquiryMessages = async ({
  roomId,
  cursor,
  size = 20,
}: {
  roomId: number;
  cursor?: number;
  size?: number;
}) => {
  return fetcher.get<InquiryMessagePage>({
    path: `/inquiries/rooms/${roomId}/messages`,
    query: { cursor, size },
  });
};

export const sendInquiryMessage = async ({
  roomId,
  content,
  imageUrls,
}: {
  roomId: number;
  content: string;
  imageUrls?: string[];
}) => {
  return fetcher.post<{ content: string; imageUrls?: string[] }, InquiryMessage>({
    path: `/inquiries/rooms/${roomId}/messages`,
    body: { content, imageUrls },
  });
};

export const updateInquiryMessage = async ({
  roomId,
  messageId,
  content,
}: {
  roomId: number;
  messageId: number;
  content: string;
}) => {
  return fetcher.patch<{ content: string }, InquiryMessage>({
    path: `/inquiries/rooms/${roomId}/messages/${messageId}`,
    body: { content },
  });
};

export const deleteInquiryMessage = async ({
  roomId,
  messageId,
}: {
  roomId: number;
  messageId: number;
}) => {
  return fetcher.delete({
    path: `/inquiries/rooms/${roomId}/messages/${messageId}`,
  });
};

// fetcher는 항상 Content-Type: application/json으로 설정하므로 FormData 업로드 시
// fetch를 직접 사용하여 브라우저가 multipart/form-data boundary를 자동 처리하게 한다.
export const uploadInquiryImages = async (
  files: File[],
): Promise<string[]> => {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));

  const url = new URL(ENV.baseUrl + '/inquiries/images');
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const contentType = response.headers.get('Content-Type');
    let errorMessage = `이미지 업로드에 실패했습니다. (${response.status})`;
    let rawBody;
    try {
      if (contentType?.includes('application/json')) {
        rawBody = await response.json();
        errorMessage = rawBody.message ?? errorMessage;
      } else {
        rawBody = await response.text();
        errorMessage = rawBody || errorMessage;
      }
    } catch {
      // 응답 파싱 실패 시 기본 메시지 사용
    }
    throw new ApiError(response.status, errorMessage, rawBody);
  }

  const result = (await response.json()) as { imageUrls: string[] };
  return result.imageUrls;
};
