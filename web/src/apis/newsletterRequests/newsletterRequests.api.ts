import { fetcher } from '@bombom/shared/apis';

// TODO(BOM-1245): 백엔드 배포 후 OpenAPI 타입으로 교체
export type NewsletterRequestStatus =
  | 'RECEIVED'
  | 'REVIEWING'
  | 'APPROVED'
  | 'REJECTED';

// TODO(BOM-1245): 백엔드 배포 후 OpenAPI 타입으로 교체
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

export type GetNewsletterRequestsResponse = NewsletterRequest[];

export const getNewsletterRequests = async () => {
  return fetcher.get<GetNewsletterRequestsResponse>({
    path: '/newsletter-requests',
  });
};

export type GetMyNewsletterRequestsResponse = NewsletterRequest[];

export const getMyNewsletterRequests = async () => {
  return fetcher.get<GetMyNewsletterRequestsResponse>({
    path: '/newsletter-requests/me',
  });
};

export interface GetNewsletterRequestSuggestionsParams {
  keyword: string;
}

// TODO(BOM-1245): 백엔드 배포 후 OpenAPI 타입으로 교체
export interface NewsletterSuggestion {
  newsletterId: number;
  name: string;
  imageUrl: string | null;
}

// TODO(BOM-1245): 백엔드 배포 후 OpenAPI 타입으로 교체
export interface GetNewsletterRequestSuggestionsResponse {
  requests: NewsletterRequest[];
  newsletters: NewsletterSuggestion[];
}

export const getNewsletterRequestSuggestions = async ({
  keyword,
}: GetNewsletterRequestSuggestionsParams) => {
  return fetcher.get<GetNewsletterRequestSuggestionsResponse>({
    path: '/newsletter-requests/suggestions',
    query: { keyword },
  });
};

export interface GetNewsletterRequestCheckParams {
  url: string;
}

// TODO(BOM-1245): 백엔드 배포 후 OpenAPI 타입으로 교체
export interface GetNewsletterRequestCheckResponse {
  result: 'AVAILABLE' | 'REQUESTED' | 'REGISTERED';
  newsletterRequestId: number | null;
  newsletterId: number | null;
}

export const getNewsletterRequestCheck = async ({
  url,
}: GetNewsletterRequestCheckParams) => {
  return fetcher.get<GetNewsletterRequestCheckResponse>({
    path: '/newsletter-requests/check',
    query: { url },
  });
};

// TODO(BOM-1245): 백엔드 배포 후 OpenAPI 타입으로 교체
// fetcher의 JsonBody 제약(인덱스 시그니처)을 만족해야 해서 interface 대신 type으로 둔다.
export type PostNewsletterRequestParams = {
  name: string;
  url: string;
  reason?: string;
  isNotificationEnabled: boolean;
};

// TODO(BOM-1245): 백엔드 배포 후 OpenAPI 타입으로 교체
export interface PostNewsletterRequestResponse {
  newsletterRequestId: number;
}

export const postNewsletterRequest = async (
  body: PostNewsletterRequestParams,
) => {
  return fetcher.post<
    PostNewsletterRequestParams,
    PostNewsletterRequestResponse
  >({
    path: '/newsletter-requests',
    body,
  });
};

export interface NewsletterRequestLikeParams {
  newsletterRequestId: number;
}

// TODO(BOM-1245): 백엔드 배포 후 OpenAPI 타입으로 교체
export interface NewsletterRequestLikeResponse {
  likeCount: number;
}

export const putNewsletterRequestLike = async ({
  newsletterRequestId,
}: NewsletterRequestLikeParams) => {
  return fetcher.put<Record<string, never>, NewsletterRequestLikeResponse>({
    path: `/newsletter-requests/${newsletterRequestId}/like`,
  });
};

export const deleteNewsletterRequestLike = async ({
  newsletterRequestId,
}: NewsletterRequestLikeParams) => {
  return fetcher.delete<Record<string, never>, NewsletterRequestLikeResponse>({
    path: `/newsletter-requests/${newsletterRequestId}/like`,
  });
};
