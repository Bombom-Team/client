export type NoticeCategoryType = 'NOTICE' | 'UPDATE' | 'EVENT' | 'CHECK';

export interface Notice {
  id: number;
  title: string;
  content?: string;
  createdAt: string;
  noticeCategory: NoticeCategoryType;
}

export const NOTICE_CATEGORY_LABELS: Record<NoticeCategoryType, string> = {
  NOTICE: '공지',
  UPDATE: '업데이트',
  EVENT: '이벤트',
  CHECK: '점검',
};
