export interface ChallengeParticipant {
  participantId: number;
  nickname: string;
  challengeTeamId: number | null;
  completedDays: number;
  isSurvived: boolean;
}
