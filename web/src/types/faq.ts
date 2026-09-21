export type FaqCategoryType =
  | 'INTRODUCTION'
  | 'FEATURE'
  | 'ACCOUNT'
  | 'NEWSLETTER'
  | 'ETC';

export interface Faq {
  faqId: number;
  question: string;
  answer: string;
  categoryName: string;
}

export const FAQ_CATEGORY_LABELS: Record<FaqCategoryType, string> = {
  INTRODUCTION: '서비스',
  FEATURE: '기능',
  ACCOUNT: '계정',
  NEWSLETTER: '뉴스레터',
  ETC: '기타',
};
