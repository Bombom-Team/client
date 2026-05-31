import type { GetChallengesTeamsProgressResponse } from '@/apis/challenge/challenge.api';

export type DailyStatus =
  GetChallengesTeamsProgressResponse['members'][number]['dailyProgresses'][number]['status'];
