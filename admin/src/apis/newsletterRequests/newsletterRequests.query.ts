import { queryOptions, useMutation } from '@tanstack/react-query';
import {
  approveNewsletterRequest,
  getNewsletterRequest,
  getNewsletterRequests,
  type GetNewsletterRequestsParams,
  recollectNewsletterRequest,
  rejectNewsletterRequest,
  updateNewsletterRequestDraft,
} from './newsletterRequests.api';

export const newsletterRequestsQueries = {
  all: ['newsletter-requests'] as const,

  list: (params: GetNewsletterRequestsParams = {}) =>
    queryOptions({
      queryKey: ['newsletter-requests', params] as const,
      queryFn: () => getNewsletterRequests(params),
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: ['newsletter-requests', 'detail', id] as const,
      queryFn: () => getNewsletterRequest(id),
    }),
};

export const useUpdateNewsletterRequestDraftMutation = () => {
  return useMutation({
    mutationFn: updateNewsletterRequestDraft,
  });
};

export const useRecollectNewsletterRequestMutation = () => {
  return useMutation({
    mutationFn: recollectNewsletterRequest,
  });
};

export const useApproveNewsletterRequestMutation = () => {
  return useMutation({
    mutationFn: approveNewsletterRequest,
  });
};

export const useRejectNewsletterRequestMutation = () => {
  return useMutation({
    mutationFn: rejectNewsletterRequest,
  });
};
