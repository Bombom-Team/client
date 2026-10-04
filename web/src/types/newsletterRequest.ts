// 서버 OpenAPI 스펙에 반영되기 전까지 사용하는 수동 타입입니다.
// 서버 배포 후 `pnpm --filter web gen:api`로 생성된 타입으로 교체합니다.

export type NewsletterRequestStatus =
  | 'RECEIVED'
  | 'REVIEWING'
  | 'APPROVED'
  | 'REJECTED';

export type NewsletterRequestCheckResult =
  | 'AVAILABLE'
  | 'REQUESTED'
  | 'REGISTERED';

export interface NewsletterRequest {
  id: number;
  name: string;
  url: string;
  status: NewsletterRequestStatus;
  likeCount: number;
  liked: boolean;
  mine: boolean;
  categoryName: string | null;
  imageUrl: string | null;
  newsletterId: number | null;
}

export interface NewsletterSuggestion {
  newsletterId: number;
  name: string;
  imageUrl: string | null;
}

export interface NewsletterRequestSuggestions {
  requests: NewsletterRequest[];
  newsletters: NewsletterSuggestion[];
}

export interface NewsletterRequestCheck {
  result: NewsletterRequestCheckResult;
  newsletterRequestId: number | null;
  newsletterId: number | null;
}

export type CreateNewsletterRequestBody = {
  name: string;
  url: string;
  reason?: string;
  isNotificationEnabled: boolean;
};

export interface NewsletterRequestLikeResponse {
  likeCount: number;
}

export interface CreateNewsletterRequestResponse {
  newsletterRequestId: number;
}

// likeCount는 좋아요 수만 센다. 화면의 "신청 N명"은 신청자 1명을 더해서 보여준다.
export const getRequestCount = (
  request: Pick<NewsletterRequest, 'likeCount'>,
) => request.likeCount + 1;

export const NEWSLETTER_REQUEST_STATUS_LABELS: Record<
  NewsletterRequestStatus,
  string
> = {
  RECEIVED: '접수됨',
  REVIEWING: '확인 중',
  APPROVED: '등록됨',
  REJECTED: '반려됨',
};
