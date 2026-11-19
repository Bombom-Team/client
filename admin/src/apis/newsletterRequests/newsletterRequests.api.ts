import { fetcher } from '@bombom/shared/apis';
import type {
  NewsletterRequestDetail,
  NewsletterRequestStatus,
  NewsletterRequestSummary,
  UpdateNewsletterRequestDraftRequest,
} from '@/types/newsletterRequest';

export type GetNewsletterRequestsParams = {
  status?: NewsletterRequestStatus;
};

export const getNewsletterRequests = async (
  params: GetNewsletterRequestsParams = {},
) => {
  return fetcher.get<NewsletterRequestSummary[]>({
    path: '/newsletter-requests',
    query: params,
  });
};

export const getNewsletterRequest = async (id: number) => {
  return fetcher.get<NewsletterRequestDetail>({
    path: `/newsletter-requests/${id}`,
  });
};

export type UpdateNewsletterRequestDraftParams = {
  id: number;
  body: UpdateNewsletterRequestDraftRequest;
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

export const approveNewsletterRequest = async (id: number) => {
  return fetcher.post<Record<string, never>, { newsletterId: number }>({
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
