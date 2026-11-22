import { fetcher } from '@bombom/shared/apis';

// TODO(BOM-1319): 백엔드 배포 후 OpenAPI 타입으로 교체
export type SignupSource =
  | 'INSTAGRAM'
  | 'THREADS'
  | 'X'
  | 'YOUTUBE'
  | 'SEARCH'
  | 'FRIEND'
  | 'BLOG_CAFE'
  | 'NEWSLETTER'
  | 'APP_STORE'
  | 'ETC';

// TODO(BOM-1319): 백엔드 배포 후 OpenAPI 타입으로 교체
export interface GetSignupSourceStatusResponse {
  needsSignupSource: boolean;
}

export const getSignupSourceStatus = async () => {
  return await fetcher.get<GetSignupSourceStatusResponse>({
    path: '/members/me/signup-source',
  });
};

// TODO(BOM-1319): 백엔드 배포 후 OpenAPI 타입으로 교체
// fetcher의 JsonBody(Record<string, unknown>)를 만족해야 해서 interface 대신 type으로 선언한다.
export type PostSignupSourceParams = {
  source: SignupSource;
  detail?: string;
};

export const postSignupSource = async (params: PostSignupSourceParams) => {
  return await fetcher.post<PostSignupSourceParams, void>({
    path: '/members/me/signup-source',
    body: params,
  });
};

// TODO(BOM-1319): 백엔드 배포 후 OpenAPI 타입으로 교체
export interface SignupRecommendation {
  newsletterId: number;
  name: string;
  imageUrl: string | null;
  description: string;
  subscribeUrl: string;
  category: string;
  subscriberCount: number;
  arrivalDays: string | null;
}

// TODO(BOM-1319): 백엔드 배포 후 OpenAPI 타입으로 교체
export interface GetSignupRecommendationsResponse {
  categories: string[];
  newsletters: SignupRecommendation[];
}

export const getSignupRecommendations = async () => {
  return await fetcher.get<GetSignupRecommendationsResponse>({
    path: '/newsletters/signup-recommendations',
  });
};
