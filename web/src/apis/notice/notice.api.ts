import { fetcher } from '@bombom/shared/apis';
import type { components } from '@/types/openapi';

export type GetNoticesParams = components['schemas']['Pageable'];
export type GetNoticesResponse = components['schemas']['PageNoticeResponse'];
export type NoticeResponse = components['schemas']['NoticeResponse'];

export const getNotices = async (params: GetNoticesParams) => {
  return await fetcher.get<GetNoticesResponse>({
    path: '/notices',
    query: params,
  });
};

// 대표 공지 1건 조회 — 대표 미지정 시 서버가 204를 반환하므로 null로 변환 (상단바 미노출)
export const getRepresentativeNotice =
  async (): Promise<NoticeResponse | null> => {
    const response = await fetcher.get<NoticeResponse>({
      path: '/notices/representative',
    });
    return response ?? null;
  };
