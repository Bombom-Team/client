import type {
  NewsletterRequest,
  NewsletterRequestStatus,
} from '@/apis/newsletterRequests/newsletterRequests.api';

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
