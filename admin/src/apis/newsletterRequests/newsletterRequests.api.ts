import { fetcher } from '@bombom/shared/apis';

// TODO(BOM-1245): 백엔드 배포 후 OpenAPI 타입으로 교체
export type NewsletterRequestStatus =
  | 'RECEIVED'
  | 'REVIEWING'
  | 'APPROVED'
  | 'REJECTED';

// TODO(BOM-1245): 백엔드 배포 후 OpenAPI 타입으로 교체
export type DraftCollectStatus =
  | 'PENDING'
  | 'COLLECTING'
  | 'SUCCESS'
  | 'FAILED';

// TODO(BOM-1245): 백엔드 배포 후 OpenAPI 타입으로 교체
export type NewsletterRequestSummary = {
  id: number;
  requestedName: string;
  requestedUrl: string;
  status: NewsletterRequestStatus;
  likeCount: number;
  collectStatus: DraftCollectStatus | null;
  draftName: string | null;
  imageUrl: string | null;
  createdAt: string;
};

// TODO(BOM-1245): 백엔드 배포 후 OpenAPI 타입으로 교체
export type NewsletterRequestDraft = {
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
};

export type GetNewsletterRequestsParams = {
  status?: NewsletterRequestStatus;
};

export type GetNewsletterRequestsResponse = NewsletterRequestSummary[];

export const getNewsletterRequests = async (
  params: GetNewsletterRequestsParams = {},
) => {
  return fetcher.get<GetNewsletterRequestsResponse>({
    path: '/newsletter-requests',
    query: params,
  });
};

// TODO(BOM-1245): 백엔드 배포 후 OpenAPI 타입으로 교체
export type GetNewsletterRequestResponse = {
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
};

export const getNewsletterRequest = async (id: number) => {
  return fetcher.get<GetNewsletterRequestResponse>({
    path: `/newsletter-requests/${id}`,
  });
};

// TODO(BOM-1245): 백엔드 배포 후 OpenAPI 타입으로 교체
// 초안 전체를 보낸다. null인 필드는 서버에서 비운다.
export type UpdateNewsletterRequestDraftBody = {
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
};

export type UpdateNewsletterRequestDraftParams = {
  id: number;
  body: UpdateNewsletterRequestDraftBody;
};

export const updateNewsletterRequestDraft = async ({
  id,
  body,
}: UpdateNewsletterRequestDraftParams) => {
  return fetcher.patch({
    path: `/newsletter-requests/${id}/draft`,
    body,
  });
};

export const recollectNewsletterRequest = async (id: number) => {
  return fetcher.post({
    path: `/newsletter-requests/${id}/recollect`,
  });
};

// TODO(BOM-1245): 백엔드 배포 후 OpenAPI 타입으로 교체
export type ApproveNewsletterRequestResponse = {
  newsletterId: number;
};

export const approveNewsletterRequest = async (id: number) => {
  return fetcher.post<Record<string, never>, ApproveNewsletterRequestResponse>({
    path: `/newsletter-requests/${id}/approve`,
  });
};

export type RejectNewsletterRequestParams = {
  id: number;
  reason: string;
};

export const rejectNewsletterRequest = async ({
  id,
  reason,
}: RejectNewsletterRequestParams) => {
  return fetcher.post({
    path: `/newsletter-requests/${id}/reject`,
    body: { reason },
  });
};
