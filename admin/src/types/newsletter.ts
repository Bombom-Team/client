export type NewsletterCategoryType =
  | 'ECONOMY'
  | 'REAL_ESTATE'
  | 'STOCK'
  | 'CRYPTO'
  | 'TREND'
  | 'FASHION_BEAUTY'
  | 'SOCIAL'
  | 'BUSINESS'
  | 'TECH'
  | 'DESIGN'
  | 'HOBBY'
  | 'LIFESTYLE'
  | 'ART'
  | 'FOOD'
  | 'TRAVEL'
  | 'OTHER';

export const NEWSLETTER_CATEGORY_LABELS: Record<
  NewsletterCategoryType,
  string
> = {
  ECONOMY: '경제',
  REAL_ESTATE: '부동산',
  STOCK: '주식',
  CRYPTO: '가상화폐',
  TREND: '트렌드',
  FASHION_BEAUTY: '패션/뷰티',
  SOCIAL: '시사/사회',
  BUSINESS: '비즈니스',
  TECH: 'IT/테크',
  DESIGN: '디자인',
  HOBBY: '취미/자기계발',
  LIFESTYLE: '라이프스타일',
  ART: '문화/예술',
  FOOD: '푸드',
  TRAVEL: '여행',
  OTHER: '기타',
};

export interface Newsletter {
  id: number;
  name: string;
  imageUrl: string;
  categoryName: string;
  issueCycle: string;
  subscriptionCount: number;
}

export type NewsletterSortType = 'LATEST' | 'POPULAR';

export const NEWSLETTER_SORT_LABELS: Record<NewsletterSortType, string> = {
  LATEST: '최신순',
  POPULAR: '인기순',
};
