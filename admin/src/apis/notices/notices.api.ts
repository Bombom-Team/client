import { fetcher } from '@bombom/shared/apis';
import type { PageableResponse } from '@/apis/types/PageableResponse';
import type { Notice, NoticeCategoryType } from '@/types/notice';

export type GetNoticesParams = {
  keyword?: string;
  category?: NoticeCategoryType;
  page?: number;
  size?: number;
  sort?: string[];
};

export type GetNoticesResponse = PageableResponse<Notice>;

export type CreateNoticeParams = {
  title: string;
  content: string;
  noticeCategory: NoticeCategoryType;
};

export const getNotices = async (params: GetNoticesParams = {}) => {
  return fetcher.get<GetNoticesResponse>({
    path: '/notices',
    query: params,
  });
};

export const createNotice = async (payload: CreateNoticeParams) => {
  return fetcher.post<CreateNoticeParams, void>({
    path: '/notices',
    body: payload,
  });
};

export const deleteNotice = async (noticeId: number) => {
  return fetcher.delete({
    path: `/notices/${noticeId}`,
  });
};

export const getNoticeDetail = async (noticeId: number) => {
  return fetcher.get<Notice>({
    path: `/notices/${noticeId}`,
  });
};
