import type {
  DraftCollectStatus,
  NewsletterRequestStatus,
} from '@/apis/newsletterRequests/newsletterRequests.api';

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
