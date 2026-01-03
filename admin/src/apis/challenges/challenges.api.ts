import { fetcher } from '@bombom/shared/apis';
import type { PageableResponse } from '@/apis/types/PageableResponse';
import type { Challenge, ChallengeStatus } from '@/types/challenge';
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
