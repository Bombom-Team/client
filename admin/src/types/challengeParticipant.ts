export interface ChallengeParticipant {
  memberId: number;
  nickname: string;
  challengeTeamId: number | null;
  completedDays: number;
  isSurvived: boolean;
}
