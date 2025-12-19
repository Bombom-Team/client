import { fetcher } from '@bombom/shared/apis';

export type NoticeCategoryType = 'NOTICE' | 'EVENT';

export type CreateNoticeParams = {
  title: string;
  content: string;
  noticeCategory: NoticeCategoryType;
};

export const createNotice = async (payload: CreateNoticeParams) => {
  return fetcher.post<CreateNoticeParams, never>({
    path: '/notices',
    body: payload,
  });
};
