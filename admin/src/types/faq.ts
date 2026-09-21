export type FaqCategoryType =
  | 'INTRODUCTION'
  | 'FEATURE'
  | 'ACCOUNT'
  | 'NEWSLETTER'
  | 'ETC';

export interface Faq {
  id: number;
  question: string;
  answer?: string;
  createdAt: string;
  faqCategory: string;
}

export const FAQ_CATEGORY_LABELS: Record<FaqCategoryType, string> = {
  INTRODUCTION: '서비스',
  FEATURE: '기능',
  ACCOUNT: '계정',
  NEWSLETTER: '뉴스레터',
  ETC: '기타',
};

export const FAQ_CATEGORY_COLORS: Record<FaqCategoryType, string> = {
  INTRODUCTION: '#4F46E5',
  FEATURE: '#0EA5E9',
  ACCOUNT: '#10B981',
  NEWSLETTER: '#F59E0B',
  ETC: '#6B7280',
};

const FAQ_CATEGORY_BY_LABEL: Record<string, FaqCategoryType> =
  Object.fromEntries(
    Object.entries(FAQ_CATEGORY_LABELS).map(([category, label]) => [
      label,
      category as FaqCategoryType,
    ]),
  );

export const getFaqCategoryColor = (faqCategory: string): string => {
  const category =
    faqCategory in FAQ_CATEGORY_COLORS
      ? (faqCategory as FaqCategoryType)
      : FAQ_CATEGORY_BY_LABEL[faqCategory];

  return category ? FAQ_CATEGORY_COLORS[category] : FAQ_CATEGORY_COLORS.ETC;
};
