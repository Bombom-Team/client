// 어드민 서버 OpenAPI 스펙에 반영되기 전까지 사용하는 수동 타입입니다.
// 서버 배포 후 `pnpm --filter admin generate-openapi-types`로 생성된 타입으로 교체합니다.

export type NewsletterRequestStatus =
  | 'RECEIVED'
  | 'REVIEWING'
  | 'APPROVED'
  | 'REJECTED';

export type DraftCollectStatus =
  | 'PENDING'
  | 'COLLECTING'
  | 'SUCCESS'
  | 'FAILED';

export interface NewsletterRequestSummary {
  id: number;
  requestedName: string;
  requestedUrl: string;
  status: NewsletterRequestStatus;
  likeCount: number;
  collectStatus: DraftCollectStatus | null;
  draftName: string | null;
  imageUrl: string | null;
  createdAt: string;
}

export interface NewsletterRequestDraft {
  collectStatus: DraftCollectStatus;
  collectAttemptCount: number;
  collectStartedAt: string | null;
  failureReason: string | null;
  name: string | null;
  description: string | null;
  imageUrl: string | null;
  email: string | null;
  categoryId: number | null;
  mainPageUrl: string | null;
  subscribeUrl: string | null;
  issueCycle: string | null;
  sender: string | null;
  subscribeMethod: string | null;
  previousNewsletterUrl: string | null;
  missingFields: string[];
}

export interface NewsletterRequestDetail {
  id: number;
  requestedName: string;
  requestedUrl: string;
  requesterMemberId: number;
  reason: string | null;
  status: NewsletterRequestStatus;
  likeCount: number;
  newsletterId: number | null;
  rejectReason: string | null;
  createdAt: string;
  draft: NewsletterRequestDraft;
}

export type UpdateNewsletterRequestDraftRequest = {
  name?: string;
  description?: string;
  imageUrl?: string;
  email?: string;
  categoryId?: number;
  mainPageUrl?: string;
  subscribeUrl?: string;
  issueCycle?: string;
  sender?: string;
  subscribeMethod?: string;
  previousNewsletterUrl?: string;
};

export const NEWSLETTER_REQUEST_STATUS_LABELS: Record<
  NewsletterRequestStatus,
  string
> = {
  RECEIVED: '접수됨',
  REVIEWING: '검토 대기',
  APPROVED: '등록됨',
  REJECTED: '반려됨',
};

export const DRAFT_COLLECT_STATUS_LABELS: Record<DraftCollectStatus, string> = {
  PENDING: '수집 대기',
  COLLECTING: '수집 중',
  SUCCESS: '수집 완료',
  FAILED: '수집 실패',
};

export const DRAFT_FIELD_LABELS: Record<string, string> = {
  name: '이름',
  description: '설명',
  imageUrl: '썸네일 이미지',
  email: '발송자 이메일',
  categoryId: '카테고리',
  mainPageUrl: '홈페이지 URL',
  subscribeUrl: '구독 페이지 URL',
  issueCycle: '발행 주기',
  sender: '발송자 이름',
};
