import { ApiError, fetcher } from '@bombom/shared/apis';
import { ENV } from '@bombom/shared/env';
import type { PageableResponse } from '@/apis/types/PageableResponse';
import type {
  Challenge,
  ChallengeDailyGuide,
  ChallengeSchedule,
  ChallengeStatus,
} from '@/types/challenge';
import type { ChallengeParticipant } from '@/types/challengeParticipant';

export type GetChallengesParams = {
  status?: ChallengeStatus;
  page?: number;
  size?: number;
  sort?: string[];
};

export type GetChallengesResponse = PageableResponse<Challenge>;

export type CreateChallengePayload = {
  name: string;
  generation: number;
  newsletterGroupId: number;
  startDate?: string;
  endDate?: string;
};

export type UpdateChallengePayload = Partial<CreateChallengePayload>;

export type GetChallengeParticipantsParams = {
  challengeTeamId?: number;
  hasTeam?: boolean;
  isSurvived?: boolean;
  page?: number;
  size?: number;
  sort?: string[];
};

export type GetChallengeParticipantsResponse =
  PageableResponse<ChallengeParticipant>;

export const getChallenges = async (params: GetChallengesParams = {}) => {
  return fetcher.get<GetChallengesResponse>({
    path: '/challenges',
    query: params,
  });
};

export const createChallenge = async (payload: CreateChallengePayload) => {
  return fetcher.post<CreateChallengePayload, void>({
    path: '/challenges',
    body: payload,
  });
};

export const updateChallenge = async ({
  challengeId,
  payload,
}: {
  challengeId: number;
  payload: UpdateChallengePayload;
}) => {
  return fetcher.patch<UpdateChallengePayload, void>({
    path: `/challenges/${challengeId}`,
    body: payload,
  });
};

export const deleteChallenge = async (challengeId: number) => {
  return fetcher.delete<never, void>({
    path: `/challenges/${challengeId}`,
  });
};

export const getChallengeDetail = async (challengeId: number) => {
  return fetcher.get<Challenge>({
    path: `/challenges/${challengeId}`,
  });
};

export const getChallengeSchedule = async (challengeId: number) => {
  return fetcher.get<ChallengeSchedule[]>({
    path: `/challenges/${challengeId}/schedule`,
  });
};

export const getChallengeDailyGuideImages = async (challengeId: number) => {
  return fetcher.get<string[]>({
    path: `/challenges/${challengeId}/daily-guides/images`,
  });
};

export type CreateChallengeDailyGuideRequest = {
  dayIndex: number;
  type: 'READ' | 'COMMENT' | 'SHARING' | 'REMIND';
  fileName?: string;
  imageUrl?: string;
  notice?: string;
};

export type UpdateChallengeDailyGuideRequest = {
  dayIndex?: number;
  type?: 'READ' | 'COMMENT' | 'SHARING' | 'REMIND';
  fileName?: string;
  imageUrl?: string;
  notice?: string;
};

const requestChallengeDailyGuide = async ({
  url,
  method,
  image,
  request,
  defaultErrorMessage,
}: {
  url: URL;
  method: 'POST' | 'PATCH';
  image?: File;
  request: CreateChallengeDailyGuideRequest | UpdateChallengeDailyGuideRequest;
  defaultErrorMessage: string;
}) => {
  const formData = new FormData();

  if (image) {
    formData.append('image', image);
  }

  formData.append(
    'request',
    new Blob([JSON.stringify(request)], {
      type: 'application/json',
    }),
  );

  const response = await fetch(url, {
    method,
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const contentType = response.headers.get('Content-Type');
    let errorMessage = defaultErrorMessage;
    let rawBody;

    try {
      if (contentType?.includes('application/json')) {
        rawBody = await response.json();
        errorMessage = rawBody.message ?? errorMessage;
      } else {
        rawBody = await response.text();
        errorMessage = rawBody || errorMessage;
      }
    } catch {
      errorMessage = '응답 파싱에 실패했습니다.';
    }

    throw new ApiError(response.status, errorMessage, rawBody);
  }

  const contentLength = response.headers.get('Content-Length');
  const contentType = response.headers.get('Content-Type');

  if (response.status === 204 || contentLength === '0') {
    return null;
  }

  if (!contentType?.includes('application/json')) {
    return null;
  }

  return response.json() as Promise<ChallengeDailyGuide | null>;
};

export const getChallengeDailyGuide = async ({
  challengeId,
  dayIndex,
}: {
  challengeId: number;
  dayIndex: number;
}) => {
  try {
    return await fetcher.get<ChallengeDailyGuide>({
      path: `/challenges/${challengeId}/daily-guides/days/${dayIndex}`,
    });
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.status === 404 ||
        error.message.includes('해당 dayIndex의 가이드 없음') ||
        error.message.includes('존재하지 않는'))
    ) {
      return null;
    }

    throw error;
  }
};

export const createChallengeDailyGuide = async ({
  challengeId,
  image,
  request,
}: {
  challengeId: number;
  image?: File;
  request: CreateChallengeDailyGuideRequest;
}) => {
  return requestChallengeDailyGuide({
    url: new URL(`${ENV.baseUrl}/challenges/${challengeId}/daily-guides`),
    method: 'POST',
    image,
    request,
    defaultErrorMessage: '데일리 가이드 생성에 실패했습니다.',
  });
};

export const updateChallengeDailyGuide = async ({
  challengeId,
  guideId,
  image,
  request,
}: {
  challengeId: number;
  guideId: number;
  image?: File;
  request: UpdateChallengeDailyGuideRequest;
}) => {
  return requestChallengeDailyGuide({
    url: new URL(
      `${ENV.baseUrl}/challenges/${challengeId}/daily-guides/${guideId}`,
    ),
    method: 'PATCH',
    image,
    request,
    defaultErrorMessage: '데일리 가이드 수정에 실패했습니다.',
  });
};

export type DeleteChallengeDailyGuideParams = {
  challengeId: number;
  guideId: number;
};

export const deleteChallengeDailyGuide = async ({
  challengeId,
  guideId,
}: DeleteChallengeDailyGuideParams) => {
  return fetcher.delete<never, void>({
    path: `/challenges/${challengeId}/daily-guides/${guideId}`,
  });
};

export const getChallengeParticipants = async ({
  challengeId,
  params = {},
}: {
  challengeId: number;
  params?: GetChallengeParticipantsParams;
}) => {
  const query = {
    ...params,
    hasTeam:
      typeof params.hasTeam === 'boolean' ? String(params.hasTeam) : undefined,
    isSurvived:
      typeof params.isSurvived === 'boolean'
        ? String(params.isSurvived)
        : undefined,
  };

  return fetcher.get<GetChallengeParticipantsResponse>({
    path: `/challenges/${challengeId}/participants`,
    query,
  });
};

export type AssignChallengeTeamsParams = {
  challengeId: number;
  maxTeamSize: number;
};

export const assignChallengeTeams = async ({
  challengeId,
  maxTeamSize,
}: AssignChallengeTeamsParams) => {
  return fetcher.post<{ maxTeamSize: number }, void>({
    path: `/challenges/${challengeId}/teams/assignment`,
    body: { maxTeamSize },
  });
};

export type UpdateParticipantTeamParams = {
  challengeId: number;
  participantId: number;
  challengeTeamId: number;
};

export const updateParticipantTeam = async ({
  challengeId,
  participantId,
  challengeTeamId,
}: UpdateParticipantTeamParams) => {
  return fetcher.patch<{ challengeTeamId: number }, void>({
    path: `/challenges/${challengeId}/participants/${participantId}/team`,
    body: { challengeTeamId },
  });
};

export interface ChallengeTeam {
  id: number;
  challengeId: number;
  progress: number;
}

export const getChallengeTeams = async (challengeId: number) => {
  return fetcher.get<ChallengeTeam[]>({
    path: `/challenges/${challengeId}/teams`,
  });
};

export type CreateChallengeTeamsParams = {
  challengeId: number;
  count: number;
};

export const createChallengeTeams = async ({
  challengeId,
  count,
}: CreateChallengeTeamsParams) => {
  return fetcher.post<{ count: number }, void>({
    path: `/challenges/${challengeId}/teams`,
    body: { count },
  });
};

export type DeleteChallengeTeamParams = {
  challengeId: number;
  teamId: number;
};

export const deleteChallengeTeam = async ({
  challengeId,
  teamId,
}: DeleteChallengeTeamParams) => {
  return fetcher.delete({
    path: `/challenges/${challengeId}/teams/${teamId}`,
  });
};

export type GrantChallengeParticipantsShieldParams = {
  challengeId: number;
  count: number;
};

export const grantChallengeParticipantsShield = async ({
  challengeId,
  count,
}: GrantChallengeParticipantsShieldParams) => {
  return fetcher.post<{ count: number }, void>({
    path: `/challenges/${challengeId}/participants/shield`,
    body: { count },
  });
};
