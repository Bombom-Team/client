import { useMemo } from 'react';
import type { GetTeamChallengeProgressResponse } from '@/apis/challenge/challenge.api';

const isSuccessStatus = (status?: string) =>
  status === 'COMPLETE' || status === 'SHIELD';

const buildDateRange = (startDate: Date, endDate: Date) => {
  const dateRange: Date[] = [];

  for (let current = new Date(startDate); current <= endDate; ) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) {
      dateRange.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }

  return dateRange;
};

export const useChallengeDashboardData = (
  data: GetTeamChallengeProgressResponse,
) =>
  useMemo(() => {
    const { challenge, members } = data;
    const startDate = new Date(challenge.startDate);
    const endDate = new Date(challenge.endDate);
    const dateRange = buildDateRange(startDate, endDate);
    const { totalDays } = challenge;

    const memberRows = members.map((member) => {
      const progressMap = new Map(
        member.dailyProgresses.map((progress) => [
          progress.date,
          isSuccessStatus(progress.status) ? progress.status : undefined,
        ]),
      );
      const completedCount = member.dailyProgresses.filter((progress) =>
        isSuccessStatus(progress.status),
      ).length;
      const achievementRate =
        totalDays === 0 ? 0 : (completedCount / totalDays) * 100;

      return {
        member,
        progressMap,
        completedCount,
        achievementRate,
        isSurvived: member.isSurvived,
      };
    });

    return { dateRange, memberRows };
  }, [data]);
