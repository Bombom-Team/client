export type NewsletterCategoryType = string;

export interface Newsletter {
  id: number;
  name: string;
  imageUrl: string;
  categoryName: string;
  issueCycle: string;
  subscriptionCount: number;
  previousStrategy?: PreviousStrategyType;
  status?: NewsletterStatusType | NewsletterDetailStatusType;
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

export type NewsletterStatusType = 'ACTIVE' | 'SUSPENDED' | 'DISCONTINUED';

export type NewsletterDetailStatusType =
  | 'ACTIVE'
  | 'SUSPENDED_VISIBLE'
  | 'SUSPENDED_HIDDEN'
  | 'DISCONTINUED';

export const NEWSLETTER_STATUS_LABELS: Record<NewsletterStatusType, string> = {
  ACTIVE: '발행중',
  SUSPENDED: '휴재',
  DISCONTINUED: '폐간',
};

export const NEWSLETTER_DETAIL_STATUS_LABELS: Record<
  NewsletterDetailStatusType,
  string
> = {
  ACTIVE: '발행중',
  SUSPENDED_VISIBLE: '휴재(노출)',
  SUSPENDED_HIDDEN: '휴재(비노출)',
  DISCONTINUED: '폐간',
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
  status: NewsletterDetailStatusType;
  suspendedAt?: string;
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

export interface UpdateNewsletterStatusRequest {
  id: number;
  status: NewsletterStatusType;
  suspendedAt?: string;
}
