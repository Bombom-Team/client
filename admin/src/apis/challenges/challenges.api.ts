import { ApiError, fetcher } from '@bombom/shared/apis';
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
