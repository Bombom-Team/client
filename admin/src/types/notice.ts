export type NoticeCategoryType = 'NOTICE' | 'UPDATE' | 'EVENT' | 'CHECK';

export interface Notice {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  noticeCategory: NoticeCategoryType;
}
