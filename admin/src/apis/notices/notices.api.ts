import { fetcher, ApiError } from '@bombom/shared/apis';
import { ENV } from '@bombom/shared/env';
import type { PageableResponse } from '@/apis/types/PageableResponse';
import type {
  Notice,
  NoticeCategoryType,
  NoticeVisibility,
} from '@/types/notice';

export type GetNoticesParams = {
  keyword?: string;
  category?: NoticeCategoryType;
  page?: number;
  size?: number;
  sort?: string[];
};

export type GetNoticesResponse = PageableResponse<Notice>;

// 공지 저장 페이로드 — 생성/수정 공용
// content는 Tiptap JSON 문자열 (레거시 평문도 허용), visibility로 공개 여부 표현
export type NoticePayload = {
  title: string;
  content: string;
  noticeCategory: NoticeCategoryType;
  visibility: NoticeVisibility;
  referencedImageIds?: number[];
  isRepresentative?: boolean;
};

export type CreateNoticeResponse = { id: number };

export type UploadNoticeImageResponse = {
  imageId: number;
  imageUrl: string;
};

export const getNotices = async (params: GetNoticesParams = {}) => {
  return fetcher.get<GetNoticesResponse>({
    path: '/notices',
    query: params,
  });
};

// 생성 — 기본 비공개(PRIVATE)로 공지 생성 후 id 반환
// 이미지 업로드/저장에 쓸 id를 먼저 확보 (빈 값으로 생성 가능)
export const createNotice = async (
  payload: Partial<NoticePayload> = {},
): Promise<CreateNoticeResponse> => {
  return fetcher.post<Partial<NoticePayload>, CreateNoticeResponse>({
    path: '/notices',
    body: payload,
  });
};

export const deleteNotice = async (noticeId: number) => {
  return fetcher.delete({
    path: `/notices/${noticeId}`,
  });
};

export type UpdateNoticeParams = Partial<NoticePayload>;

export const getNoticeDetail = async (noticeId: number) => {
  return fetcher.get<Notice>({
    path: `/notices/${noticeId}`,
  });
};

// 수정 — 부분 업데이트(PATCH). content(JSON)·visibility·referencedImageIds 확장
export const updateNotice = async ({
  noticeId,
  payload,
}: {
  noticeId: number;
  payload: UpdateNoticeParams;
}) => {
  return fetcher.patch<UpdateNoticeParams, void>({
    path: `/notices/${noticeId}`,
    body: payload,
  });
};

// 대표 공지 지정/해제 — 기존 PATCH /notices/{id} 재사용
// 대표는 딱 1개. 새로 지정하면 서버가 이전 대표를 자동 해제
export const setNoticeRepresentative = async ({
  noticeId,
  isRepresentative,
}: {
  noticeId: number;
  isRepresentative: boolean;
}) => {
  return fetcher.patch<{ isRepresentative: boolean }, void>({
    path: `/notices/${noticeId}`,
    body: { isRepresentative },
  });
};

// 본문 이미지 업로드
// fetcher는 항상 application/json이라 FormData는 fetch를 직접 사용
// (브라우저가 multipart/form-data boundary를 자동 처리)
export const uploadNoticeImage = async (
  noticeId: number,
  file: File,
): Promise<UploadNoticeImageResponse> => {
  const formData = new FormData();
  formData.append('imageFile', file);

  const url = new URL(ENV.baseUrl + `/notices/${noticeId}/images`);
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

  return response.json() as Promise<UploadNoticeImageResponse>;
};
