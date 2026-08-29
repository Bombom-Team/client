import { fetcher } from '@bombom/shared/apis';
import type { components } from '@/types/openapi';

// representative: 대표 공지만 필터 (루트 상단바용). 기존 GET /notices 확장
export type GetNoticesParams = components['schemas']['Pageable'] & {
  representative?: boolean;
};
export type GetNoticesResponse = components['schemas']['PageNoticeResponse'];
export type NoticeResponse = components['schemas']['NoticeResponse'];

export const getNotices = async (params: GetNoticesParams) => {
  return await fetcher.get<GetNoticesResponse>({
    path: '/notices',
    query: params,
  });
};

// 대표 공지 1개 조회 — 없으면 null (미지정 시 상단바 미노출)
export const getRepresentativeNotice =
  async (): Promise<NoticeResponse | null> => {
    const response = await getNotices({ representative: true, size: 1 });
    return response.content?.[0] ?? null;
  };
