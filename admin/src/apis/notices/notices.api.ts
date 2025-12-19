import { fetcher } from '@bombom/shared/apis';
import type { NoticeCategoryType } from '@/types/notice';

export type CreateNoticeParams = {
  title: string;
  content: string;
  noticeCategory: NoticeCategoryType;
};

export const createNotice = async (payload: CreateNoticeParams) => {
  return fetcher.post<CreateNoticeParams, void>({
    path: '/notices',
    body: payload,
  });
};
