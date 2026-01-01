import { useMemo } from 'react';
import { formatDate } from '@/utils/date';

type DailyStatus = 'COMPLETE' | 'SHIELD';

export interface ChallengeDashboardData {
  challenge: {
    startDate: string;
    endDate: string;
    totalDays?: number;
  };
  teamSummary?: {
    achievementAverage: number;
  };
  members: {
    memberId: number;
    nickname: string;
    is_survived: boolean;
    dailyProgress: {
      date: string;
      status: string;
    }[];
  }[];
}

const normalizeStatus = (status: string): DailyStatus | undefined =>
  status === 'COMPLETE' || status === 'SHIELD' ? status : undefined;

const isSuccessStatus = (status?: DailyStatus) =>
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

export const useChallengeDashboardData = (data: ChallengeDashboardData) =>
  useMemo(() => {
    const { challenge, members } = data;
    const startDate = new Date(challenge.startDate);
    const endDate = new Date(challenge.endDate);
    const dateRange = buildDateRange(startDate, endDate);

    const memberRows = members.map((member) => {
      const progressMap = new Map(
        member.dailyProgress.map((progress) => [
          progress.date,
          normalizeStatus(progress.status),
        ]),
      );
      const completedCount = dateRange.filter((date) => {
        const dateKey = formatDate(date, '-');
        const status = progressMap.get(dateKey);
        return isSuccessStatus(status);
      }).length;
      const achievementRate =
        dateRange.length === 0 ? 0 : (completedCount / dateRange.length) * 100;

      return {
        member,
        progressMap,
        completedCount,
        achievementRate,
        isFailed: achievementRate < 80,
      };
    });

    return { dateRange, memberRows };
  }, [data]);
