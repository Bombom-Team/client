import { fetcher } from '@bombom/shared/apis';
import type {
  CreateNewsletterRequestBody,
  CreateNewsletterRequestResponse,
  NewsletterRequest,
  NewsletterRequestCheck,
  NewsletterRequestSuggestions,
} from '@/types/newsletterRequest';

export const getNewsletterRequests = async () => {
  return fetcher.get<NewsletterRequest[]>({
    path: '/newsletter-requests',
  });
};

export const getMyNewsletterRequests = async () => {
  return fetcher.get<NewsletterRequest[]>({
    path: '/newsletter-requests/me',
  });
};

export type GetNewsletterRequestSuggestionsParams = {
  keyword: string;
};

export const getNewsletterRequestSuggestions = async ({
  keyword,
}: GetNewsletterRequestSuggestionsParams) => {
  return fetcher.get<NewsletterRequestSuggestions>({
    path: '/newsletter-requests/suggestions',
    query: { keyword },
  });
};

export type GetNewsletterRequestCheckParams = {
  url: string;
};

export const getNewsletterRequestCheck = async ({
  url,
}: GetNewsletterRequestCheckParams) => {
  return fetcher.get<NewsletterRequestCheck>({
    path: '/newsletter-requests/check',
    query: { url },
  });
};

export const postNewsletterRequest = async (
  body: CreateNewsletterRequestBody,
) => {
  return fetcher.post<
    CreateNewsletterRequestBody,
    CreateNewsletterRequestResponse
  >({
    path: '/newsletter-requests',
    body,
  });
};

export type NewsletterRequestSupporterParams = {
  newsletterRequestId: number;
};

export const postNewsletterRequestSupporter = async ({
  newsletterRequestId,
}: NewsletterRequestSupporterParams) => {
  return fetcher.post({
    path: `/newsletter-requests/${newsletterRequestId}/supporters`,
  });
};

export const deleteNewsletterRequestSupporter = async ({
  newsletterRequestId,
}: NewsletterRequestSupporterParams) => {
  return fetcher.delete({
    path: `/newsletter-requests/${newsletterRequestId}/supporters`,
  });
};
