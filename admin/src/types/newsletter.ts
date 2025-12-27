export type NewsletterCategoryType =
  | 'TREND_LIFE'
  | 'BIZ_INVESTMENT'
  | 'LOCAL_TRAVEL'
  | 'FOOD'
  | 'IT_TECH'
  | 'CURRENT_AFFAIRS_SOCIETY'
  | 'HOBBY_SELF_DEVELOPMENT'
  | 'CULTURE_ART'
  | 'LIVING_INTERIOR'
  | 'GENERAL';

export const NEWSLETTER_CATEGORY_LABELS: Record<
  NewsletterCategoryType,
  string
> = {
  TREND_LIFE: '트렌드/라이프',
  BIZ_INVESTMENT: '비즈/재테크',
  LOCAL_TRAVEL: '지역/여행',
  FOOD: '푸드',
  IT_TECH: 'IT/테크',
  CURRENT_AFFAIRS_SOCIETY: '시사/사회',
  HOBBY_SELF_DEVELOPMENT: '취미/자기개발',
  CULTURE_ART: '문화/예술',
  LIVING_INTERIOR: '리빙/인테리어',
  GENERAL: '종합',
};

export interface Newsletter {
  id: number;
  name: string;
  imageUrl: string;
  categoryName: string;
  issueCycle: string;
  subscriptionCount: number;
  previousStrategy?: PreviousStrategyType;
}

export type NewsletterSortType = 'LATEST' | 'POPULAR';

export const NEWSLETTER_SORT_LABELS: Record<NewsletterSortType, string> = {
  LATEST: '최신순',
  POPULAR: '인기순',
};

export type PreviousStrategyType =
  | 'FIXED_WITH_RECENT'
  | 'FIXED_ONLY'
  | 'RECENT_ONLY'
  | 'INACTIVE';

export const PREVIOUS_STRATEGY_LABELS: Record<PreviousStrategyType, string> = {
  FIXED_WITH_RECENT: '고정+최신',
  FIXED_ONLY: '고정만',
  RECENT_ONLY: '최신만',
  INACTIVE: '비활성',
};

export interface NewsletterDetail {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  email: string;
  categoryName: string;
  mainPageUrl: string;
  subscribeUrl: string;
  issueCycle: string;
  subscriptionCount: number;
  sender: string;
  previousNewsletterUrl: string;
  subscribeMethod: string;
  previousStrategy: string;
  previousFixedCount: number;
  previousRecentCount: number;
  previousExposureRatio: number;
}

export interface CreateNewsletterRequest {
  name: string;
  description: string;
  imageUrl: string;
  email: string;
  category: string;
  mainPageUrl: string;
  subscribeUrl: string;
  issueCycle: string;
  sender: string;
  previousNewsletterUrl: string;
  subscribeMethod: string;
  previousStrategy: string;
  previousFixedCount: number;
  previousRecentCount: number;
  previousExposureRatio: number;
}

export interface UpdateNewsletterRequest
  extends Partial<CreateNewsletterRequest> {
  id: number;
}
