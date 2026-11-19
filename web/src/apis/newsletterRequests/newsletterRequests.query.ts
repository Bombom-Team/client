import { queryOptions } from '@tanstack/react-query';
import {
  getMyNewsletterRequests,
  getNewsletterRequestCheck,
  getNewsletterRequests,
  getNewsletterRequestSuggestions,
  type GetNewsletterRequestCheckParams,
  type GetNewsletterRequestSuggestionsParams,
} from './newsletterRequests.api';

export const newsletterRequestsQueries = {
  newsletterRequests: () =>
    queryOptions({
      queryKey: ['newsletter-requests'],
      queryFn: getNewsletterRequests,
    }),
  myNewsletterRequests: () =>
    queryOptions({
      queryKey: ['newsletter-requests', 'me'],
      queryFn: getMyNewsletterRequests,
    }),
  newsletterRequestSuggestions: (
    params: GetNewsletterRequestSuggestionsParams,
  ) =>
    queryOptions({
      queryKey: ['newsletter-requests', 'suggestions', params],
      queryFn: () => getNewsletterRequestSuggestions(params),
      enabled: params.keyword.replace(/\s/g, '').length >= 2,
      staleTime: 30 * 1000,
    }),
  newsletterRequestCheck: (params: GetNewsletterRequestCheckParams) =>
    queryOptions({
      queryKey: ['newsletter-requests', 'check', params],
      queryFn: () => getNewsletterRequestCheck(params),
      staleTime: 0,
    }),
};
