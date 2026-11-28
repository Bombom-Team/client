import { fetcher } from '@bombom/shared/apis';

// TODO(BOM-1329): 백엔드 배포 후 OpenAPI 타입으로 교체
export type LiteracyQuizPlatform = 'WEB' | 'APP';

// TODO(BOM-1329): 백엔드 배포 후 OpenAPI 타입으로 교체
export interface LiteracyQuizRecord {
  nickname: string | null;
  correctCount: number;
  elapsedSeconds: number;
}

// TODO(BOM-1329): 백엔드 배포 후 OpenAPI 타입으로 교체
export interface GetLiteracyQuizSummaryResponse {
  participantCount: number;
  topRanker: {
    nickname: string;
    correctCount: number;
    elapsedSeconds: number;
  } | null;
}

export const getLiteracyQuizSummary = async () => {
  return await fetcher.get<GetLiteracyQuizSummaryResponse>({
    path: '/literacy-quiz/summary',
  });
};

// TODO(BOM-1329): 백엔드 배포 후 OpenAPI 타입으로 교체
// fetcher의 JsonBody(Record<string, unknown>)를 만족해야 해서 interface 대신 type으로 선언한다.
export type PostLiteracyQuizAttemptParams = {
  visitorId: string;
  invitedByCode?: string;
  entrySource?: string;
  platform: LiteracyQuizPlatform;
};

// TODO(BOM-1329): 백엔드 배포 후 OpenAPI 타입으로 교체
export interface PostLiteracyQuizAttemptResponse {
  attemptCode: string;
  startedAt: string;
  ranked: boolean;
}

export const postLiteracyQuizAttempt = async (
  params: PostLiteracyQuizAttemptParams,
) => {
  return await fetcher.post<
    PostLiteracyQuizAttemptParams,
    PostLiteracyQuizAttemptResponse
  >({
    path: '/literacy-quiz/attempts',
    body: params,
  });
};

// TODO(BOM-1329): 백엔드 배포 후 OpenAPI 타입으로 교체
// fetcher의 JsonBody(Record<string, unknown>)를 만족해야 해서 interface 대신 type으로 선언한다.
export type PostLiteracyQuizSubmissionParams = {
  answers: number[][];
};

// TODO(BOM-1329): 백엔드 배포 후 OpenAPI 타입으로 교체
export interface LiteracyQuizQuestionResult {
  number: number;
  correct: boolean;
  answer: number[];
  explanation: string;
}

// TODO(BOM-1329): 백엔드 배포 후 OpenAPI 타입으로 교체
export interface PostLiteracyQuizSubmissionResponse {
  correctCount: number;
  elapsedSeconds: number;
  ranked: boolean;
  expectedRank: number | null;
  participantCount: number;
  questions: LiteracyQuizQuestionResult[];
}

export const postLiteracyQuizSubmission = async (
  attemptCode: string,
  params: PostLiteracyQuizSubmissionParams,
) => {
  return await fetcher.post<
    PostLiteracyQuizSubmissionParams,
    PostLiteracyQuizSubmissionResponse
  >({
    path: `/literacy-quiz/attempts/${attemptCode}/submission`,
    body: params,
  });
};

// TODO(BOM-1329): 백엔드 배포 후 OpenAPI 타입으로 교체
// fetcher의 JsonBody(Record<string, unknown>)를 만족해야 해서 interface 대신 type으로 선언한다.
export type PutLiteracyQuizNicknameParams = {
  nickname: string;
};

// TODO(BOM-1329): 백엔드 배포 후 OpenAPI 타입으로 교체
export interface PutLiteracyQuizNicknameResponse {
  rank: number;
}

export const putLiteracyQuizNickname = async (
  attemptCode: string,
  params: PutLiteracyQuizNicknameParams,
) => {
  return await fetcher.put<
    PutLiteracyQuizNicknameParams,
    PutLiteracyQuizNicknameResponse
  >({
    path: `/literacy-quiz/attempts/${attemptCode}/nickname`,
    body: params,
  });
};

// TODO(BOM-1329): 백엔드 배포 후 OpenAPI 타입으로 교체
export interface GetLiteracyQuizRankingParams {
  attemptCode?: string;
}

// TODO(BOM-1329): 백엔드 배포 후 OpenAPI 타입으로 교체
export interface LiteracyQuizRankingEntry extends LiteracyQuizRecord {
  rank: number;
  me: boolean;
}

// TODO(BOM-1329): 백엔드 배포 후 OpenAPI 타입으로 교체
export interface GetLiteracyQuizRankingResponse {
  participantCount: number;
  top: LiteracyQuizRankingEntry[];
  me?: (LiteracyQuizRecord & { rank: number }) | null;
  around?: LiteracyQuizRankingEntry[] | null;
}

export const getLiteracyQuizRanking = async ({
  attemptCode,
}: GetLiteracyQuizRankingParams) => {
  return await fetcher.get<GetLiteracyQuizRankingResponse>({
    path: '/literacy-quiz/ranking',
    query: { attemptCode },
  });
};

// TODO(BOM-1329): 백엔드 배포 후 OpenAPI 타입으로 교체
export interface GetLiteracyQuizChallengeParams {
  attemptCode: string;
}

// TODO(BOM-1329): 백엔드 배포 후 OpenAPI 타입으로 교체
export type GetLiteracyQuizChallengeResponse = LiteracyQuizRecord;

export const getLiteracyQuizChallenge = async ({
  attemptCode,
}: GetLiteracyQuizChallengeParams) => {
  return await fetcher.get<GetLiteracyQuizChallengeResponse>({
    path: `/literacy-quiz/challenges/${attemptCode}`,
  });
};

// TODO(BOM-1329): 백엔드 배포 후 OpenAPI 타입으로 교체
// fetcher의 JsonBody(Record<string, unknown>)를 만족해야 해서 interface 대신 type으로 선언한다.
export type PostLiteracyQuizClaimParams = {
  visitorId: string;
};

export const postLiteracyQuizClaim = async (
  params: PostLiteracyQuizClaimParams,
) => {
  return await fetcher.post<PostLiteracyQuizClaimParams, void>({
    path: '/literacy-quiz/attempts/claim',
    body: params,
  });
};
